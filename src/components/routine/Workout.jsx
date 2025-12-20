import { useState } from "react";
import { Delete, Add } from "../common/Icons";
import { Card, Button, Input, Space, Typography, Tooltip } from 'antd';
const { Title } = Typography;
import Set from './Set'

export default function Workout({myself, Routines,setRoutines, day, foundRoutine, ExercisePrelist}) {
    const [weightInput, setWeightInput] = useState(0)
    const [repInput, setRepInput] = useState(0)

    function repInputChange(e) { setRepInput(Number(e.target.value)) }
    function weightInputChange(e) { setWeightInput(Number(e.target.value)) }

    const iHaveWeight = ExercisePrelist.find(e =>   
        e.name === myself.name
    )?.countsByWeight
    function deleteWorkoutFromDayFromRoutine(targetRoutine, targetDay, targetWorkout) {
        setRoutines(Routines.map(r => 
            r.id === targetRoutine.id ?
            {...r, days: r.days.map(day => 
                day.id !== targetDay.id ?
                day :
                {...day, workouts: day.workouts.filter(w => w.id !== targetWorkout.id)}
            )} :
            r
        ))
    }
    function addSetToWorkout() {
        setRoutines(Routines.map(r => 
            r.id === foundRoutine.id ?
            {...r, days: r.days.map(d =>
                d.id !== day.id ?
                d :
                {...d, workouts: d.workouts.map( w=> 
                    w.id === myself.id ?
                    {...w, exerciseSets: [...w.exerciseSets, {id: getMaxId(w.exerciseSets), weight: weightInput, reps: repInput}]} :
                    w
                )}
            )} :
            r
        ))
    }
    return (
        <Card 
            size="small" 
            style={{ marginBottom: 15 }}
            
            // 🛑 جایگزینی div.history-date-header با title و extra
            title={<Title level={5} style={{ margin: 0 }}>{myself.name}</Title>}
            extra={
                <Space size="small">
                    <Tooltip title="افزودن ست">
                        <Button 
                            type="text" 
                            icon={Add} 
                            onClick={e=>{e.preventDefault(); addSetToWorkout(e)}}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="حذف تمرین از روز">
                        <Button 
                            type="text" 
                            danger 
                            icon={Delete}
                            onClick={e=>{e.preventDefault(); deleteWorkoutFromDayFromRoutine(foundRoutine, day, myself)}}
                            size="small"
                        />
                    </Tooltip>
                </Space>
            }
        >
            {/* ۱. فرم اضافه کردن ست جدید */}
            <form onSubmit={addSetToWorkout} style={{ marginBottom: 15 }}>
                <Space.Compact block>
                    {/* ورودی وزن */}
                    {iHaveWeight && (
                        <Input
                            placeholder="وزن (Kg)"
                            value={weightInput} 
                            onChange={weightInputChange} 
                            type="number" 
                            min="0"
                            size="large"
                            style={{ flex: 1 }}
                        />
                    )}
                    
                    {/* ورودی تکرار */}
                    <Input
                        placeholder="تکرار (Reps)"
                        onChange={repInputChange} 
                        value={repInput} 
                        type="number" 
                        min="1"
                        size="large"
                        style={{ flex: 1 }}
                    />
                </Space.Compact>
            </form>
            
            {/* ۲. ست‌های موجود (لیست) */}
            <div className="history-sets-table"> 
                {myself.exerciseSets.map( (set, sid) =>
                    <Set 
                        myself={set} 
                        key={sid} 
                        trashId={sid} 
                        Routines={Routines}
                        showWeight={iHaveWeight} 
                        setRoutines={setRoutines}
                        day={day}
                        workout={myself}
                        foundRoutine={foundRoutine}
                        
                    />
                )}
            </div>
        </Card>
    )
}
function getMaxId(data) {
    if (!data || data.length === 0) return 1;
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}