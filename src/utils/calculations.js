// general calculations


// Performance calculations
export const calculateOneRM = (weight, reps) => {   
    if (!weight || reps === 0) return 0;
    let localReps = reps
    if (localReps > 13) localReps = 13 // 13 = recommended maximum rep for better 1rm calculations
    return weight * (1 + reps / 30);
};
export function calculateSetVolume(set) {
    const weight = set.weight !== undefined ? set.weight : 1; // وزن بدن را 1 فرض می‌کنیم
    return set.reps * weight;
}
export const calculateNRM = (oneRM, targetReps) => {
    return oneRM / (1 + targetReps / 30);
};

// تبدیل زمان ورودی (H/Min/Sec) به ثانیه
export const timeToSeconds = (h = 0, m = 0, s = 0) => (h * 3600) + (m * 60) + s;

// تبدیل ثانیه به فرمت H:MM:SS (برای نمایش زمان کل)
export const secondsToTimeDisplay = (totalSeconds) => {
    if (totalSeconds < 0 || isNaN(totalSeconds)) return '00:00';
    const h = Math.floor(totalSeconds / 3600);
    const remainder = totalSeconds % 3600;
    const m = Math.floor(remainder / 60);
    const s = Math.round(remainder % 60);
    
    let display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (h > 0) {
        // اگر ساعت وجود داشت، ساعت را هم اضافه کن
        display = `${h}:` + display;
    }
    return display;
};

// تبدیل مسافت بر اساس واحد دلخواه به متر (به عنوان واحد پایه)
export const distanceToMeters = (value, unit) => {
    if (value <= 0 || isNaN(value)) return 0;
    switch (unit) {
        case 'km': return value * 1000;
        case 'mile': return value * 1609.34;
        case 'm':
        default: return value;
    }
};

// محاسبه Pace بر حسب دقیقه بر کیلومتر (Min/km)
export const calculatePaceMinPerKm = (distanceMeters, timeSeconds) => {
    if (distanceMeters <= 0 || timeSeconds <= 0) return 0;
    // (Time in Seconds / Distance in Meters) * 1000m/km / 60s/min
    const paceSecondsPerMeter = timeSeconds / distanceMeters;
    const paceSecondsPerKm = paceSecondsPerMeter * 1000;
    const paceMinutesPerKm = paceSecondsPerKm / 60; // Pace in Min/Km (e.g., 4.5 = 4:30 min/km)
    return paceMinutesPerKm;
};
export const paceToSecondsPerMeter = (paceMinPerKm) => {
    if (paceMinPerKm <= 0 || isNaN(paceMinPerKm)) return 0;
    // (Pace in Min/km) * 60 sec/min = seconds per km
    const paceSecondsPerKm = paceMinPerKm * 60; 
    // seconds per km / 1000 m/km = seconds per meter
    return paceSecondsPerKm / 1000; 
};
// Arrays
export function getMaxId(data) { // (data: []): number
    if (!data || data.length === 0) return 1;
    const maxId = data.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
}

// Specific
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
export const calculateExerciseMetrics = (exerciseLog) => {
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
    };
};
export function getPerformanceDataForGraph(LogData, exerciseName, metricKey){
    
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