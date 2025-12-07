import { useState } from "react"
import { Add } from "../Icons"
import Day from "./Day"
import { Input, Button } from "antd"

export default function Routine({date, LogData, myself, Routines, setRoutines, setExercisePrelist, setCategoriesofExercisePrelist, ExercisePrelist, CategoriesofExercisePrelist, importRoutine}) {
    const [newDayName, setNewDayName] = useState("")
    function AddNewDayToRoutine(routine) {
        const newDayObj = {
            name: newDayName,
            id: getMaxId(routine.days),
            workouts: []
        }
        setRoutines(Routines.map(r => 
            r.id === routine.id ?
            {...r, days: [...r.days, newDayObj]} :
            r
        ))
    }

    return (
    <div className="routine">
        <form className="form-field">
            <Input 
                value={newDayName} 
                onChange={e=>{e.preventDefault(); setNewDayName(e.target.value)}} 
                type="text" 
                placeholder="نام روز جدید" 
                size="large"
                style={{ flex: 1 }}
            />
            <Button 
                type="primary" 
                icon={Add} 
                onClick={(e) => {e.preventDefault(); AddNewDayToRoutine(myself)}}
                size="large"
            >
                روز جدید
            </Button>
        </form>
    {myself.days.map( day => <Day date={date} LogData={LogData} importRoutine={importRoutine} myself={day} key={day.id} foundRoutine={myself} Routines={Routines} setRoutines={setRoutines} setExercisePrelist={setExercisePrelist} setCategoriesofExercisePrelist={setCategoriesofExercisePrelist} ExercisePrelist={ExercisePrelist} CategoriesofExercisePrelist={CategoriesofExercisePrelist} />)}
    </div>
    )
}
function getMaxId(data) {
    if (!data || data.length === 0) return 1;
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}