// --- imports and global data ---
import { UpdateModal } from './components/common/CommonComps.jsx'
import { useState, useReducer, useEffect, useMemo } from "react"
import { getTodayJalaali, formatSecondsToMMSS } from './utils/formatters.js'
import { UPDATE_LOGS } from './utils/constants.js'
import { useLocalStorage, useTheme, useModal, useLogsOfDay, useLastId, useTimer } from "./utils/hooks.js"
import { getSavedValue } from './utils/reader.js';
import {ExercisePrelistDefault, CategoriesofExercisePrelistDefault} from './utils/defaults.js'
import { Edit, BaselineTimer, Delete, PageCopy, TrendIcon, Gymroutines, CalculatorIcon, CommentIcon, BodyIcon, ShareIcon, SettingsIcon } from "./components/common/Icons.jsx"
import { AccessLogData, AccessBodyLogData } from "./utils/reducers.js"
import './styles/App.css'
import WorkoutComponent from './components/workout/WorkoutComponent.jsx'
import WorkoutPicker from "./components/pickers/WorkoutPicker.jsx"
import Calendar from './components/pickers/Calendar.jsx'
import Timer from './components/tools/TimerModal.jsx'
import Cheater from './components/tools/CheaterModal.jsx'
import WorkoutDetails from './components/tools/WorkoutDetailsModal.jsx'
import RoutineUser from './components/tools/RoutineManagerModal.jsx'
import Calculator from './components/tools/CalculatorModal.jsx'
import CommentAdder from './components/tools/CommentAdderModal.jsx'
import BodyStatus from './components/tools/BodyStatusModal.jsx'
import Share from './components/tools/ShareModal.jsx'
import Settings from './components/tools/SettingsModal.jsx'

// antd
import { Button, Typography, ConfigProvider, theme, Form, Card, notification} from "antd"
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
const { Title, Text } = Typography;
const { darkAlgorithm, defaultAlgorithm } = theme;

