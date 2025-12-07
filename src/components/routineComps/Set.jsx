import { Delete } from '../Icons';
import { Button, Typography, Space, Tooltip } from 'antd';
const { Text } = Typography; // اینجا تداخلی با DOM نداریم
export default function Set({myself, trashId, day, workout, setRoutines, Routines, foundRoutine, showWeight}) {
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
                {showWeight && myself.weight} <Text type="secondary">{showWeight && 'kg'}</Text>
            </Text>
            
            {/* ۳. تکرار */}
            <Text style={{ fontWeight: 500 }}>
                {myself.reps} <Text type="secondary">{myself.specialRepFlag || 'reps'}</Text>
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