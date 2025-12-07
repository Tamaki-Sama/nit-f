// WorkoutComponent.jsx - آپدیت شده برای FitNotes Style و Weight/Reps
import { Button, Input } from 'antd';
import { useEffect, useState } from "react";
import Set from "./Set-component";
import '../App.css'
import {Delete, Add} from './Icons'

export default function WorkoutComponent ({workout, workoutID, effectLogData, OnSetChecked}) {
    // دو حالت جداگانه برای Reps و Weight
    const [NewSetReps, setNewSetReps] = useState(5) // مقدار پیش فرض 5
    // اگر تمرین وزن داشته باشد، پیش‌فرض 5، در غیر این صورت undefined برای عدم نمایش در فرم
    const initialWeight = workout.countsByWeight ? 5 : undefined; 
    const [NewSetWeight, setNewSetWeight] = useState(initialWeight);

    // 💡 هرگاه workoutID عوض شد (ورک‌آوت جدید آمد)، حالت‌های ورودی را ریست کن
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
        
        // 💡 سختگیری: پیدا کردن بزرگترین ID ست برای تضمین منحصر به فرد بودن ID جدید
        const maxSetId = workout.sets.reduce((max, set) => set.id > max ? set.id : max, 0);
        const nextSetId = maxSetId + 1;

        const newSetObject = {
            id: nextSetId,
            reps: Number(NewSetReps),
            // اگر تمرین countsByWeight باشد، وزن را ثبت کن، در غیر این صورت undefined
            weight: workout.countsByWeight ? Number(NewSetWeight) : undefined, 
            RepEdit: false,
            WeightEdit: false,
            done: false,
        }
        
        // اگر وزن ضروری بود ولی وارد نشد (فقط برای اطمینان بیشتر، چون required در input هست)
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

    return (
        <>
            <div className="workout" key={workoutID}>
                <div className="workout-header">
                    <span className='workout-name'>{workout.name}</span>
                    <div className="buttons" style={{width: '30%'}}>
                        <Button 
                            type="text" 
                            danger 
                            icon={Delete} 
                            onClick={deletethisworkout} 
                            size="large"
                        />

                        {!workout.editing &&<Button 
                            type="text" 
                            icon={Add} 
                            onClick={handleEditButton} 
                            size="large"
                        />}             
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