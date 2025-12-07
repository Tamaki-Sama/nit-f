// --- imports and global data ---
import { useState, useReducer, useEffect, useRef, useMemo, useCallback } from "react"  // Hooks
import {toJalaali} from 'jalaali-js' // Date Source #1
import { AccessLogData } from "./components/AccessToLogData.jsx" // LogData Reducer
import './App.css' // Styles
import WorkoutComponent from './components/Workout-component.jsx' // Component for rendering workouts
import WorkoutPicker from "./components/WorkoutPicker.jsx" // Component Page for picking Wourouts
import Calendar from './components/Calendar.jsx' // Component Page for picking/selecting dates
import {ExercisePrelistDefault, CategoriesofExercisePrelistDefault} from './components/ExercisePrelist.jsx' // inits
import Tools from "./components/Tools.jsx" // some of tool comps
import { Edit, BaselineTimer, Delete, PageCopy } from "./components/Icons.jsx" // svg
// antd
import { Button, Statistic, Modal, Input, Tooltip, Space, Typography, Select ,List, ConfigProvider, theme, Form, Card, Checkbox, Row, Col} from "antd"
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
const { Title, Text } = Typography;
const { Option } = Select;
const { darkAlgorithm, defaultAlgorithm } = theme;

// ----- the App Component -----
export default function App() {
    // ----- darkMode
    const [darkMode, setDarkMode] = useState(getSavedValue('darkMode', false));
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }, [darkMode]);
    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    // LogData(Reduser): Saves all workout logs
    // ExercisePrelist(State): List of Exercises can be used for workout logs
    // CategoriesofExercisePrelist(State)
    const [LogData, effectLogData] = useReducer(AccessLogData,getSavedValue("LogData", []))
    const [ExercisePrelist, setExercisePrelist] = useState(
        getSavedValue('ExercisePrelist', ExercisePrelistDefault)
    );
    const [CategoriesofExercisePrelist, setCategoriesofExercisePrelist] = useState(
        getSavedValue('CategoriesofExercisePrelist', CategoriesofExercisePrelistDefault)
    );
    const [Comments, setComments] = useState(
        getSavedValue('Comments', [])
    );

    // isPickerOpen,isDatePickerOpen (State): render?
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    
    // newLogData (State): properties of next object needed to pass to LogData reducer
    const nextWorkoutId = useRef(getMaxId(LogData))
    const [newLogData, setNewLogData] = useState({
        name: ExercisePrelist[0].name,
        sets: [
            {id:1,reps: 5,weight: ExercisePrelist[0].countsByWeight ? 5 : undefined,RepEdit: false,WeightEdit: false, done: false, specialRepFlag: false}
        ],
    })

    // SelectedDate (State)
    const [SelectedDate, setSelectedDate] = useState(getTodayJalaali())

    // filteredLogData (const array): list of Logs to render
    const filteredLogData = useMemo( () => 
        LogData.filter(workout => workout.date === SelectedDate),
     [LogData, SelectedDate]
    )

    // Effects: Updating LocalStorage
    useEffect(() => {
        localStorage.setItem('LogData', JSON.stringify(LogData));
    }, [LogData])
    useEffect(() => {
        localStorage.setItem('Comments', JSON.stringify(Comments));
    }, [Comments])
    useEffect(() => {
        localStorage.setItem('ExercisePrelist', JSON.stringify(ExercisePrelist));
        localStorage.setItem('CategoriesofExercisePrelist', JSON.stringify(CategoriesofExercisePrelist));
    }, [ExercisePrelist, CategoriesofExercisePrelist]); 

    // Update Modal
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const lastViewedLogId = useMemo(() => getSavedValue(LAST_VIEWED_LOG_KEY, 0), []); 
    useEffect(() => {
        if (lastViewedLogId < LATEST_LOG_ID) {
            setShowUpdateModal(true);
        }
    }, [lastViewedLogId]);
    const handleUpdateModalClose = () => {
        localStorage.setItem(LAST_VIEWED_LOG_KEY, JSON.stringify(LATEST_LOG_ID));
        setShowUpdateModal(false);
    };

    // Calling LogData Reducer with everything
    const pushNewExcercise = useCallback((e)=> {
        if (e) e.preventDefault() 
        effectLogData({
            type: "Add",
            log_id: nextWorkoutId.current,
            log_name: newLogData.name,
            log_sets: newLogData.sets,
            log_editing: newLogData.editing,
            log_date: SelectedDate,
            log_haveWeight: newLogData.countsByWeight,
            log_specialRepFlag: newLogData.specialRepFlag
        })
        nextWorkoutId.current += 1
    }, [effectLogData, newLogData, SelectedDate])

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
        setIsPickerOpen(false); 
    }

    // Callback for Custom Workouts
    const pushNewWorkout = (newWorkoutData) => {
        // 1. تولید ID جدید
        const nextExerciseId = getMaxId(ExercisePrelist) + 1;
        const nextCategoryId = getMaxId(CategoriesofExercisePrelist) + 1;
        let CategoryFullObject = CategoriesofExercisePrelist.find(cat => cat.name===newWorkoutData.category)
        if (!CategoryFullObject) {
            CategoryFullObject = {id: nextCategoryId, name: newWorkoutData.category, color: "gray"}
            setCategoriesofExercisePrelist(prevCats => [...prevCats, CategoryFullObject]);
        }

        // 2. ساخت آبجکت کامل تمرین
        const newExercise = {
            id: nextExerciseId,
            ...newWorkoutData,
            category: CategoryFullObject.name,
            secondarycategory: undefined
        };
        // 3. به‌روزرسانی لیست تمرینات
        setExercisePrelist(prevList => [...prevList, newExercise]);
    };

    // for buttons
    const openWorkoutPicker = (e) => {
        if (e) e.preventDefault();
        setIsPickerOpen(true);
    }
    const handleDateSelection = (lastChosen) => {
        setSelectedDate(lastChosen)
    }
    const [isTimerOpen, setisTimerOpen] = useState(false);
    function openTimer(e) {
        e.preventDefault()
        setisTimerOpen(true)
    }
    const [isCheaterOpen, setIsCheaterOpen] = useState(false)
    function openCheater(e) {
        e.preventDefault()
        setIsCheaterOpen(true)
    }
        
    // Timer values
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);
    const audioRef = useRef(null);
    const [autoStart, setAutoStart] = useState(true)
    const playAlarmSound = () => {
        const audio = audioRef.current;
        if (audio) {
            // play() را فراخوانی می‌کنیم و خطاها را مدیریت می‌کنیم (مانند خطای عدم اجازه مرورگر)
            audio.play().catch(e => {
                console.error("Error playing audio, probably blocked by browser:", e);
                // برای سختگیری: در صورتی که نیاز به آلارم قوی دارید، از API‌های جایگزین یا نوتیفیکیشن همزمان استفاده کنید.
            });
        }
    };
    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 1) {
                        clearInterval(timerRef.current);
                        setIsActive(false);
                        playAlarmSound()
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive]);
    const [inputTime, setInputTime] = useState(60)
    useEffect(() => {
        setSeconds(inputTime);
    }, [inputTime]);

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

    // Callback for Routine Tools
    function importRoutine (Rday) {
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
    } 

    const [calendarType, setCalendarType] = useState('default')
    // JSX part
    return (
        <>
            <ConfigProvider
                direction="rtl"
                theme={{
                    algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
                }}
            >
            <Modal
                title={<Title level={4}>{`📢 چه خبر؟ نسخه ${UPDATE_LOGS[LATEST_LOG_ID - 1].version} منتشر شد!`}</Title>}
                open={showUpdateModal}
                onCancel={handleUpdateModalClose}
                centered
                footer={[
                    <Button key="confirm" type="primary" onClick={handleUpdateModalClose}>
                        متوجه شدم!
                    </Button>
                ]}
            >
                <Space orientation="vertical" style={{ width: '100%' }}>
                    {
                    UPDATE_LOGS
                        .filter(log => log.id > lastViewedLogId)
                        .map(log => (
                            <div key={log.id} style={{ marginBottom: '16px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                                <Title level={5} style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>
                                    {log.title} ({log.version})
                                </Title>
                                <List
                                    size="small"
                                    dataSource={log.features}
                                    renderItem={(item) => <List.Item style={{ border: 'none', padding: '4px 0' }}>• {item}</List.Item>}
                                />
                                <Text type="secondary" style={{ fontSize: '0.8em', display: 'block', textAlign: 'left' }}>
                                    تاریخ انتشار: {log.date}
                                </Text>
                            </div>
                        ))
                    }
                </Space>
            </Modal>
            <div className="app-container">
                <div>
                    <Button onClick={toggleDarkMode} style={{width: '48px', height: '48px'}}>{darkMode ? <SunOutlined /> : <MoonOutlined />}</Button>
                    <Button className="" onClick={openTimer} style={{width: '48px', height: '48px'}}>
                        {isActive ? 
                            <span>{formatSecondsToMMSS(seconds)}</span>
                            :   <BaselineTimer className="icon" />
                        }
                    </Button>
                    <Button onClick={openCheater} style={{width: '48px', height: '48px'}}><PageCopy /></Button>
            <audio ref={audioRef} preload="auto" loop={false}>
                <source src="/store-scanner-beep-90395.mp3" type="audio/mp3" /> 
                مرورگر شما از عنصر audio پشتیبانی نمی‌کند یا فایل صوتی بارگذاری نشد.
            </audio>
                    {isTimerOpen && (<Timer autoStart={autoStart} setAutoStart={setAutoStart} onClose={() => setisTimerOpen(false)} seconds={seconds} setSeconds={setSeconds} isActive={isActive} setIsActive={setIsActive} inputTime={inputTime} setInputTime={setInputTime} />)}
                    {isCheaterOpen && (<Cheater nextWorkoutId={nextWorkoutId} onClose={() => setIsCheaterOpen(false)} lastChosenDate={SelectedDate} LogData={LogData} setNewLogData={setNewLogData} effectLogData={effectLogData} />)}
                    <Tools 
                    CategoriesofExercisePrelist={CategoriesofExercisePrelist} setCategoriesofExercisePrelist ={setCategoriesofExercisePrelist} 
                    ExercisePrelist={ExercisePrelist} setExercisePrelist = {setExercisePrelist}
                    importRoutine={importRoutine} 
                    pushNewWorkout={pushNewWorkout}  Comments={Comments} setComments={setComments}
                    LogData={LogData} lastChosen={newLogData.name} lastDate={SelectedDate}
                    calendarType={calendarType} setCalendarType={setCalendarType}
                    UPDATE_LOGS={UPDATE_LOGS}
                    />
                </div>
                <div className="form-field log-form">
                    <Form className="log-form" style={{boxShadow: ''}}>
                        <label htmlFor="ExerciseName">نام تمرین</label>
                        <button type="button" onClick={openWorkoutPicker} className="workout-picker-btn ant-style-button-input" dir="rtl">
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
                        onClose={() => setIsPickerOpen(false)} 
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
                                if (autoStart) {
                                    setIsActive(true); setSeconds(inputTime)
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
            
        </>
    )
    
}
// --- Component Timer ---
function Timer({onClose, seconds, setSeconds, isActive, setIsActive, inputTime, setInputTime, autoStart, setAutoStart}) {

    function handleToggleTimer(e) {
        e.preventDefault();
        
        if (seconds === 0 && inputTime > 0) {
            // اگر تایمر صفر است اما زمان ورودی داریم، آن را ریست کرده و شروع می‌کنیم.
            setSeconds(inputTime);
            setIsActive(true);
        } else if (seconds > 0) {
            // اگر زمان باقی است، فقط وضعیت فعال بودن را برعکس می‌کنیم (مکث/ادامه).
            setIsActive(prev => !prev);
        }
    }

    function handleTimeReset(e) {
        e.preventDefault();
        setIsActive(false);
        setSeconds(inputTime);
    }
    
    function handleTimerInputChange(e) {
        const value = Number(e.target.value);
        if (value >= 0) {
            setInputTime(value);
        }
    }
    return (
        <Modal 
            title="تایمر استراحت"
            open={true} 
            onCancel={onClose} 
            footer={null} 
            centered
            destroyOnHidden={true} 
        >
            {/* 🛑 جایگزینی timer-display با AntD Statistic */}
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px' }}>
                <Statistic
                    value={seconds}
                    formatter={formatSecondsToMMSS}
                    valueStyle={{ 
                        fontSize: '3.5em', 
                        fontWeight: 'bold', 
                        // رنگ پویا: سبز برای فعال، نارنجی برای توقف/آماده
                        color: isActive ? '#52c41a' : '#faad14' 
                    }}
                />
            </div>
            
            <form onSubmit={handleToggleTimer} className="timer-form">
                <Input 
                    type="number" 
                    placeholder="زمان (ثانیه)" 
                    value={inputTime} 
                    onChange={handleTimerInputChange} 
                    min="1"
                    required
                    size="large"
                    style={{ marginBottom: '16px', textAlign: 'center' }}
                />
                <div className="timer-controls" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button 
                        type={isActive ? 'default' : 'primary'}
                        htmlType="submit" 
                        danger={isActive} 
                        size="large"
                        style={{ width: '120px' }}
                    >
                        {isActive ? 'توقف' : 'شروع'}
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={handleTimeReset}
                        size="large"
                        style={{ width: '120px' }}
                    >
                        ریست
                    </Button>
                </div>
            </form>
            <Title level={5}><Checkbox checked={autoStart} onChange={() => {setAutoStart(!autoStart)}} /> شروع خودکار بعد از تیک خوردن</Title>
        </Modal>
    )
}
// --- Component Cheater, Coppies Workouts ---
function Cheater({onClose, lastChosenDate, LogData, effectLogData, nextWorkoutId}) {
    // states and event handlers
    const [method, setMethod] = useState('ThisToAnother')
    const [cheatDate, setCheatDate] = useState(lastChosenDate)
    const [newLogsList, setNewLogsList] = useState(LogData.filter(ex => ex.date === lastChosenDate))
    function handleDateSelection(result) {
        setCheatDate(result)
    }
    // gener
    function generate(e) {
        e.preventDefault()
        if (method === "ThisToAnother"){
            const selectedLogsList = LogData.filter(ex => ex.date === lastChosenDate)
            setNewLogsList(selectedLogsList.map(ex => ({...ex, date : cheatDate})))
        }
        else {
            const selectedLogsList = LogData.filter(ex => ex.date === cheatDate)
            setNewLogsList(selectedLogsList.map(ex => ({...ex, date : lastChosenDate})))
        }
    }
    function finish(e) {
        e.preventDefault()
        newLogsList.map(ex => {

            effectLogData({
                type: "Add",
                log_id: nextWorkoutId.current++,
                log_name: ex.name,
                log_sets: ex.sets,
                log_editing: ex.editing,
                log_date: ex.date,
                log_haveWeight: ex.countsByWeight,
                log_specialRepFlag: ex.specialRepFlag
            })
        })
        onClose();
    }
    return(
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>انتقال/کپی تمرینات (Cheater)</Title>}
            open={true} // چون این کامپوننت فقط زمانی رندر می‌شود که باید باز باشد
            onCancel={onClose}
            footer={null} // فوتر سفارشی خودمان را استفاده می‌کنیم
            centered
            width={600} // پهنای بیشتر برای نمایش بهتر لیست
        >
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}> 
                    <Space 
                        orientation="vertical" 
                        size="middle" 
                        style={{ width: '100%' }} 
                    >
                        
                        {/* آیتم ۱: انتخاب متد کپی */}
                        <div> 
                            <Text strong>نوع کپی</Text>
                            <Select
                                value={method}
                                onChange={setMethod}
                                style={{ width: '100%', marginTop: '4px' }}
                                size="large"
                            >
                                <Option value="ThisToAnother">
                                    کپی از امروز به تاریخ جدید
                                </Option>
                                <Option value="AnotherToThis">
                                    کپی از تاریخ جدید به امروز
                                </Option>
                            </Select>
                        </div>

                        {/* آیتم ۲: انتخاب تاریخ */}
                        <div>
                            <Text strong style={{display: 'block'}}>تاریخ ثانویه</Text>
                            {/* کامپوننت Calendar (که قبلاً به صورت Button رندر می‌شود) */}
                            <Calendar 
                                onSelect={handleDateSelection}
                                selectedDateOfParent={String(cheatDate)}
                            />
                        </div>
                        
                        {/* آیتم ۳: دکمه آپدیت (نمایش) */}
                        <Button onClick={generate} type="primary" size="large" block>
                            آپدیت (نمایش)
                        </Button>
                    </Space>
                </div>

                {/* ۲. لیست تمرینات پیش‌نمایش */}
                <Title level={5} style={{ margin: '8px 0 0' }}>
                    پیش‌نمایش تمرینات ({newLogsList.length})
                </Title>

                {newLogsList.length === 0 ? (
                    <Text type="secondary" style={{ display: 'block', padding: '10px', textAlign: 'center' }}>
                        در این روز داده‌ای وجود ندارد یا باید دکمه آپدیت را بزنید.
                    </Text>
                ) : (
                    <List
                        itemLayout="vertical"
                        dataSource={newLogsList}
                        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                        renderItem={w => (
                            <List.Item
                                key={w.id}
                                actions={[
                                    // دکمه حذف ورک‌آوت از لیست پیش‌نمایش
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={Delete} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setNewLogsList(newLogsList.filter(savedW => savedW.id !== w.id));
                                        }} 
                                        key="delete-workout"
                                    >
                                        حذف
                                    </Button>
                                ]}
                                style={{ padding: '12px 16px', margin: '10px', background: 'black' }}
                            >
                                <List.Item.Meta
                                    title={<Title level={3} style={{ margin: 0, color: 'var(--border-color)' }}>{w.name}</Title>}
                                />

                                {/* جزئیات ست‌ها */}
                                <List
                                    size="small"
                                    // اضافه کردن index محلی برای نمایش شماره ست
                                    dataSource={w.sets.map((s, index) => ({...s, setIndex: index}))} 
                                    renderItem={s => (
                                        <List.Item
                                            key={s.id}
                                            style={{ padding: '4px 0', borderBottom: 'none', color: 'var(--border-color)' }}
                                            actions={[
                                                // دکمه حذف ست از لیست پیش‌نمایش
                                                <Tooltip title="حذف ست">
                                                    <Button 
                                                        type="text" 
                                                        size="small"
                                                        danger 
                                                        icon={Delete} 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setNewLogsList(newLogsList.map(targetW => {
                                                                if (targetW.id === w.id) {
                                                                    return({...targetW, sets: targetW.sets.filter(set => set.id !== s.id)})
                                                                }
                                                                return(targetW)
                                                            }));
                                                        }}
                                                        key="delete-set"
                                                    />
                                                </Tooltip>
                                            ]}
                                        >
                                            <Space size="large">
                                                <Text type="secondary" style={{color: 'white'}}>{s.setIndex + 1}.</Text>
                                                <Text style={{color: 'white'}}>
                                                    {w.countsByWeight && s.weight !== undefined ? 
                                                        <Text strong style={{color: 'white'}}>{s.weight} kg</Text> : 
                                                        <Text type="secondary" style={{color: 'white'}}>بدون وزن</Text>}
                                                </Text>
                                                <Text style={{color: 'white'}}>
                                                    <Text strong style={{color: 'white'}}>{s.reps}</Text> {w.specialRepFlag || 'reps'}
                                                </Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
                <Button 
                    onClick={finish} 
                    type="primary" 
                    size="large" 
                    block
                    disabled={newLogsList.length === 0}
                    style={{ marginTop: '16px' }}
                >
                    کپی **{newLogsList.length}** تمرین به روز مقصد
                </Button>

            </Space>
        </Modal>
    )
} 

//UPDATE_LOGS
const UPDATE_LOGS = [
    {
        id: 1,
        version: "1.0.0",
        date: "1404/07/01",
        title: "راه‌اندازی اولیه اپلیکیشن",
        features: ["ثبت تمرینات روزانه", "ذخیره اطلاعات در Local Storage"],
    },
    {
        id: 2,
        version: "2.0.0",
        date: "1404/07/10",
        title: "قابلیت های حیاتی",
        features: ["صفحه جزئیات بیشتر", "ذخیره اطلاعات در Local Storage", "تاریخ و تقویم"],
    },
    {
        id: 3,
        version: "3.0.0",
        date: "1404/08/15",
        title: "قابلیت‌های پیشرفته روتین",
        features: ["مدیریت روتین‌های هفتگی", "جابه جایی تمرینات بین روزها"],
    },
    {
        id: 4,
        version: "4.0.0",
        date: "1404/09/10",
        title: "یکپارچگی با Ant Design و Dark Mode",
        features: ["تم دارک و لایت", "آپدیت ظاهر تمام کامپوننت‌ها", "تایمر استراحت خودکار", "اضافه شدن صفحه لاگ آپدیت"],
    },
    {
        id: 5, 
        version: "4.6.4",
        date: "1404/09/11",
        title: "تغییرات ظاهری و ماشین حساب",
        features: ["نمایش تاریخچه تغییرات", "دکمه های ابزار ها","صفحه ماشین حساب"],
    },
    {
        id: 6, 
        version: "6.0.0",
        date: "1404/09/11",
        title: "نمودار ها",
        features: ["حل باگ بعد از اضافه کردن روتین ها به روز","بازنگری کامل","تغییر کامل نمودار ها","لاگ بدن","لاگ پیشرفت","اضافه کردن کامنت روزانه"],
    },
    {
        id: 7, 
        version: "6.5.0",
        date: "1404/09/16",
        title: "جزئیات جدید",
        features: ["رفع باگ های جزئی","آپدیت تایمر","نمایش نمودارها براساس واحد اندازه گیری حرکات (وزن، زمان و...)","طراحی روتین ها از روی تمرینات موجود در روز انتخاب شده"],
    },/*
    {
        id: 8, 
        version: "7.0.0",
        date: "1404/09/16",
        title: "بازسازی",
        features: ["تنظیمات","تقویم میلادی (قابل انتخاب)"],
    },*/
];
const LATEST_LOG_ID = UPDATE_LOGS[UPDATE_LOGS.length - 1].id;
const LAST_VIEWED_LOG_KEY = 'lastViewedUpdateLogId';

function getSavedValue(target, init) { // main func for reading from localStorage
    if (localStorage.getItem(target)) {
        return JSON.parse(localStorage.getItem(target))
    } else {
        return init
    }
}
function getMaxId(data) { // (data: []): number
    if (!data || data.length === 0) return 1;
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}

function getTodayJalaali() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const jDate = toJalaali(year, month, day);
    return `${jDate.jy}/${String(jDate.jm).padStart(2, '0')}/${String(jDate.jd).padStart(2, '0')}`;
}
const formatSecondsToMMSS = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};