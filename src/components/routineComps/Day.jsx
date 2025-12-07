import { useState } from "react";
import { Delete, Add, Gymroutines } from "../Icons";
import { Button, Typography } from "antd";
const { Title } = Typography
import WorkoutPicker from '../WorkoutPicker'
import Workout from "./Workout";
export default function myself({date, LogData, myself, foundRoutine, Routines, setRoutines, setExercisePrelist, setCategoriesofExercisePrelist, ExercisePrelist, CategoriesofExercisePrelist, importRoutine}) {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const openWorkoutPicker = (e) => {
        if (e) e.preventDefault();
        setIsPickerOpen(true);
    }
    function deleteDayFromRoutine(targetRoutine, targetDay) {
        setRoutines(Routines.map(r => 
            r.id === targetRoutine.id ?
            {...r, days: r.days.filter(dey => targetDay.id !== dey.id)} :
            r
        ))
    }
    const handleWorkoutSelection = (selectedExercise) => {
        setRoutines(Routines.map( r =>
            r.id === foundRoutine.id ?
            {...r,days: r.days.map(d => 
                d.id === myself.id ?
                {...d, workouts: [...d.workouts, {id: getMaxId(d.workouts)+1, name:selectedExercise.name, exerciseSets: []}]} :
                d
            )} :
            r
        ))
        
        setIsPickerOpen(false); 
    }
    const useRoutine = () => {
        const todayTrainings = LogData.filter(l => l.date === date).map(l => ({...l, exerciseSets: l.sets}))
        setRoutines(Routines.map( r => 
            r.id === foundRoutine.id ?
            {...r, days: r.days.map( d =>
                d.id === myself.id ?
                {...d, workouts: todayTrainings}
            : d )}  :
            r
        ))
    }
    return (
        <div className="routine-day" key={myself.id}> 
            <Title style={{direction:"ltr"}} level={3}> {myself.name} <Button size="small" onClick={e=>{e.preventDefault(); deleteDayFromRoutine(foundRoutine, myself)}}>{Delete}</Button>
            {isPickerOpen && 
            <WorkoutPicker onSelect={handleWorkoutSelection} setExercisePrelist = {setExercisePrelist} setCategoriesofExercisePrelist ={setCategoriesofExercisePrelist} onClose={()=> setIsPickerOpen(false)} ExercisePrelist={ExercisePrelist} CategoriesofExercisePrelist={CategoriesofExercisePrelist}/>
            }
            <Button size="small" onClick={(e)=>{
                e.preventDefault()
                openWorkoutPicker(e)
            }}>{Add}</Button>
            </Title>
            <div>
                {myself.workouts.map( workout =>
                    <Workout myself={workout} key={workout.id} day={myself} foundRoutine={foundRoutine} Routines={Routines} setRoutines={setRoutines} ExercisePrelist={ExercisePrelist} />
                )}
            </div>
            <Button block className="add-btn" onClick={(e) => {e.preventDefault();importRoutine(myself)}}>به امروز اضافه کن {Add}</Button>
            <Button block className="add-btn" onClick={(e) => {e.preventDefault();useRoutine(myself)}}>از امروز وارد کن <Gymroutines /></Button>
        </div>
    )
}
function getMaxId(data) {
    if (!data || data.length === 0) return 1;
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}