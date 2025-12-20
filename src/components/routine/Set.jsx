import { useState } from 'react';
import { Delete, Confirm } from '../common/Icons';
import { Button, Typography, Tooltip, Input } from 'antd';
const { Text } = Typography; // اینجا تداخلی با DOM نداریم
export default function Set({myself, trashId, day, workout, setRoutines, Routines, foundRoutine, showWeight}) {
    const [repEditing, setrepEditing] = useState(false)
    const [weightEditing, setweightEditing] = useState(false)

    const [currentReps, setCurrentReps] = useState(myself.reps); 
    const [currentWeight, setCurrentWeight] = useState(myself.weight || false);

    function handleRepInputChange(e) {
        setCurrentReps(Number(e.target.value))
    }
    function handleWeightInputChange (e) {
        setCurrentWeight(Number(e.target.value))
    }
    function deleteSetFromWorkoutFromDayFromRoutine(e) {
        e.preventDefault()
        setRoutines(Routines.map(r => 
            r.id === foundRoutine.id ?
            {...r, days: r.days.map(d => 
                d.id !== day.id ?
                d :
                {...d, workouts: d.workouts.map( w=>
                    w.id !== workout.id ? 
                    w : 
                    {...w, exerciseSets: w.exerciseSets.filter(s => s.id !== myself.id)}
                )}
            )} :
            r
        ))
    }
    function toggleRepEditing(e) {
        e.preventDefault()
        if (repEditing) {
            setRoutines(Routines.map(r => 
                r.id === foundRoutine.id ?
                {...r, days: r.days.map(d => 
                    d.id !== day.id ?
                    d :
                    {...d, workouts: d.workouts.map( w=>
                        w.id !== workout.id ? 
                        w : 
                        {...w, exerciseSets: w.exerciseSets.map(s => s.id == myself.id ? {...s, reps: currentReps} : s)}
                    )}
                )} :
                r
            ))
            setrepEditing(false)
        } else {
            setrepEditing(true)
        }
    }


    function toggleWeightEditing(e) {
        e.preventDefault()
        if (weightEditing) {
            setRoutines(Routines.map(r => 
                r.id === foundRoutine.id ?
                {...r, days: r.days.map(d => 
                    d.id !== day.id ?
                    d :
                    {...d, workouts: d.workouts.map( w=>
                        w.id !== workout.id ? 
                        w : 
                        {...w, exerciseSets: w.exerciseSets.map(s => s.id == myself.id ? {...s, weight: currentWeight} : s)}
                    )}
                )} :
                r
            ))
            setweightEditing(false)
        } else {
            setweightEditing(true)
        }
    }
    return (
        <div 
            key={myself.id} 
            style={{ 
                display: 'grid', 
                gridTemplateColumns: '30px 1fr 1fr 50px', 
                gap: '10px',
                alignItems: 'center',
                padding: '5px 0',
                borderBottom: '1px dashed #f0f0f0' 
            }}
        >
            {/* ۱. شماره ست */}
            <Text type="secondary" style={{ fontSize: '0.8em' }}>
                {trashId + 1}
            </Text>
            
            {/* ۲. وزن */}
            <Text style={{ fontWeight: 500 }}>
                {weightEditing ? 
                <span className='inline-edit-form' style={{width: '60px', minHeight: '48px'}}>
                    <Input 
                        type="number"
                        value={currentWeight} 
                        onChange={handleWeightInputChange}
                        size="small" 
                        style={{ width: '60px', textAlign: 'center', height: '32px' }} 
                    />
                    <Button style={{width: '60px', height: '32px'}} size="small" type="primary" onClick={toggleWeightEditing}>{Confirm}</Button>
                </span>
                : 
                <span onClick={showWeight ? toggleWeightEditing : ()=>{return;}}> 
                    {showWeight && myself.weight}
                    <span className="set-unit">kgs</span>
                </span>
                }
            </Text>
            
            {/* ۲. تکرار */}
            <Text style={{ fontWeight: 500 }}>
                {repEditing ? 
                <span className='inline-edit-form' style={{width: '60px', minHeight: '48px'}}>
                    <Input 
                        type="number"
                        value={currentReps} 
                        onChange={handleRepInputChange} 
                        min="0"
                        size="small" 
                        style={{ width: '60px', textAlign: 'center', height: '32px' }} 
                    />
                    <Button style={{width: '60px', height: '32px'}} size="small" type="primary" onClick={toggleRepEditing}>{Confirm}</Button>
                </span>
                : 
                <span onClick={toggleRepEditing}> 
                    {myself.reps}
                    <span className="set-unit">reps</span>
                </span>
                }
            </Text>
            
            {/* ۴. دکمه حذف */}
            <Tooltip title="حذف ست از روتین">
                <Button 
                    type="text" 
                    danger 
                    size="small" 
                    icon={Delete} // استفاده مستقیم از آیکون
                    onClick={deleteSetFromWorkoutFromDayFromRoutine} 
                />
            </Tooltip>
        </div>
    )
}