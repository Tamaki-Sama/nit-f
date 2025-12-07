import { CalculatorIcon, Add, TrendIcon, Delete, Gymroutines, BodyIcon, CommentIcon, ShareIcon } from "./Icons"
import { useEffect, useState, useMemo, useReducer, Fragment } from "react";
import { AccessBodyLogData } from './AccessToLogData'
import { RoutinesDefault } from "./ExercisePrelist";
import Routine from "./routineComps/Routine";
import WorkoutPerformanceDetails from "./WorkoutPerformance";
import Calculator from "./Calculator";
import { Modal, Button, Input, Select, Space, Typography, InputNumber, Form, Alert, Row, Col, List, Card, Radio } from 'antd';
import Graph from './Graph';
const { Title, Text } = Typography;
const { Option } = Select;



function getSavedValue(target, init) {
    if (localStorage.getItem(target)) {
        return JSON.parse(localStorage.getItem(target))
    } else {
        return init
    }
}

const DATE_FILTERS = [
    { value: 'all', label: 'همه زمان‌ها' },
    { value: 'year', label: 'سال اخیر' },
    { value: '6_months', label: 'شش ماه اخیر' },
    { value: '3_months', label: 'سه ماه اخیر' },
    { value: 'month', label: 'ماه اخیر' },
];
function calculate1RM(weight, reps) {
    if (weight === undefined || reps === undefined || weight === 0 || reps === 0) return 0;
    // 1RM = Weight * (1 + Reps / 30) - Epley Formula
    return Math.round(weight * (1 + reps / 30));
}

// تابع کمکی برای محاسبه حجم ست
function calculateSetVolume(set) {
    const weight = set.weight !== undefined ? set.weight : 1; // وزن بدن را 1 فرض می‌کنیم
    return set.reps * weight;
}


