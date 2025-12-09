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