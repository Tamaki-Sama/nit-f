// utils/PerformanceCalculations.js

/**
 * تخمین حداکثر یک تکرار (One Rep Max) بر اساس فرمول Epley
 * @param {number} weight - وزن بلند شده
 * @param {number} reps - تعداد تکرارها
 * @returns {number} 1RM تخمین زده شده
 */
export const calculateOneRM = (weight, reps) => {
    if (!weight || reps === 0) return 0;
    let localReps = reps
    if (localReps > 13) localReps = 13
    return weight * (1 + reps / 30);
};

/**
 * محاسبه حداکثر متریک‌های یک تمرین در یک روز (تمامی ست‌ها)
 * @param {Object} exerciseLog - آبجکت یک تمرین در LogData
 * @returns {Object} شامل max_weight, 1rm, workout_volume و...
 */
const calculateExerciseMetrics = (exerciseLog) => {
    let maxWeight = 0;
    let maxVolumeSet = 0;
    let totalVolume = 0;
    let totalReps = 0;
    let max1RM = 0;
    let maxReps = 0;

    for (const set of exerciseLog.sets) {
        const weight = set.weight || 0;
        const reps = set.reps || 0;
        
        if (weight > maxWeight) maxWeight = weight;
        if (reps > maxReps) maxReps = reps;
        
        const volumeSet = weight * reps;
        if (volumeSet > maxVolumeSet) maxVolumeSet = volumeSet;
        
        totalVolume += volumeSet;
        totalReps += reps

        const estimated1RM = calculateOneRM(weight, reps);
        if (estimated1RM > max1RM) max1RM = estimated1RM;
    }

    return {
        '1rm': max1RM,
        max_weight: maxWeight,
        max_reps: maxReps,
        max_volume_set: maxVolumeSet,
        workout_volume: totalVolume,
        workout_reps: totalReps,
        // ... (بقیه متریک‌های موجود در METRICS)
    };
};

/**
 * استخراج و تبدیل داده‌های LogData به فرمت قابل نمایش در گراف
 * @param {Array<Object>} LogData - کل آرایه لاگ روزانه شما
 * @param {string} exerciseName - نام تمرین هدف
 * @param {string} metricKey - کلید متریک مورد نظر (مثلاً '1rm')
 * @returns {Array<Object>} آرایه داده آماده گراف: [{ date: '1404/01/01', value: 120 }, ...]
 */

export const getPerformanceDataForGraph = (LogData, exerciseName, metricKey) => {
    
    // ۱. گروه‌بندی کل داده‌ها، با فیلتر کردن بر اساس نام تمرین
    // نتیجه: [{ date: '1404/09/01', logs: [ {name: 'پرس سینه', ...} ] }, ...]
    const dailyExerciseLogs = sortInDate(LogData, exerciseName);
    
    const graphData = [];
    
    // ۲. تکرار روی لاگ‌های روزانه فیلتر شده
    for (const dailyLog of dailyExerciseLogs) {
        // چون در sortInDate فیلتر اعمال شده، dailyLog.logs فقط شامل یک نوع تمرین است.
        
        // 💡 سختگیری: اگر یک تمرین در روز بیش از یک بار ثبت شود (چند Log برای یک اسم)،
        // باید تمام ست‌های آن ادغام شوند یا از لاگ اول استفاده شود.
        // فرض می‌کنیم در اینجا، چون تمرینات از LogData گرفته شده، هر روز حداکثر یک آبجکت برای آن تمرین دارد.
        const exerciseLog = dailyLog.logs[0]; 

        if (exerciseLog && exerciseLog.sets.length > 0) {
            // ۳. محاسبه متریک‌ها (1RM، Volume و...) برای لاگ آن روز
            const metrics = calculateExerciseMetrics(exerciseLog);
            
            const value = metrics[metricKey];
            
            if (value > 0) { 
                graphData.push({
                    date: dailyLog.date, // محور X
                    value: value,        // محور Y
                });
            }
        }
    }
    
    // ۳. این آرایه قبلاً در sortInDate مرتب شده است.
    return graphData;
};
/**
 * گروه‌بندی آرایه لاگ تمرینات بر اساس تاریخ و مرتب‌سازی نتیجه بر اساس تاریخ.
 * * اگر FilterName داده شود، فقط آن تمرینات در لاگ‌های روزانه گنجانده می‌شوند.
 *
 * @param {Array<Object>} Data - کل آرایه لاگ تمرینات (Flat List)
 * @param {string | undefined} FilterName - نام تمرین هدف (مثلاً 'پرس سینه')
 * @returns {Array<Object>} آرایه‌ای از لاگ‌های گروه‌بندی شده: 
 * [{date: "1404/08/25", logs: [{... تمرینات آن روز ...}]}, ...]
 */
export const sortInDate = (Data, FilterName) => {
    // ۱. گروه‌بندی داده‌ها بر اساس تاریخ
    const groupedData = Data.reduce((accumulator, log) => {
        
        // اگر FilterName مشخص شده و نام تمرین مطابقت ندارد، این آیتم را نادیده بگیر.
        if (FilterName && log.name !== FilterName) {
            return accumulator; 
        }
        
        const dateKey = log.date;
        
        // اگر این تاریخ قبلاً در انباشتگر (accumulator) موجود نیست، یک آبجکت روز جدید بساز.
        if (!accumulator[dateKey]) {
            accumulator[dateKey] = {
                date: dateKey,
                logs: [] // این آرایه شامل آبجکت‌های تمرین (Workout) خواهد بود
            };
        }
        
        // آبجکت تمرین را به آرایه logs آن روز اضافه کن.
        accumulator[dateKey].logs.push(log); 

        return accumulator;
    }, {}); // شروع انباشتگر به عنوان یک آبجکت خالی

    // ۲. تبدیل آبجکت گروه‌بندی شده به آرایه از مقادیر
    let sortedArray = Object.values(groupedData);

    // ۳. مرتب‌سازی آرایه نهایی بر اساس تاریخ (صعودی: قدیمی‌ترین تاریخ اول)
    // چون فرمت تاریخ شمسی شما "YYYY/MM/DD" است، مرتب‌سازی رشته‌ای (localeCompare) به درستی عمل می‌کند.
    sortedArray.sort((a, b) => {
        return a.date.localeCompare(b.date);
    });

    return sortedArray;
};