// --- Component Tools Main ---
export default function Tools({UPDATE_LOGS ,calendarType, setCalendarType,ExercisePrelist, CategoriesofExercisePrelist, lastDate, LogData, lastChosen, importRoutine,setExercisePrelist, setCategoriesofExercisePrelist, Comments, setComments}) {
    const [isCalculatorOpen, setisCalculatorOpen] = useState(false)
    const [isWorkoutDetailsOpen, stisWorkoutDetailsOpen] = useState(false)
    const [isBodyStatusOpen, setIsBodyStatusOpen] = useState(false)
    const [isRoutineUserOpen, setIsRoutineuserOpen] = useState(false)
    const [isCommentAdderOpen, setIsCommentAdderOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    function openCalculator(e) {
        e.preventDefault()
        setisCalculatorOpen(true)
    }
    function openexerciseDetails(e) {
        e.preventDefault()
        stisWorkoutDetailsOpen(true)
    }
    function openBodyStatus(e) {
        e.preventDefault()
        setIsBodyStatusOpen(true)
    }
    function openRoutineUser(e) {
        e.preventDefault()
        setIsRoutineuserOpen(true)
    }
    const [BodyLogData, effectBodyLogData] = useReducer(AccessBodyLogData, getSavedValue("BodyLogData", []))
    useEffect(() => {
        localStorage.setItem('BodyLogData', JSON.stringify(BodyLogData));
    }, [BodyLogData])
    const [isSharing, setIsSharing] = useState(false)
    return (
    <>
            {lastChosen && (<Button style={{width: '48px', height: '48px'}} onClick={openexerciseDetails}><TrendIcon /></Button>)}
            {isWorkoutDetailsOpen && lastChosen && (<WorkoutDetails ExercisePrelist={ExercisePrelist} LogData={LogData} onClose={() => stisWorkoutDetailsOpen(false)} lastChosen={lastChosen} /> )}


            <Button style={{width: '48px', height: '48px'}} onClick={openRoutineUser}><Gymroutines /></Button>
            {isRoutineUserOpen && (<RoutineUser date={lastDate} LogData={LogData} setExercisePrelist = {setExercisePrelist} setCategoriesofExercisePrelist ={setCategoriesofExercisePrelist} onClose={() => setIsRoutineuserOpen(false)} importRoutine={importRoutine} ExercisePrelist={ExercisePrelist} CategoriesofExercisePrelist={CategoriesofExercisePrelist} />)}

            <Button style={{width: '48px', height: '48px'}} onClick={openCalculator}><CalculatorIcon /></Button>
            {isCalculatorOpen && (<Calculator onClose={() => setisCalculatorOpen(false)} LogData={LogData} />)}

            <Button style={{width: '48px', height: '48px'}} onClick={openBodyStatus}><BodyIcon /></Button>
            {isBodyStatusOpen && (<BodyStatus onClose={() => setIsBodyStatusOpen(false)} BodyLogData={BodyLogData} effectBodyLogData={effectBodyLogData} lastDate={lastDate} />)}

            <Button style={{width: '48px', height: '48px'}} onClick={(e) => {e.preventDefault(); setIsCommentAdderOpen(true)}}><CommentIcon /></Button>
            {isCommentAdderOpen && (<CommentAdder onClose={() => setIsCommentAdderOpen(false)} date={lastDate} Comments={Comments} setComments={setComments} />)}

            <Button style={{width: '48px', height: '48px'}} onClick={(e) => {e.preventDefault(); setIsSharing(true)}}><ShareIcon /></Button>
            <Share onClose={() => setIsSharing(false)} date={lastDate} LogData={LogData} isSharing={isSharing} />
            
            <Button style={{width: '48px', height: '48px'}} onClick={(e) => {e.preventDefault(); setIsSettingsOpen(true)}}>Settings</Button>
            {isSettingsOpen && (<Settings onClose={() => setIsSettingsOpen(false)} calendarType={calendarType} setCalendarType={setCalendarType} UPDATE_LOGS={UPDATE_LOGS}  />)}
            </>
    )
}
function Settings({onClose, calendarType, setCalendarType, UPDATE_LOGS}) {
    const [isUpdateDetailsOpen, setIsUpdateDetailsOpen] = useState(false)
    return (
        <Modal
        open={true}
        onCancel={onClose}
        footer={null}
        title={<Title level={3}>تنظیمات</Title>}
        >
            <Space orientation="vertical">
                <Space><Button block type="default" onClick={() => {setIsUpdateDetailsOpen(true)}}>نمایش کل تاریخچه آپدیت</Button></Space>
                <Space>
                    <Form.Item> 
                        <label htmlFor="">نوع تقویم</label> <Select value={calendarType} 
                        options={[{ value: 'default' , label: 'شمسی (پیشفرض)' }, { value: 'geg' , label: 'میلادی' }]}
                        onChange={(e) => setCalendarType(e)}
                        />
                    </Form.Item>
                </Space>
            </Space>
            {isUpdateDetailsOpen && <UpdateDetails UPDATE_LOGS={UPDATE_LOGS} onClose={() => {setIsUpdateDetailsOpen(false)}} />}
        </Modal>
    )
}
function generateLogText(date, todayLogs) {
    if (!todayLogs || todayLogs.length === 0) {
        return `📅 خلاصه تمرینات تاریخ ${date}:\n(بدون تمرین)`;
    }

    let textParts = [];
    textParts.push(`📅 خلاصه تمرینات تاریخ ${date}:`);
    textParts.push(`--------------------------------------`); // خط جداکننده

    // ⭐️ ۱. مپ زدن روی تمرینات روز
    const workoutLines = todayLogs.map((workout) => {
        let workoutText = '';
        
        // عنوان تمرین
        workoutText += `💪 ${workout.name}:`; 

        // ⭐️ ۲. مپ زدن روی ست‌های هر تمرین
        const setLines = workout.sets.map((set, index) => {
            const setNumber = index + 1;
            const weightPart = workout.countsByWeight ? `${set.weight}kg x` : '';
            const repsUnit = workout.specialRepFlag || 'reps';
            const status = set.done ? ' ✅' : ' ❌';
            
            // ساختار ست: - ست ۱: ۱۰۰kg x ۱۰ reps ✅
            return `  - ست ${setNumber}: ${weightPart} ${set.reps} ${repsUnit}${status}`;
        }).join('\n'); // تمام ست‌های یک تمرین را با \n به هم متصل کن

        // ترکیب عنوان تمرین با ست‌ها، با \n برای شکست خط
        return workoutText + '\n' + setLines;
    });

    // تمام تمرینات (با ست‌هایشان) را با دو \n (برای خط خالی بین تمرینات) به هم متصل کن
    textParts.push(workoutLines.join('\n\n')); 

    return textParts.join('\n').trim();
}
function Share({onClose, date, LogData, isSharing}) {
    const todayLogs = LogData.filter(l => l.date === date)
    
    // ⭐️ ۳. ساخت متن خام با \n
    const plainTextLog = generateLogText(date, todayLogs);

    // ⭐️ ۴. تبدیل متن خام (\n) به المنت‌های JSX (<br />) برای نمایش
    const formattedTextForDisplay = plainTextLog.split('\n').map((line, index, array) => (
        <Fragment key={index}>
            {line}
            {/* اضافه کردن <br /> به جز در آخرین خط */}
            {index < array.length - 1 && <br />}
        </Fragment>
    ));

    return (
        <Modal
            open={isSharing}
            onCancel={onClose}
            footer={null}
            title={<Title level={3}>کپی به صورت متن</Title>}
        >
            <Text 
                // ⭐️ ۵. متن خام با \n را برای کپی شدن مشخص کنید
                copyable={{ text: plainTextLog }}
                // یک استایل ساده برای بهبود خوانایی متن (اختیاری)
                style={{ fontFamily: 'Vazirmatn, Tahoma, sans-serif', textAlign: 'right', direction: 'rtl' }}
            >
                {/* ⭐️ ۶. نمایش آرایه المنت‌های JSX با <br /> */}
                {formattedTextForDisplay}
            </Text>
        </Modal>
    )
}
function CommentAdder({onClose,Comments, setComments, date}) {
    const [form] = Form.useForm()
    const onFinish = (values) => {
        setComments(prev => [...prev, {id: getMaxId(Comments), date: date, text: values.text}]);
        onClose()
    }
    return (
        <Modal
        open={true}
        footer={null}
        title={<Title level={3}>افزودن یادداشت</Title>}
        onCancel={onClose}
        >
            <Space orientation="vertical">
                <Form
                form={form}
                style={{display: 'block',width: '100%'}}
                orientation="vertical"
                onFinish={onFinish}
                >
                    <Form.Item name='text'>
                        <Input.TextArea 
                            rows={4}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>اضافه کن</Button>
                    </Form.Item>
                    
                </Form>
            </Space>
        </Modal>
    )
}

// --- Component Workout Details (Fixed Logic) ---
function WorkoutDetails({LogData, onClose, lastChosen, ExercisePrelist}) {
    const rawHistory = useMemo(()=> LogData.filter(e => e.name === lastChosen),
    [LogData, lastChosen])
    
    
    // تشخیص نوع تمرین (کاردیو یا قدرتی)
    const isCardio = rawHistory.some(w => w.specialRepFlag === 'm' || w.specialRepFlag === 'km');

    // ✅ State برای متریک و فیلتر
    const [selectedMetric, setSelectedMetric] = useState(''); // ابتدا خالی می‌گذاریم تا در useEffect ست شود
    const [selectedFilter, setSelectedFilter] = useState(DATE_FILTERS[0].value);

    // ✅ تنظیم متریک پیش‌فرض مناسب بر اساس نوع تمرین
    useEffect(() => {
        if (isCardio) {
            setSelectedMetric('max_distance');
        } else {
            setSelectedMetric('max_weight');
        }
    }, [isCardio]);

    const filteredAndProcessedData = useMemo(() => {
        const filterDate = (dateString, filterType) => {
            if (filterType === 'all') return true;
            // TODO: منطق دقیق تاریخ شمسی
            return true;
        };

        const processed = rawHistory
            .filter(w => filterDate(w.date, selectedFilter))
            .map(workout => {
                let max_1rm = 0, max_w = 0, max_r = 0, max_v_set = 0, total_v = 0, total_r = 0;
                let max_dist = 0, max_time = 0, max_speed = 0, total_dist = 0, total_time = 0;

                workout.sets.forEach(set => {
                    const volume = calculateSetVolume(set);
                    
                    // معیارهای کلی
                    total_v += volume;
                    total_r += set.reps;

                    // معیارهای حداکثر
                    max_w = Math.max(max_w, set.weight || 0);
                    max_r = Math.max(max_r, set.reps);
                    max_v_set = Math.max(max_v_set, volume);
                    
                    // 1RM
                    if (set.weight) {
                        const rm = calculate1RM(set.weight, set.reps);
                        max_1rm = Math.max(max_1rm, rm);
                    }
                    
                    // کاردیو
                    if (workout.specialRepFlag === 'm' || workout.specialRepFlag === 'km') {
                        const distance = set.reps; 
                        const time = set.weight || 0; 

                        max_dist = Math.max(max_dist, distance);
                        total_dist += distance;
                        max_time = Math.max(max_time, time);
                        total_time += time;
                        if (time > 0) max_speed = Math.max(max_speed, distance / time);
                    }
                });

                return {
                    date: workout.date,
                    id: workout.id,
                    max_1rm: max_1rm, 
                    max_weight: max_w,
                    max_reps: max_r,
                    max_volume_set: max_v_set,
                    workout_volume: total_v,
                    workout_reps: total_r,
                    max_distance: max_dist,
                    max_time: max_time,
                    max_speed: max_speed,
                    workout_distance: total_dist,
                    workout_time: total_time,
                    sets: workout.sets, 
                    countsByWeight: workout.countsByWeight,
                    specialRepFlag: workout.specialRepFlag
                };
            });
            
        // ✅ مرتب‌سازی بر اساس تاریخ (نزولی - جدیدترین بالا)
        return processed.sort((a, b) => b.id - a.id); // یا مقایسه تاریخ

    }, [rawHistory, selectedFilter]); // removed selectedMetric dependency from processing logic
    
    // اگر هنوز متریک ست نشده (در رندر اول)، چیزی نشان نده یا لودینگ
    if (!selectedMetric) return null;

    const graphData = filteredAndProcessedData.map(w => ({
        date: w.date,
        value: w[selectedMetric] // ✅ حالا کلیدها مطابقت دارند و مقدار برمی‌گردد
    })).reverse(); // برای گراف ترتیب زمانی صعودی بهتر است

    const getUnit = (metric) => {
        if (metric.includes('weight') || metric.includes('1rm') || metric.includes('volume')) return ' kgs';
        if (metric.includes('reps')) return ' reps';
        if (metric.includes('distance')) return ' m';
        if (metric.includes('time')) return ' s';
        return '';
    }
    const unit = getUnit(selectedMetric);
    let METRICS = [];
    const fullObj = ExercisePrelist.find( e => e.name === lastChosen )
    if (fullObj.specialRepFlag === 'reps' || !fullObj.specialRepFlag) {
        METRICS.push(
        { value: 'workout_reps', label: 'تعداد کل تکرار' },
        { value: 'max_reps', label: 'حداکثر تکرار ست' },
        )
    }
    if (fullObj.specialRepFlag === 'sec') {
        METRICS.push({ value: 'max_time', label: 'حداکثر زمان' })
    }
    if (fullObj.specialRepFlag === 'm') {
        METRICS.push( { value: 'max_distance', label: 'حداکثر مسافت' })
    }
    if (fullObj.countsByWeight && (fullObj.specialRepFlag === 'reps' || !fullObj.specialRepFlag)) {
        METRICS.push(
        { value: '1rm', label: 'حداکثر یک تکرار (1RM)', },
        { value: 'max_weight', label: 'حداکثر وزن ست' },
        { value: 'max_volume_set', label: 'حداکثر حجم ست' },
        { value: 'workout_volume', label: 'حجم کل تمرین' },
        )
    }

    return (
            
        <Modal            
            title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>جزئیات پیشرفت: {lastChosen}</Title>}
            open={true} 
            onCancel={onClose}
            footer={null} 
            centered
            width={600}>
            <Space orientation="vertical" size="middle" style={{ width: '100%', padding: 0 }}>
                <WorkoutPerformanceDetails
                    LogData={LogData} 
                    exerciseName={lastChosen}
                    METRICS={METRICS}
                />
                <History array={filteredAndProcessedData} metric={selectedMetric} unit={unit} />
            </Space>
        </Modal>
    )
}
// --- Component History (Fixed) ---
function History({array, metric, unit}){
    const getMetricValue = (workout) => {
        const value = workout[metric];
        return value !== undefined ? `${value.toFixed(1)}` : '-';
    }

    return (
        <div className="history-table-container">
            <h3>تاریخچه</h3>
            <div className="history-list">
            {array.length === 0 ? (
                <p className="no-history">داده‌ای یافت نشد.</p>
            ) : (
                array.map(w => (
                    <div key={w.id} className="history-workout-item"> 
                        <div className="history-date-header">
                            <span>📅 {w.date}</span>
                            <span className="highlight-metric">{getMetricValue(w)} {unit}</span>
                        </div>
                        <ul className="history-sets-table"> 
                            {w.sets.map((s, sid) => 
                                <li className={`history-set-item ${s.done ? 'set-done' : ''}`} key={sid}>
                                    <span className="set-number">{sid+1}</span>
                                    <span className="set-weight">
                                        {w.countsByWeight && s.weight !== undefined ? `${s.weight} kg` : ''}
                                    </span>
                                    <span className="set-reps">
                                        {s.reps} {w.specialRepFlag || 'reps'}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                ))
            )}
            </div>
        </div>
    )
}
function RoutineUser({date, onClose, ExercisePrelist, CategoriesofExercisePrelist, setExercisePrelist, setCategoriesofExercisePrelist, importRoutine, LogData}) {
    const [selectedRoutineId, setSelectedRoutineId] = useState(1)
    const [newRoutineName, setNewRoutineName] = useState("")
    function handleInputChange(value) {
        setSelectedRoutineId(Number(value));
    }
    function handleNewInputChange(e) {
        setNewRoutineName(e.target.value);
    }
    const [Routines, setRoutines] = useState(getSavedValue("Routines", RoutinesDefault))
    useEffect(() => {
        localStorage.setItem('Routines', JSON.stringify(Routines));
    }, [Routines])
    function AddNewRoutine() {
        const nextRoutineId = getMaxId(Routines) + 1
        setRoutines(routs => [...routs, {id: nextRoutineId, name: newRoutineName, days: []}])
    }
    function deleteSelectedRoutine() {
        setRoutines(Routines.filter(r=> r.id !== selectedRoutineId))
        setSelectedRoutineId(getMaxId(Routines))
    }
    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>مدیریت و وارد کردن روتین‌ها</Title>}
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <Space orientation="vertical" size="middle" style={{ width: '100%', paddingTop: 16 }}>
                <Text strong>ایجاد روتین جدید</Text>
                <Space.Compact block orientation="vertical">
                    <Input 
                        value={newRoutineName} 
                        onChange={handleNewInputChange} 
                        type="text" 
                        placeholder="نام روتین جدید" 
                        size="large"
                        style={{ flex: 1 }}
                    />
                    <Button 
                        type="primary" 
                        icon={Add} 
                        onClick={(e) => { e.preventDefault(); AddNewRoutine(); }}
                        size="large"
                    >
                        روتین جدید
                    </Button>
                </Space.Compact>
                <Space.Compact block orientation="vertical">
                    <Text strong style={{ marginTop: '16px', display: 'block' }}>انتخاب روتین</Text>
                    <Select 
                        onChange={handleInputChange} 
                        value={selectedRoutineId}  
                        style={{ width: '100%', marginTop: '4px' }}
                        size="large"
                        placeholder="یک روتین را انتخاب کنید"
                    >
                        {Routines.length > 0 && 
                            Routines.map( routine => 
                                <Option value={routine.id} key={routine.id}>
                                    {routine.name}
                                </Option>
                            )
                        }
                    </Select>
                    <Button 
                        type="default" 
                        danger 
                        icon={Delete} 
                        onClick={(e) => { e.preventDefault(); deleteSelectedRoutine(); }}
                        size="large"
                        disabled={Routines.length <= 1}
                    >
                        حذف
                    </Button>
                </Space.Compact>

                {/* ۳. نمایش و مدیریت روتین انتخاب شده (کامپوننت Routine) */}
                <div style={{ width: '100%', marginTop: '16px' }}>
                    {Routines.map( foundRoutine =>
                        selectedRoutineId === foundRoutine.id &&
                        <Routine 
                            importRoutine={importRoutine} 
                            key={foundRoutine.id} 
                            Routines={Routines} 
                            setRoutines={setRoutines} 
                            myself={foundRoutine} 
                            setExercisePrelist={setExercisePrelist} 
                            setCategoriesofExercisePrelist={setCategoriesofExercisePrelist} 
                            ExercisePrelist={ExercisePrelist} 
                            CategoriesofExercisePrelist={CategoriesofExercisePrelist} 
                            LogData={LogData}
                            date={date}
                        />
                    )}
                </div>

            </Space>
        </Modal>
    )
}
function BodyStatus({onClose,BodyLogData, effectBodyLogData, lastDate}) {
    const [form] = Form.useForm()
    const onFinish = (values) => {
        effectBodyLogData({
            type: "Add",
            id: getMaxId(BodyLogData),
            date: lastDate,
            metr: values.metric,
            value: values.value
        });
    };
    const onDelete = (who) => {
        effectBodyLogData({
            type: "Delete",
            id: who.id
        })
    }
    const weightLogs = BodyLogData
    .filter(log => log.metr === 'BodyWeight')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    const fatLogs = BodyLogData
    .filter(log => log.metr === 'BodyFat')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    return (
        <Modal
        open={true}
        onCancel={onClose}
        footer={null}
        title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>لاگ بدن</Title>}
        centered
        width={600}
        >
            <Space orientation="vertical">
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{ weight: 100, reps: 5 }}
                ><Alert title={`لاگ به تاریخ انتخاب شده اضافه می شود: ${lastDate}`} />
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                            name='metric'
                            label='متریک'
                            rules={[{ required:true, message: 'انتخاب نوع متریک الزامی است' }]}
                            >
                                <Select size="large" options={[{ label:'درصد چربی (%)', value:'BodyFat' },{ label:'وزن (kg)', value:'BodyWeight' }]} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="value" 
                                label="مقدار" 
                                rules={[{ required: true, message: 'ورود مقدار الزامی است.' }]}
                            >
                                <InputNumber 
                                    min={1} 
                                    step={0.1} 
                                    size="large" 
                                    style={{ width: '100%' }} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit" size="large" block>
                            + ثبت گزارش جدید
                        </Button>
                    </Form.Item>
                </Form>
                <Card 
                    title="تاریخچه لاگ بدن" 
                    style={{ marginTop: 20 }}
                    size="small" // برای ظاهری فشرده‌تر
                >

                    <List
                        style={{ 
                            maxHeight: '40vh', // به جای px از vh استفاده شد
                            overflowY: 'auto',
                            paddingRight: 10 // برای جبران نوار اسکرول
                        }}
                        dataSource={BodyLogData}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    // دکمه حذف لاگ (باید effectBodyLogData را فراخوانی کند)
                                    <Button 
                                        type="link" 
                                        danger 
                                        onClick={() => {
                                            onDelete(item)
                                        }}
                                    >
                                        حذف
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    // Title و Description می‌توانند از داده‌های لاگ استفاده کنند
                                    title={
                                        <Space>
                                            <Text strong style={{ color: 'var(--primary-color)' }}>
                                                {item.value} {item.metr === 'BodyWeight' ? 'کیلوگرم' : '% چربی'}
                                            </Text>
                                            <Text type="secondary">
                                                در تاریخ {item.date}
                                            </Text>
                                        </Space>
                                    }
                                    description={item.metr === 'BodyWeight' ? 'وزن بدن' : 'درصد چربی بدن'}
                                />
                            </List.Item>
                        )}
                    />

                </Card>


                <Graph
                    data={weightLogs}
                    dataKeyX="date"
                    dataKeyY="value"
                    name="وزن بدن"
                    unit="کیلوگرم"
                />
                <Graph
                    data={fatLogs}
                    dataKeyX="date" 
                    dataKeyY="value"
                    name="درصد چربی"
                    unit="%"
                />
            </Space>
        </Modal>
    )
}
function getMaxId(data) {
    if (!data || data.length === 0) return 1;
    // محاسبه حداکثر ID در آرایه اصلی (Workouts)
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}
function UpdateDetails({onClose, UPDATE_LOGS}) {
    return (
        <Modal
            title={<Title level={3}>{`تاریخچه تغییرات`}</Title>}
            open={true}
            onCancel={onClose}
            centered
            footer={[
                <Button key="confirm" type="primary" onClick={onClose}>
                    متوجه شدم!
                </Button>
            ]}
        >
            <Space orientation="vertical" style={{ width: '100%' }}>
                {
                UPDATE_LOGS
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
    )
}