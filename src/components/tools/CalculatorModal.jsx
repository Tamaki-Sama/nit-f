import { useState, useEffect, useCallback } from 'react'
import { Modal, Button, Select, Space, Typography, Segmented, InputNumber, Form, Statistic, Alert, Row, Col } from 'antd';
const { Title, Text } = Typography;
import {DISTANCE_UNITS, PACE_UNITS, CALCULATOR_CATEGORIES, STRENGTH_TOOLS, UTILITY_TOOLS
    , NUTRITION_TOOLS
} from '../../utils/constants'
import { calculateNRM, calculateOneRM, calculatePaceMinPerKm, timeToSeconds, secondsToTimeDisplay, distanceToMeters, paceToSecondsPerMeter } from '../../utils/calculations'
export default function Calculator({onClose}) {
    const [selectedCategory, setSelectedCategory] = useState(CALCULATOR_CATEGORIES[0].value);
    const [selectedTool, setSelectedTool] = useState(STRENGTH_TOOLS[0].value);
    const getCurrentTools = (category) => {
        switch (category) {
            case 'strength':
                return STRENGTH_TOOLS;
            case 'nutrition':
                return NUTRITION_TOOLS;
            case 'utility':
                return UTILITY_TOOLS; 
            default:
                return [];
        }
    };
    
    // 💡 تابع برای رندر کامپوننت ابزار
    const renderToolComponent = (tool) => {
        switch (tool) {
            case '1rm':
                return <OneRMCalculator/>; // به زودی پیاده‌سازی می‌شود
            case 'volume_calc':
                return <VolumeCalculator/>;
            case 'pace_calc':
                return <PaceCalculator/>;
            case 'time_calc':
                return <TimeCalculator />;
            case 'distance_calc':
                return <DistanceCalculatorComponent />;
            case 'tdee_calc':
                return <TDEECalculator />
            case 'macro_calc':
                return <MacroCalculator />
            default:
                return <Alert message="ابزار انتخاب شده موجود نیست." type="info" showIcon />;
        }
    };
    useEffect(() => {
        const tools = getCurrentTools(selectedCategory);
        if (tools.length > 0) {
            setSelectedTool(tools[0].value);
        } else {
            setSelectedTool(null);
        }
    }, [selectedCategory]);
    return (
        <Modal
            title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>ماشین حساب</Title>}
            open={true} // چون این کامپوننت به صورت مشروط رندر می‌شود
            onCancel={onClose}
            footer={null} // فوتر پیش‌فرض را حذف می‌کنیم
            centered
            width={600}
        >
            <Space orientation="vertical" size="middle" style={{ padding: '16px', background: 'var(--card-background)', borderRadius: '8px' }}>
                <Segmented
                    options={CALCULATOR_CATEGORIES}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    block
                    size="large"
                />
                <Space orientation="vertical" style={{ width: '100%', marginTop: '16px' }}>
                    {getCurrentTools(selectedCategory).length > 0 && (
                        <Select
                            placeholder="ابزار مورد نظر را انتخاب کنید"
                            options={getCurrentTools(selectedCategory)}
                            value={selectedTool}
                            onChange={setSelectedTool}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    )}
                    {selectedTool && renderToolComponent(selectedTool)}
                    {getCurrentTools(selectedCategory).length === 0 && (
                        <Alert 
                            title="ابزاری در این دسته بندی یافت نشد." 
                            description={`ابزارهای دسته "${CALCULATOR_CATEGORIES.find(c => c.value === selectedCategory)?.label}" در دست توسعه هستند.`}
                            type="warning" 
                            showIcon
                        />
                    )}
                </Space>
            </Space>
        </Modal>
    )
} 