// ----- the App Component -----
export default function App() {
    // ----- darkMode
    const { isDarkMode, toggleTheme } = useTheme();
    const [notifapi, notifContextHolder] = notification.useNotification();

    const [initialLogData] = useLocalStorage("LogData", []);
    const [LogData, effectLogData] = useReducer(AccessLogData, initialLogData);
    const [initialBodyLogData] = useLocalStorage('BodyLogData', []);
    const [BodyLogData, effectBodyLogData] = useReducer(AccessBodyLogData, initialBodyLogData);
    useEffect(() => {
        localStorage.setItem('LogData', JSON.stringify(LogData));
        localStorage.setItem('BodyLogData', JSON.stringify(BodyLogData));
    }, [LogData, BodyLogData]);
    const [ExercisePrelist, setExercisePrelist] = useLocalStorage('ExercisePrelist', ExercisePrelistDefault);
    const [CategoriesofExercisePrelist, setCategoriesofExercisePrelist] = useLocalStorage('CategoriesofExercisePrelist', CategoriesofExercisePrelistDefault);
    const [Comments, setComments] = useLocalStorage('Comments', []);

    const [SelectedDate, setSelectedDate] = useState(getTodayJalaali())
    useEffect(() => {
        localStorage.setItem('SelectedDate', JSON.stringify(SelectedDate));
    }, [SelectedDate]);
    // newLogData (State): properties of next object needed to pass to LogData reducer
    const nextWorkoutId = useLastId(LogData)
    const [newLogData, setNewLogData] = useState({})
    const pushNewExcercise = (e) => {
        if (e) e.preventDefault();
        if (newLogData.name && SelectedDate) {
            try {
                effectLogData({
                    type: "Add",
                    log_id: nextWorkoutId.current,
                    log_name: newLogData.name,
                    log_sets: newLogData.sets,
                    log_editing: newLogData.editing,
                    log_date: SelectedDate,
                    log_haveWeight: newLogData.countsByWeight,
                    log_specialRepFlag: newLogData.specialRepFlag
                });
                notifapi.success({title: 'عملیات موفق',description: `تمرین ${newLogData.name} با موفقیت به تاریخ ${SelectedDate} اشافه شد`})                
            } catch(error) {
                notifapi.error({title: 'خطا',description: error}) 
            }
        } else {
            notifapi.error({title: 'خطا',description: `نام تمرین یا تاریخ انتخاب نشده`}) 
        }

    }

    // filteredLogData (const array): list of Logs to render
    const filteredLogData = useLogsOfDay(LogData, SelectedDate) 


    // Callback for workoutPicker
    const handleWorkoutSelection = (selectedExercise) => {
        setNewLogData(prevData => ({
            ...prevData,
            name: selectedExercise.name,
            countsByWeight: selectedExercise.countsByWeight,
            specialRepFlag: selectedExercise.specialRepFlag,
            
            sets: [
                {
                    id: 1, 
                    reps: 5,
                    weight: selectedExercise.countsByWeight ? 5 : undefined,
                    RepEdit: false,
                    WeightEdit: false,
                    done: false,
                }
            ],
            editing: false 
        }));
        closePicker(); 
    }
    // #LOOKTHIS: neccessary values are marked 'required' and handlers are enough in WorkoutAdderModal.jsx
    const pushNewWorkout = (newWorkoutData) => {
        const nextExerciseId = getMaxId(ExercisePrelist) + 1;
        const nextCategoryId = getMaxId(CategoriesofExercisePrelist) + 1;
        let CategoryFullObject = CategoriesofExercisePrelist.find(cat => cat.name===newWorkoutData.category)
        if (!CategoryFullObject) {
            CategoryFullObject = {id: nextCategoryId, name: newWorkoutData.category, color: "gray"}
            setCategoriesofExercisePrelist(prevCats => [...prevCats, CategoryFullObject]);
        }
        const newExercise = {
            id: nextExerciseId,
            ...newWorkoutData,
            category: CategoryFullObject.name,
            secondarycategory: undefined
        };
        setExercisePrelist(prevList => [...prevList, newExercise]);
    };

    // #LOOKTHIS: No problem on 'Date Parsing Vulnerability', date format is always this and never changes.
    const handleDateSelection = (lastChosen) => {
        setSelectedDate(lastChosen)
    }
        
    const timer = useTimer(60, true)

    // fast transfer between days without openning DatePicker
    function changeDateDays (date_string, change) {
        let day = Number(date_string[8] + date_string[9])
        let month = Number(date_string[5] + date_string[6])
        let year = Number(date_string[0] + date_string[1] + date_string[2] + date_string[3])
        day += change

        if (day < 1) {
            month -= 1
        }
        let days_max;
        if (month<7) {
            days_max = 31
        } else if (month<12) {
            days_max = 30
        } else {
            days_max = 29
        }

        if (day < 1) {
            day = days_max
        }
        if (day > days_max) {
            day = 1
            month += 1
        }

        if (month > 12){
            month = 1
            year += 1
        }
        if (month < 1) {
            month = 12
            year -= 1
        }

        let day_str,month_str
        if (day<10){
            day_str = "0" + String(day)
        } else {
            day_str = String(day)
        }
        if (month<10){
            month_str = "0" + String(month)
        } else {
            month_str = String(month)
        }

        setSelectedDate( String(year) + "/" + month_str + "/" + day_str )
    }

    // #LOOKTHIS: undefined/null or [] is handled
    function importRoutine (Rday) {
        if (Rday.workouts.length > 0) {
            Rday.workouts.map( w => {
                const exerciseReference  = ExercisePrelist.find(refer => refer.name === w.name)
                let sets = [];
                w.exerciseSets.map( set => {
                    sets.push(
                        {id: set.id, reps: set.reps ? set.reps  : 1, weight: exerciseReference.countsByWeight ? (set.weight ? set.weight : 1) : undefined, RepEdit: false, WeightEdit: false, specialRepFlag: exerciseReference.specialRepFlag}
                    )
                } )
                effectLogData({
                    type: "Add",
                    log_id: nextWorkoutId.current,
                    log_name: exerciseReference.name,
                    log_sets: sets,
                    log_editing: false,
                    log_date: SelectedDate,
                    log_haveWeight: exerciseReference.countsByWeight,
                    log_specialRepFlag: exerciseReference.specialRepFlag
                })
                nextWorkoutId.current += 1
            })
            notifapi.success({title: 'عملیات موفق', description: `تمرینات روتین به تاریخ ${SelectedDate} اضافه شد`})
        } else {
            notifapi.error({title: 'خطا', description: 'لیست روتین خالی است'})
        }
    } 
    const [calendarType, setCalendarType] = useState('default')

    const [isTimerOpen, openTimer, closeTimer] = useModal();
    const [isCheaterOpen, openCheater, closeCheater] = useModal();
    const [isPickerOpen, openPicker, closePicker] = useModal();
    const [isWorkoutDetailsOpen, openWorkoutDetails, closeWorkoutDetails] = useModal()
    const [isRoutineUserOpen, openRoutineUser, CloseRoutineUser] = useModal()
    const [isCalculatorOpen, openCalculator, closeCalculator] = useModal()
    const [isCommentAdderOpen, openCommentAdder, closeCommentAdder] = useModal()
    const [isBodyStatusOpen, openBodyStatus, closeBodyStatus] = useModal()
    const [isSharingOpen, openSharing, closeSharing] = useModal()
    const [isSettingsOpen, openSettings, closeSettings] = useModal()

    // Should i make hook for this?
    const [isUpdateModalOpen, openUpdateModal, closeUpdateModal] = useModal();
    const LATEST_LOG_ID = UPDATE_LOGS[UPDATE_LOGS.length - 1].id; 
    const LAST_VIEWED_LOG_KEY = 'lastViewedUpdateLogId';
    const lastViewedLogId = useMemo(() => getSavedValue(LAST_VIEWED_LOG_KEY, 0), []); 
    useEffect(() => {
        if (lastViewedLogId < LATEST_LOG_ID) {
            openUpdateModal();
        }
    }, [lastViewedLogId, LATEST_LOG_ID]);
    return (
        <>
            <ConfigProvider
                direction="rtl"
                theme={{
                    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                }}
            >{notifContextHolder}
            {/* Conditional Rendering */}
            {isUpdateModalOpen && <UpdateModal onClose={() => {closeUpdateModal(); localStorage.setItem(LAST_VIEWED_LOG_KEY, JSON.stringify(LATEST_LOG_ID))}} showAllUpdates={false} />}
            {isTimerOpen && <Timer onClose={closeTimer} timer={timer} />}
            {isCheaterOpen && (<Cheater notifCall={notifapi} nextWorkoutId={nextWorkoutId} onClose={closeCheater} lastChosenDate={SelectedDate} LogData={LogData} setNewLogData={setNewLogData} effectLogData={effectLogData} />)}
            {isWorkoutDetailsOpen && (<WorkoutDetails ExercisePrelist={ExercisePrelist} LogData={LogData} onClose={closeWorkoutDetails} lastChosen={newLogData.name} /> )}
            {isRoutineUserOpen && (<RoutineUser date={SelectedDate} LogData={LogData} setExercisePrelist = {setExercisePrelist} setCategoriesofExercisePrelist ={setCategoriesofExercisePrelist} onClose={CloseRoutineUser} importRoutine={importRoutine} ExercisePrelist={ExercisePrelist} CategoriesofExercisePrelist={CategoriesofExercisePrelist} />)} 
            {isCalculatorOpen && (<Calculator onClose={closeCalculator} LogData={LogData} />)}
            {isCommentAdderOpen && (<CommentAdder onClose={closeCommentAdder} date={SelectedDate} Comments={Comments} setComments={setComments} />)}
            {isBodyStatusOpen && (<BodyStatus onClose={closeBodyStatus} BodyLogData={BodyLogData} effectBodyLogData={effectBodyLogData} lastDate={SelectedDate} />)}
            {isSharingOpen && (<Share onClose={closeSharing} date={SelectedDate} LogData={LogData} />)}
            {isSettingsOpen && (<Settings onClose={closeSettings} calendarType={calendarType} setCalendarType={setCalendarType} lastViewedLogId={lastViewedLogId}  />)}

            <div className="app-container">
                {/* Tools */}
                <div>
                    <Button onClick={toggleTheme} style={{width: '48px', height: '48px'}}>{isDarkMode ? <SunOutlined /> : <MoonOutlined />}</Button>
                    <Button className="" onClick={openTimer} style={{width: '48px', height: '48px'}}>{timer.isActive ? <span>{formatSecondsToMMSS(timer.seconds)}</span> :   <BaselineTimer /> } </Button>
                    <Button onClick={openCheater} style={{width: '48px', height: '48px'}}><PageCopy /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openWorkoutDetails}><TrendIcon /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openRoutineUser}><Gymroutines /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openCalculator}><CalculatorIcon /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openCommentAdder}><CommentIcon /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openBodyStatus}><BodyIcon /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openSharing}><ShareIcon /></Button>
                    <Button style={{width: '48px', height: '48px'}} onClick={openSettings}><SettingsIcon /></Button>
                </div>
                <div className="form-field log-form">
                    <Form className="log-form" style={{boxShadow: ''}}>
                        <label htmlFor="ExerciseName">نام تمرین</label>
                        <button type="button" onClick={openPicker} className="workout-picker-btn ant-style-button-input" dir="rtl">
                            {newLogData.name ? `انتخاب شده: ${newLogData.name}` : "انتخاب تمرین..."}
                            {Edit}
                        </button>
                        <label htmlFor="ExerciseDate">تاریخ</label>
                        <Calendar 
                            onSelect={handleDateSelection}
                            selectedDateOfParent={String(SelectedDate)}
                            calendarType={calendarType}
                            className="react-modern-calendar-datepicker workout-picker-btn"
                        />
                    <Button onClick={pushNewExcercise} className="submit-btn">افزودن تمرین</Button>
                    </Form>
                    <div className="workout-picker-btn">
                        <Button className="workout-picker-btn-small" onClick={() => {changeDateDays(SelectedDate, -1)}} dir="rtl">دیروز</Button>
                        <Button className="workout-picker-btn-small" onClick={() => {changeDateDays(SelectedDate, +1)}} dir="rtl">فردا</Button>
                    </div>   
                </div>
                        
                {isPickerOpen && (
                    <WorkoutPicker 
                        onSelect={handleWorkoutSelection}
                        onClose={closePicker} 
                        ExercisePrelist={ExercisePrelist}
                        CategoriesofExercisePrelist={CategoriesofExercisePrelist}
                        setExercisePrelist = {setExercisePrelist}
                        setCategoriesofExercisePrelist ={setCategoriesofExercisePrelist}
                        pushNewWorkout={pushNewWorkout}
                    />
                )}

                {
                    Comments.filter(comment => comment.date === SelectedDate)?.map(comment => (
                        <Card key={comment.id}>
                            <Title strong level={5} style={{margin: 0}}><span>یادداشت #{comment.id}</span> <Button type="text" danger icon={Delete} onClick={() => {
                                setComments(Comments.filter(c => c.id !== comment.id))
                            }} size="large" /></Title>
                            <Text>{comment.text}</Text>
                        </Card>
                    ))
                }
                {filteredLogData.length > 0 ? (
                    filteredLogData.map(
                        (workout) => {return(
                            <WorkoutComponent OnSetChecked={()=>{
                                if (timer.autoStart) {
                                    timer.start();
                                }
                            }} workout={workout} key={"w-" + workout.id} workoutID={workout.id} effectLogData={effectLogData}/>
                        )}
                    )
                ) : (
                    <Title level={5} className="no-workouts" dir="rtl">
                        <span>تمرینی برای تاریخ **{SelectedDate}** ثبت نشده است. به صورت دستی اضافه کنید یا از <PageCopy /> استفاده کنید.</span>
                    </Title>
                )}
            </div>
            </ConfigProvider>
            <audio ref={timer.audioRef} preload="auto" loop={false}>
                <source src="/store-scanner-beep-90395.mp3" type="audio/mp3" /> 
                مرورگر شما از عنصر audio پشتیبانی نمی‌کند یا فایل صوتی بارگذاری نشد.
            </audio>
        </>
    )
    
}
