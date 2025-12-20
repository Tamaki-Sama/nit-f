import {toJalaali} from 'jalaali-js'
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
export function getTodayJalaali() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const jDate = toJalaali(year, month, day);
    return `${jDate.jy}/${String(jDate.jm).padStart(2, '0')}/${String(jDate.jd).padStart(2, '0')}`;
}
export const jalaaliToGregorianDate = (dateString) => {
    const [jy, jm, jd] = dateString.split('/').map(Number);
    const g = toGregorian(jy, jm, jd);
    return new Date(g.gy, g.gm - 1, g.gd);
};
export const formatSecondsToMMSS = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
const convertPersianNumbersToEnglish = (str) => {
    return str.replace(/[۰-۹]/g, (match) => persianToEnglishMap[match]);
};

export const stringToDateObject = (dateString) => {
    if (!dateString) return null;
    
    // چون ورودی دیتابیس شما لاتین است، نیازی به تبدیل ورودی نیست.
    return new DateObject({
        date: dateString,
        format: "YYYY/MM/DD", 
        calendar: persian,
    });
};
export const formatJalaaliDateForGraph = (dateString, period) => {
    
    // اگر ورودی نامعتبر است
    if (!dateString) return '';

    const parts = dateString.split('/');
    if (parts.length < 3) return dateString;

    const [jy, jm, jd] = parts;
    
    switch (period) {
        case 'month':
            // حالت ماهانه: فقط نمایش سال و ماه (بدون روز)
            // مثال: '1404/09'
            return `${jy}/${jm}`; 

        case 'week':
            // حالت هفتگی: نمایش ماه و روز (چون jy/jm/jd تاریخ شنبه است، نمایش کامل تاریخ کافی است)
            // می‌توانیم برای کوتاهی بیشتر، سال را حذف کنیم.
            // مثال: '09/18' (اگر تاریخ شنبه 18 آذر باشد)
            return `${jm}/${jd}`;
            
        case 'day':
        default:
            // حالت روزانه: نمایش کامل یا روز و ماه
            // می‌توان از jm/jd استفاده کرد تا محور X خلوت‌تر باشد
            return `${jm}/${jd}`; 
    }
};
export const dateObjectToString = (dateObject) => {
    if (!dateObject) return '';
    
    // ۱. استخراج تاریخ (با اعداد فارسی)
    const persianFormattedString = dateObject.format("YYYY/MM/DD");
    
    // ۲. تبدیل خروجی به اعداد لاتین ("1404/11/11")
    return convertPersianNumbersToEnglish(persianFormattedString);
};
const persianToEnglishMap = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};