function OneRMCalculator() {
    // استفاده از Form.useForm برای مدیریت ورودی‌ها
    const [form] = Form.useForm();
    const [results, setResults] = useState(null); // نتایج محاسبه شده
    const [error, setError] = useState(null);

    const onFinish = (values) => {
        setError(null);
        const { weight, reps } = values;

        if (weight <= 0 || reps <= 0 || reps > 12) {
            setError('ورودی نامعتبر: وزن و تکرار باید بیشتر از صفر باشند و تکرار حداکثر تا ۱۲ باشد.');
            setResults(null);
            return;
        }

        // 1. محاسبه 1RM اصلی
        const oneRM = calculateOneRM(weight, reps);
        
        // 2. محاسبه تخمینی برای 2RM تا 10RM (فقط برای نمایش یک طیف)
        const rmPredictions = [1, 2, 3, 5, 8, 10].map(rm => ({
            rm,
            // وزن N-RM باید همیشه کمتر یا مساوی 1RM باشد.
            weight: rm === 1 ? oneRM : calculateNRM(oneRM, rm),
        }));
        
        setResults(rmPredictions);
    };

    // لیست RMهایی که می‌خواهیم نمایش دهیم
    const displayRMs = [1, 3, 5]; // نمایش 1RM، 3RM و 5RM به عنوان پرکاربردترین‌ها

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ weight: 100, reps: 5 }}
            >
                <Row gutter={16}>
                    {/* ورودی وزن */}
                    <Col span={12}>
                        <Form.Item
                            label="وزن (کیلوگرم)"
                            name="weight"
                            rules={[{ required: true, message: 'وزن را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1} 
                                style={{ width: '100%' }} 
                                size="large"
                                addonAfter="kg"
                            />
                        </Form.Item>
                    </Col>
                    
                    {/* ورودی تکرار */}
                    <Col span={12}>
                        <Form.Item
                            label="تکرار"
                            name="reps"
                            rules={[{ required: true, message: 'تکرار را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1} 
                                max={12} // معمولاً تخمین 1RM برای تکرار بالای 12 دقیق نیست
                                style={{ width: '100%' }} 
                                size="large"
                                addonAfter="تکرار"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* دکمه محاسبه */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                        محاسبه حداکثر یک تکرار (1RM)
                    </Button>
                </Form.Item>
            </Form>

            {/* ۲. نمایش نتایج (Statistics) */}
            {error && <Alert message="خطا در ورودی" description={error} type="error" showIcon />}

            {results && (
                <div style={{ padding: '16px 0' }}>
                    <Title level={4} style={{ textAlign: 'center' }}>نتایج تخمینی</Title>
                    <Row gutter={16}>
                        {results
                            .filter(res => displayRMs.includes(res.rm)) // فیلتر کردن برای نمایش فقط 1, 3, 5
                            .map(res => (
                                <Col span={8} key={res.rm}>
                                    <Statistic 
                                        title={`${res.rm}RM تخمینی`} 
                                        value={res.weight.toFixed(1)} 
                                        suffix="kg"
                                        valueStyle={{ color: res.rm === 1 ? 'var(--primary-color)' : 'var(--text-primary)' }}
                                    />
                                </Col>
                            ))}
                    </Row>
                    <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
                        * بر اساس فرمول **Epley**. این مقادیر تخمینی هستند.
                    </Text>
                </div>
            )}
        </Space>
    );
}
function VolumeCalculator() {
    // استفاده از Form.useForm برای مدیریت ورودی‌ها
    const [form] = Form.useForm();
    const [result, setResult] = useState(null); // نتایج محاسبه شده
    const [error, setError] = useState(null);

    const onFinish = (values) => {
        setError(null);
        const { weight, reps } = values;

        if (weight <= 0 || reps <= 0) {
            setError('ورودی نامعتبر: وزن و تکرار باید بیشتر از صفر باشند.');
            setResult(null);
            return;
        }
        const total_volume = weight*reps
        setResult(total_volume);
    };

    // لیست RMهایی که می‌خواهیم نمایش دهیم
    const displayRMs = [1, 3, 5]; // نمایش 1RM، 3RM و 5RM به عنوان پرکاربردترین‌ها

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ weight: 100, reps: 5 }}
            >
                <Row gutter={16}>
                    {/* ورودی وزن */}
                    <Col span={12}>
                        <Form.Item
                            label="وزن (کیلوگرم)"
                            name="weight"
                            rules={[{ required: true, message: 'وزن را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1} 
                                style={{ width: '100%' }} 
                                size="large"
                                addonAfter="kg"
                            />
                        </Form.Item>
                    </Col>
                    
                    {/* ورودی تکرار */}
                    <Col span={12}>
                        <Form.Item
                            label="تکرار"
                            name="reps"
                            rules={[{ required: true, message: 'تکرار را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1} 
                                style={{ width: '100%' }} 
                                size="large"
                                addonAfter="تکرار"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={32}>
                        <Form.Item
                            label="تعداد ست"
                            name="sets"
                            rules={[{ required: true, message: 'تعداد ست را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1}
                                style={{ width: "100%" }}
                                size="large"
                                addonAfter="ست"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* دکمه محاسبه */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                        محاسبه حجم کل (Volume)
                    </Button>
                </Form.Item>
            </Form>

            {/* ۲. نمایش نتایج (Statistics) */}
            {error && <Alert message="خطا در ورودی" description={error} type="error" showIcon />}

            {result && (
                <div style={{ padding: '16px 0' }}>
                    <Title level={4} style={{ textAlign: 'center' }}>نتایج تخمینی</Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic 
                                title={`وزن کل ${result}`} 
                                value={result} 
                                suffix="kg"
                                valueStyle={{ color: 'var(--primary-color)' }}
                            />
                        </Col>
                    </Row>
                    <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
                        * مجموع همه وزن های بلند شده.
                    </Text>
                </div>
            )}
        </Space>
    );

}
function TDEECalculator() {
    // استفاده از Form.useForm برای مدیریت ورودی‌ها
    const [form] = Form.useForm();
    const [resultTDEE, setResultTDEE] = useState(null);
    const [resultBMR, setResultBMR] = useState(null);
    
    // ضریب فعالیت بدنی
    const ACTIVITY_MULTIPLIERS = [
        { value: 1.2, label: 'کم تحرک (نشستن، بدون ورزش)' },
        { value: 1.375, label: 'سبک (ورزش ۱-۳ روز در هفته)' },
        { value: 1.55, label: 'متوسط (ورزش ۳-۵ روز در هفته)' },
        { value: 1.725, label: 'فعال (ورزش روزانه یا شدید)' },
        { value: 1.9, label: 'فوق فعال (ورزش شدید ۲ بار در روز)' },
    ];
    const onValuesChange = useCallback((changedValues, allValues) => {
        const { weight, height, age, gender, activity } = allValues;

        if (!weight || !height || !age || !gender || !activity) {
            setResultTDEE(null);
            setResultBMR(null);
            return;
        }

        // ۱. محاسبه BMR
        let bmr;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else { // female
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        // ۲. محاسبه TDEE
        const tdee = bmr * activity;

        setResultBMR(bmr.toFixed(0));
        setResultTDEE(tdee.toFixed(0));
    }, []);

    return (
        <Space orientation="vertical" style={{ width: '100%', padding: '16px 0' }}>
            <Title level={4}>🧮 محاسبه کالری مصرفی روزانه (TDEE)</Title>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={onValuesChange}
                initialValues={{ weight: 100, reps: 5 }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="جنسیت"
                            name="gender"
                            rules={[{ required: true, message: 'جنسیت خود را انتخاب کنید.' }]}
                        >
                            <Select 
                                style={{ width: '100%' }} 
                                size="large"
                                options={[{label: 'خانم', value: 'female'}, {label: 'آقا', value: 'male'}]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="سن"
                            name="age"
                            rules={[{ required: true, message: 'سن خود را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1} 
                                style={{ width: '100%' }} 
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="وزن (کیلوگرم)"
                            name="weight"
                            rules={[{ required: true, message: 'وزن خود را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="قد (سانتی متر)"
                            name="height"
                            rules={[{ required: true, message: 'قد خود را وارد کنید.' }]}
                        >
                            <InputNumber 
                                min={1}
                                style={{ width: "100%" }}
                                size="large"
                            />
                        </Form.Item>                    
                    </Col>
                </Row>
                <Form.Item name="activity" label="سطح فعالیت" rules={[{ required: true }]}>
                    <Select size="large" options={ACTIVITY_MULTIPLIERS} />
                </Form.Item>
            </Form>

            <Row gutter={16} style={{ marginTop: 20 }}>
                <Col span={12}>
                    <Statistic title="BMR (کالری پایه)" value={resultBMR || '0'} suffix="kcal" />
                </Col>
                <Col span={12}>
                    <Statistic 
                        title="TDEE (کالری کل روزانه)" 
                        value={resultTDEE || '0'} 
                        suffix="kcal"
                        valueStyle={{ color: 'var(--primary-color)' }} 
                    />
                </Col>
            </Row>
            <Alert
                title="توجه"
                description={`برای **کاهش وزن** معمولاً باید ${resultTDEE - 500} کالری و برای **افزایش وزن** حدود ${Number(resultTDEE) + 300} کالری مصرف کنید.`}
                type="info"
                showIcon
                style={{ marginTop: 15 }}
            />
        </Space>
    );

}
function MacroCalculator() {
const [form] = Form.useForm();
    const [macros, setMacros] = useState(null);
    
    // مقادیر اولیه برای تست
    const initialValues = {
        targetCalories: 2500, // باید از TDEE یا ورودی کاربر گرفته شود
        carbPct: 40,
        proteinPct: 30,
        fatPct: 30,
    };

    const onValuesChange = useCallback((changedValues, allValues) => {
        const { targetCalories, carbPct, proteinPct, fatPct } = allValues;

        if (!targetCalories || targetCalories <= 0 || (carbPct + proteinPct + fatPct) !== 100) {
            setMacros(null);
            return;
        }
        
        // ۱. محاسبه کالری هر ماکرو
        const proteinCal = (targetCalories * (proteinPct / 100));
        const carbCal = (targetCalories * (carbPct / 100));
        const fatCal = (targetCalories * (fatPct / 100));
        
        // ۲. تبدیل کالری به گرم
        const proteinGram = proteinCal / 4;
        const carbGram = carbCal / 4;
        const fatGram = fatCal / 9;

        setMacros({
            protein: proteinGram.toFixed(0),
            carb: carbGram.toFixed(0),
            fat: fatGram.toFixed(0),
            totalCal: targetCalories,
        });

    }, []);

    return (
        <Space direction="vertical" style={{ width: '100%', padding: '16px 0' }}>
            <Title level={4}>📊 تفکیک غذایی (پروتئین، کربوهیدرات، چربی)</Title>
            <Form form={form} layout="vertical" onValuesChange={onValuesChange} initialValues={initialValues}>
                <Form.Item name="targetCalories" label="کالری هدف روزانه (kcal)" rules={[{ required: true }]}>
                    <InputNumber min={1000} step={100} size="large" style={{ width: '100%' }} />
                </Form.Item>
                
                <Title level={5}>درصد تفکیک ماکرو (جمع باید ۱۰۰٪ باشد)</Title>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item name="proteinPct" label="پروتئین (%)" rules={[{ required: true }]}>
                            <InputNumber min={0} max={100} size="large" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="carbPct" label="کربوهیدرات (%)" rules={[{ required: true }]}>
                            <InputNumber min={0} max={100} size="large" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="fatPct" label="چربی (%)" rules={[{ required: true }]}>
                            <InputNumber min={0} max={100} size="large" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            
            {macros && (
                <div style={{ marginTop: 20 }}>
                    <Title level={5}>نتایج تفکیک (بر اساس {macros.totalCal} کالری)</Title>
                    <Row gutter={16}>
                        <Col span={8}><Statistic title="پروتئین" value={macros.protein} suffix="گرم" /></Col>
                        <Col span={8}><Statistic title="کربوهیدرات" value={macros.carb} suffix="گرم" /></Col>
                        <Col span={8}><Statistic title="چربی" value={macros.fat} suffix="گرم" /></Col>
                    </Row>
                    <Alert
                        message="تأکید روی دقت"
                        description={`جمع درصدهای ماکرو باید دقیقاً **۱۰۰٪** باشد. اگر جمع بیش از ۱۰۰٪ یا کمتر از آن باشد، محاسبات ما با خطا مواجه خواهند شد.`}
                        type="warning"
                        showIcon
                        style={{ marginTop: 15 }}
                    />
                </div>
            )}
        </Space>
    );
}
function PaceCalculator() {
    // 1. حالت‌های ورودی
    const [distance, setDistance] = useState(5); // 5 کیلومتر
    const [distanceUnit, setDistanceUnit] = useState('km'); 
    const [timeHours, setTimeHours] = useState(0);
    const [timeMinutes, setTimeMinutes] = useState(30); // 30 دقیقه
    const [timeSeconds, setTimeSeconds] = useState(0);
    
    // 2. انتخاب متغیر مجهول (چیزی که باید محاسبه شود)
    const [target, setTarget] = useState('pace'); // 'pace', 'distance', 'time'

    // 3. حالت نتیجه محاسبه شده
    const [result, setResult] = useState(null); 
    const [paceResultDisplay, setPaceResultDisplay] = useState('00:00'); // Pace in MM:SS / km

    // --- منطق اصلی محاسبه (Real-Time) ---
    useEffect(() => {
        const totalTimeSeconds = timeToSeconds(timeHours, timeMinutes, timeSeconds);
        const totalDistanceMeters = distanceToMeters(distance, distanceUnit);
        
        // اگر مقادیر ورودی معتبر نبودند
        if (totalTimeSeconds <= 0 && totalDistanceMeters <= 0) {
            setResult(null);
            setPaceResultDisplay('00:00');
            return;
        }

        let calculatedValue = null;
        let paceValue = null;

        // محاسبه بر اساس متغیر مجهول انتخاب شده
        switch (target) {
            case 'pace': // ورودی: مسافت و زمان. خروجی: گام (Pace)
                if (totalTimeSeconds > 0 && totalDistanceMeters > 0) {
                    const paceMinPerKm = calculatePaceMinPerKm(totalDistanceMeters, totalTimeSeconds);
                    paceValue = paceMinPerKm;
                    
                    const paceTotalSeconds = paceMinPerKm * 60;
                    setPaceResultDisplay(secondsToTimeDisplay(paceTotalSeconds));
                    calculatedValue = null; // Pace را به صورت خاص در بالا ست کردیم.
                } else {
                    setPaceResultDisplay('...');
                }
                break;

            case 'time': // ورودی: مسافت و گام (Pace). خروجی: زمان کل
                // این حالت نیاز دارد که کاربر Pace را به صورت ورودی ست کند
                // برای سادگی، فعلاً فرض می‌کنیم کاربر Pace مورد نظر خود را در فیلد زمان وارد کرده است.
                // اگر می‌خواهید این حالت را فعال کنید، باید یک ورودی جداگانه برای Pace اضافه شود.
                // فعلاً این حالت را غیرقابل انتخاب می‌کنیم.
                // 💡 سختگیری: برای ساده‌سازی، فقط محاسبه زمان و مسافت را مجاز می‌کنیم.
                setTarget('pace');
                break;

            case 'distance': // ورودی: زمان و گام (Pace). خروجی: مسافت
                // این هم نیاز به ورودی Pace دارد، که فعلاً برای سادگی UI حذف می‌کنیم.
                setTarget('pace');
                break;
            default:
                break;
        }
        
        setResult(calculatedValue);
        
    }, [distance, distanceUnit, timeHours, timeMinutes, timeSeconds, target]);
    
    // --- پیاده‌سازی UI ---

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>مسافت طی شده</Title>
            <Row gutter={8} align="bottom">
                <Col span={18}>
                    <InputNumber
                        min={0}
                        step={0.1}
                        value={distance}
                        onChange={setDistance}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="مقدار مسافت"
                    />
                </Col>
                <Col span={6}>
                    <Select
                        value={distanceUnit}
                        onChange={setDistanceUnit}
                        options={DISTANCE_UNITS}
                        style={{ width: '100%' }}
                        size="large"
                    />
                </Col>
            </Row>

            <Title level={5} style={{ marginTop: 16 }}>زمان کل</Title>
            <Row gutter={8}>
                <Col span={8}>
                    <InputNumber
                        min={0}
                        value={timeHours}
                        onChange={setTimeHours}
                        style={{ width: '100%' }}
                        size="large"
                        addonAfter="ساعت"
                    />
                </Col>
                <Col span={8}>
                    <InputNumber
                        min={0}
                        max={59}
                        value={timeMinutes}
                        onChange={setTimeMinutes}
                        style={{ width: '100%' }}
                        size="large"
                        addonAfter="دقیقه"
                    />
                </Col>
                <Col span={8}>
                    <InputNumber
                        min={0}
                        max={59}
                        value={timeSeconds}
                        onChange={setTimeSeconds}
                        style={{ width: '100%' }}
                        size="large"
                        addonAfter="ثانیه"
                    />
                </Col>
            </Row>
            
            {/* ۳. نتیجه محاسبه شده (Pace) */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Statistic 
                    title="سرعت گام (Pace) تخمینی" 
                    value={paceResultDisplay} 
                    suffix="/ km"
                    valueStyle={{ 
                        fontSize: '32px', 
                        color: 'var(--primary-color)' 
                    }}
                />
                <Text type="secondary" style={{ marginTop: '5px', display: 'block' }}>
                    فرمت: دقیقه:ثانیه بر کیلومتر
                </Text>
            </div>

        </Space>
    );
}
function TimeCalculator() {
    const [form] = Form.useForm();
    const [resultTime, setResultTime] = useState(null);

    // --- تابع محاسبه ---
    const onValuesChange = useCallback((changedValues, allValues) => {
        const { distance, distanceUnit, paceMinutes, paceSeconds, paceUnit } = allValues;

        // ورودی‌های ضروری
        if (!distance || distance <= 0 || !paceMinutes || paceMinutes < 0) {
            setResultTime(null);
            return;
        }

        // ۱. تبدیل Pace به دقیقه بر کیلومتر (واحد استاندارد)
        const totalPaceMinutes = paceMinutes + (paceSeconds / 60);
        let paceMinPerKm;

        if (paceUnit === 'mile') {
            // تبدیل Pace از Min/mile به Min/km
            // 1 mile = 1.609 km
            paceMinPerKm = totalPaceMinutes / 1.60934; 
        } else { // 'km'
            paceMinPerKm = totalPaceMinutes;
        }
        
        // ۲. تبدیل مسافت ورودی به متر (واحد استاندارد)
        const totalDistanceMeters = distanceToMeters(distance, distanceUnit);
        
        // ۳. محاسبه زمان کل (Total Time)
        // Time (s) = Distance (m) * Pace (s/m)
        const paceSecPerMeter = paceToSecondsPerMeter(paceMinPerKm);
        const totalTimeSeconds = totalDistanceMeters * paceSecPerMeter;

        setResultTime(totalTimeSeconds);

    }, []);

    // --- UI ---
    return (
        <Space orientation="vertical" style={{ width: '100%', padding: '16px 0' }}>
            <Title level={4}>محاسبه **زمان کل** از سرعت گام و مسافت</Title>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={onValuesChange}
                initialValues={{ distanceUnit: 'km', paceUnit: 'km', paceMinutes: 4, paceSeconds: 30, distance: 5 }}
            >
                <Title level={5}>مسافت</Title>
                <Row gutter={8}>
                    <Col span={18}>
                        <Form.Item name="distance" rules={[{ required: true, message: 'مسافت لازم است' }]}>
                            <InputNumber min={0} step={0.1} style={{ width: '100%' }} size="large" placeholder="مقدار مسافت" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="distanceUnit">
                            <Select options={DISTANCE_UNITS} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ورودی ۲: سرعت گام (Pace) */}
                <Title level={5}>سرعت گام مورد نظر (Pace)</Title>
                <Row align="bottom">
                    <Col span={14}>
                        <Form.Item name="paceMinutes" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} size="large" addonAfter="دقیقه" />
                        </Form.Item>
                    </Col>
                    <Col span={14}>
                        <Form.Item name="paceSeconds">
                            <InputNumber min={0} max={59} style={{ width: '100%' }} size="large" addonAfter="ثانیه" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row align="bottom">
                    <Col span={10}>
                        <Form.Item name="paceUnit">
                            <Select options={PACE_UNITS} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            {/* نتیجه */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Statistic 
                    title="زمان کل مورد نیاز" 
                    value={resultTime ? secondsToTimeDisplay(resultTime) : '00:00'} 
                    valueStyle={{ fontSize: '36px', color: 'var(--primary-color)' }}
                />
                <Text type="secondary" style={{ marginTop: '5px', display: 'block' }}>
                    فرمت: H:MM:SS
                </Text>
            </div>
        </Space>
    );
}
function DistanceCalculatorComponent() {
    const [form] = Form.useForm();
    const [resultDistance, setResultDistance] = useState(null);
    const [resultUnit, setResultUnit] = useState('km'); // واحد نمایش خروجی

    // --- تابع محاسبه ---
    const onValuesChange = useCallback((changedValues, allValues) => {
        const { 
            timeHours, timeMinutes, timeSeconds,
            paceMinutes, paceSeconds, paceUnit,
            displayUnit // واحدی که کاربر می‌خواهد نتیجه را با آن ببیند
        } = allValues;

        setResultUnit(displayUnit); // به‌روزرسانی واحد نمایش

        // ورودی‌های ضروری: زمان کل و حداقل سرعت گام (دقیقه > 0 یا ثانیه > 0)
        const totalPaceMin = paceMinutes + (paceSeconds / 60);
        const totalTimeSeconds = timeToSeconds(timeHours, timeMinutes, timeSeconds);

        if (totalTimeSeconds <= 0 || totalPaceMin <= 0) {
            setResultDistance(null);
            return;
        }

        // ۱. تبدیل Pace به واحد استاندارد: Min/km
        let paceMinPerKm;
        if (paceUnit === 'mile') {
            // تبدیل Pace از Min/mile به Min/km (1 mile = 1.609 km)
            paceMinPerKm = totalPaceMin / 1.60934; 
        } else { // 'km'
            paceMinPerKm = totalPaceMin;
        }
        
        // ۲. محاسبه Pace بر حسب ثانیه بر متر (s/m)
        const paceSecPerMeter = paceToSecondsPerMeter(paceMinPerKm);
        
        // ۳. محاسبه مسافت کل در واحد پایه (متر)
        // Distance (m) = Time (s) / Pace (s/m)
        const totalDistanceMeters = totalTimeSeconds / paceSecPerMeter;

        // ۴. تبدیل خروجی از متر به واحد نمایش انتخاب شده
        let finalDistance;
        switch(displayUnit) {
            case 'km':
                finalDistance = totalDistanceMeters / 1000;
                break;
            case 'mile':
                finalDistance = totalDistanceMeters / 1609.34;
                break;
            case 'm':
            default:
                finalDistance = totalDistanceMeters;
                break;
        }
        
        setResultDistance(finalDistance);

    }, []);

    // --- UI ---
    return (
        <Space direction="vertical" style={{ width: '100%', padding: '16px 0' }}>
            <Title level={4}>محاسبه **مسافت کل** پیموده شده</Title>
            <Form
                form={form}
                layout="vertical"
                onValuesChange={onValuesChange}
                initialValues={{ 
                    paceUnit: 'km', 
                    paceMinutes: 5, 
                    paceSeconds: 0,
                    timeHours: 0, 
                    timeMinutes: 30, 
                    timeSeconds: 0,
                    displayUnit: 'km' // مقدار پیش‌فرض نمایش
                }}
            >
                {/* ورودی ۱: زمان کل */}
                <Title level={5}>زمان کل صرف شده</Title>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item name="timeHours" label="ساعت">
                            <InputNumber min={0} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="timeMinutes" label="دقیقه">
                            <InputNumber min={0} max={59} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="timeSeconds" label="ثانیه">
                            <InputNumber min={0} max={59} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ورودی ۲: سرعت گام (Pace) */}
                <Title level={5} style={{ marginTop: 16 }}>سرعت گام (Pace)</Title>
                <Row gutter={8} align="bottom">
                    <Col span={7}>
                        <Form.Item name="paceMinutes" label="دقیقه" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item name="paceSeconds" label="ثانیه">
                            <InputNumber min={0} max={59} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item name="paceUnit" label="واحد Pace">
                            <Select options={PACE_UNITS} style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </Col>
                </Row>
                
                {/* انتخاب واحد نمایش نتیجه */}
                <Title level={5} style={{ marginTop: 16 }}>نتیجه با واحد</Title>
                <Form.Item name="displayUnit">
                    <Select options={DISTANCE_UNITS} style={{ width: '100%' }} size="large" />
                </Form.Item>

            </Form>

            {/* نتیجه */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Statistic 
                    title="مسافت کل پیموده شده" 
                    value={resultDistance !== null ? resultDistance.toFixed(2) : '0.00'} 
                    suffix={resultUnit}
                    valueStyle={{ fontSize: '36px', color: 'var(--primary-color)' }}
                />
            </div>
        </Space>
    );
}
