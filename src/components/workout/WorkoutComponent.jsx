// WorkoutComponent.jsx - آپدیت شده برای FitNotes Style و Weight/Reps
import { Button, Input } from 'antd';
import { useEffect, useState } from "react";
import Set from "./SetComponent";
import '../../styles/Log.css'
import {Delete, Add, CheckmarkDoneSharp, Confirm} from '../common/Icons'

export default function WorkoutComponent ({workout, workoutID, effectLogData, OnSetChecked}) {
    // دو حالت جداگانه برای Reps و Weight
    const [NewSetReps, setNewSetReps] = useState(5) // مقدار پیش فرض 5
    // اگر تمرین وزن داشته باشد، پیش‌فرض 5، در غیر این صورت undefined برای عدم نمایش در فرم
    const initialWeight = workout.countsByWeight ? 5 : undefined; 
    const [NewSetWeight, setNewSetWeight] = useState(initialWeight);

    useEffect(() => {
        setNewSetReps(5);
        setNewSetWeight(initialWeight);
    }, [workoutID, workout.countsByWeight]);


    function handleRepsChange(e) {
        setNewSetReps(Number(e.target.value));
    }
    function handleWeightChange(e) {
        setNewSetWeight(Number(e.target.value));
    }

    function deletethisworkout(e) {
        e.preventDefault()
        effectLogData({
            type: "Delete",
            log_id: workoutID
        })
    }
    function handleEditButton(e) {
        e.preventDefault()
        effectLogData({
            type: "Start Edit",
            log_id: workoutID
        });
    }

    function handleEditConfirmButton(e) {
        e.preventDefault()
        
        const maxSetId = workout.sets.reduce((max, set) => set.id > max ? set.id : max, 0);
        const nextSetId = maxSetId + 1;

        const newSetObject = {
            id: nextSetId,
            reps: Number(NewSetReps),
            weight: workout.countsByWeight ? Number(NewSetWeight) : undefined, 
            RepEdit: false,
            WeightEdit: false,
            done: false,
        }
        
        if (workout.countsByWeight && newSetObject.weight === undefined) {
             console.error("Weight is required for this exercise.");
             return;
        }

        const updatedSets = [...workout.sets, newSetObject]
        effectLogData({
            type: "Confirm Edit",
            log_id: workoutID,
            log_sets: updatedSets
        })
    }
    function handleCheckAll() {
        if(workout.sets.find(s => !s.done)) {
            const multiChangeSets = workout.sets.map( s=>
                ({...s, done: true})
            )
            effectLogData({
                type: "Confirm Edit",
                log_id: workoutID,
                log_sets: multiChangeSets
            })
        } else {
            const multiChangeSets = workout.sets.map( s=>
                ({...s, done: false})
            )
            effectLogData({
                type: "Confirm Edit",
                log_id: workoutID,
                log_sets: multiChangeSets
            })
        }
    }
    function handleEditEnd(e) {
        e.preventDefault()
        effectLogData({
            type: "End Edit",
            log_id: workoutID
        })
    }

    return (
        <>
            <div className="workout" key={workoutID}>
                <div className="workout-header">
                    <span className='workout-name'>{workout.name}</span>
                    <div className="buttons" style={{width: '30%'}}>
                        <Button 
                            type='text'
                            size='large'
                            onClick={handleCheckAll}
                            icon={<CheckmarkDoneSharp />}
                        />
                        <Button 
                            type="text" 
                            danger 
                            icon={Delete} 
                            onClick={deletethisworkout} 
                            size="large"
                        />

                        {!workout.editing ?<Button 
                            type="text" 
                            icon={Add} 
                            onClick={handleEditButton} 
                            size="large"
                        />:<Button 
                        type="text" 
                        icon={Confirm} 
                        onClick={handleEditEnd} 
                        size="large"
                    />
                        }
                    </div>

                </div>

                {workout.editing && (
                <form onSubmit={handleEditConfirmButton} className="add-set-form">

                    <Input.Group compact className='add-set-input-group' style={{ width: '100%' }}>
                        <Input 
                            type="number" 
                            placeholder="Reps"
                            value={NewSetReps} 
                            onChange={handleRepsChange}
                            min="1"
                            style={{ width: workout.countsByWeight ? '50%' : '100%' }} // توزیع عرض
                            required
                        />
                        {workout.countsByWeight && ( 
                            <Input 
                                type="number" 
                                placeholder="Weight"
                                value={NewSetWeight !== undefined ? NewSetWeight : ''} 
                                onChange={handleWeightChange}
                                min="1"
                                required={workout.countsByWeight}
                                style={{ width: '50%' }} // توزیع عرض
                            />
                        )}


                    </Input.Group>
                    <Button className='save-set-button' type="primary" htmlType="submit" size="large" style={{ width: '100%' }} icon={Add}>Add</Button>
                </form>
                )}
                
                <ul className="workout-setstable">
                    {/* رندر ست‌ها */}
                    {workout.sets.map((set, index) => {
                        return (
                            <Set 
                                key={"s-" + set.id} 
                                setIndex={index + 1} 
                                setObject={set} 
                                setID={set.id}
                                workoutID={workout.id} 
                                effectLogData={effectLogData} 
                                workoutSpecialRepFlag={workout.specialRepFlag} // پرچم واحد (m, km)
                                countsByWeight={workout.countsByWeight} // برای کنترل نمایش در ست
                                OnSetChecked={OnSetChecked}
                            />
                        )
                    })}
                </ul>
            </div>
        </>
    )
}