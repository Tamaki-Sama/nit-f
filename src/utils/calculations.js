// general calculations
import { MAX_REPS_FOR_1RM } from './constants';
import { toGregorian, toJalaali } from 'jalaali-js';
// Performance calculations
export const calculateOneRM = (weight, reps) => {   
    if (!weight || reps === 0) return 0;
    let localReps = reps
    if (localReps > MAX_REPS_FOR_1RM) localReps = MAX_REPS_FOR_1RM
    return weight * (1 + reps / 30);
};
export function calculateSetVolume(set) {
    const weight = set.weight !== undefined ? set.weight : 1; 
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
export function aggregatePerformanceData(dailyData, metricKey, period) {
    
    if (period === 'day') {
        return dailyData;
    } 
    
    // تعیین کلید گروه‌بندی بر اساس دوره زمانی
    let keyGenerator;
    if (period === 'month') {
        keyGenerator = getMonthKey;
    } else if (period === 'week') {
        keyGenerator = getWeekKey; // ✨ استفاده از تابع هفتگی جدید
    } else {
        return dailyData; // اگر دوره نامعتبر باشد، به روزانه برمی‌گردد.
    }
    
    // منطق تجمیع (یکسان برای هفتگی و ماهانه)
    const groupedData = dailyData.reduce((acc, item) => {
        const periodKey = keyGenerator(item.date);
        if (!periodKey) return acc;

        if (!acc[periodKey]) {
            acc[periodKey] = {
                date: periodKey,
                values: []
            };
        }
        acc[periodKey].values.push(item.value);
        return acc;
    }, {});

    // تجمیع مقادیر گروه‌بندی شده
    const aggregated = Object.values(groupedData).map(group => {
        let finalValue;
        
        // تعیین روش تجمیع (Max یا Sum)
        if (metricKey === '1rm' || metricKey === 'max_weight' || metricKey === 'max_volume_set') {
            // برای قدرت: بیشترین مقدار
            finalValue = Math.max(...group.values);
        } else {
            // برای حجم و تکرارها: مجموع مقادیر
            finalValue = group.values.reduce((sum, val) => sum + val, 0);
        }
        
        return {
            date: group.date, 
            value: Math.round(finalValue)
        };
    });

    return aggregated; 
}


// 🔄 به‌روزرسانی تابع اصلی برای دریافت داده‌های نمودار
export function getPerformanceDataForGraph(LogData, exerciseName, metricKey, timePeriod = 'day'){
    
    // ۱ و ۲: استخراج داده‌های روزانه خام
    // (همان منطق قبلی)
    const dailyExerciseLogs = sortInDate(LogData, exerciseName);
    const rawGraphData = [];
    
    for (const dailyLog of dailyExerciseLogs) {
        const exerciseLog = dailyLog.logs[0]; 
        if (exerciseLog && exerciseLog.sets.length > 0) {
            const metrics = calculateExerciseMetrics(exerciseLog);
            const value = metrics[metricKey];
            if (value > 0) { 
                rawGraphData.push({
                    date: dailyLog.date, 
                    value: value,        
                });
            }
        }
    }
    
    // ۳. ✨ مرحله تجمیع داده‌ها
    // پارامتر metricKey را به تابع تجمیع می‌دهیم تا بداند Max بگیرد یا Sum
    const aggregatedData = aggregatePerformanceData(rawGraphData, metricKey, timePeriod); // <== ارسال metricKey
    
    return aggregatedData;
};
// 💡 تابع کمکی برای استخراج کلید بازه زمانی (ماهانه)
const getMonthKey = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length < 2) return null;
    
    return `${parts[0]}/${parts[1]}/01`;
};
const WEEK_START_DAY = 6;
const getWeekKey = (dateString) => {
    const [jy, jm, jd] = dateString.split('/').map(Number);
    
    // 1. تبدیل به میلادی (برای استفاده از getDay)
    const g = toGregorian(jy, jm, jd);
    const gDate = new Date(g.gy, g.gm - 1, g.gd);
    
    // 2. پیدا کردن روز هفته میلادی (0=یکشنبه تا 6=شنبه)
    let dayOfWeek = gDate.getDay(); // 6 = شنبه (Saturday)
    
    // 3. محاسبه روزهای لازم برای رسیدن به شنبه (اول هفته)
    let daysToSubtract;
    if (dayOfWeek === 6) { // اگر شنبه باشد
        daysToSubtract = 0;
    } else {
        // مثال: یکشنبه (0) --> باید 1 روز به عقب برگردیم.
        // مثال: جمعه (5) --> باید 6 روز به عقب برگردیم.
        daysToSubtract = dayOfWeek + 1;
    }

    // 4. کم کردن روزها (نیاز به منطق/تابع کمکی برای کم کردن روز از تاریخ میلادی)
    // new Date().setDate() را استفاده کنید و سپس به شمسی برگردانید.
    gDate.setDate(gDate.getDate() - daysToSubtract);
    
    // 5. تبدیل تاریخ میلادی جدید به شمسی
    const finalJalaali = toJalaali(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate());
    
    // 6. فرمت دهی خروجی
    return `${finalJalaali.jy}/${String(finalJalaali.jm).padStart(2, '0')}/${String(finalJalaali.jd).padStart(2, '0')}`;
};