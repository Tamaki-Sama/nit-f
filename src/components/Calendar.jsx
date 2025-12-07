import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

// --- توابع کمکی برای سازگاری با فرمت و اعداد شما ---

const persianToEnglishMap = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
};

const convertPersianNumbersToEnglish = (str) => {
    return str.replace(/[۰-۹]/g, (match) => persianToEnglishMap[match]);
};

const stringToDateObject = (dateString) => {
    if (!dateString) return null;
    
    // چون ورودی دیتابیس شما لاتین است، نیازی به تبدیل ورودی نیست.
    return new DateObject({
        date: dateString,
        format: "YYYY/MM/DD", 
        calendar: persian,
    });
};

const dateObjectToString = (dateObject) => {
    if (!dateObject) return '';
    
    // ۱. استخراج تاریخ (با اعداد فارسی)
    const persianFormattedString = dateObject.format("YYYY/MM/DD");
    
    // ۲. تبدیل خروجی به اعداد لاتین ("1404/11/11")
    return convertPersianNumbersToEnglish(persianFormattedString);
};

// --- کامپوننت اصلی Calendar ---

const Calendar = ({ onSelect, selectedDateOfParent, calendarType }) => {
    const initialValue = stringToDateObject(selectedDateOfParent);

    const handleValueChange = (dateObject) => {
        // تاریخ انتخاب شده به صورت رشته‌ای با اعداد لاتین به App ارسال می‌شود.
        const formattedDate = dateObjectToString(dateObject);
        onSelect(formattedDate);
    };
    return (
        <DatePicker
            calendar={persian} 
            locale={persian_fa}
            
            value={initialValue}
            onChange={handleValueChange}
            format="YYYY/MM/DD" 
            
            // 💡 Input پیش‌فرض تقویم را نامرئی می‌کنیم
            inputClass="visible-calendar-input ant-style-button-input"
            
            onlyShowCalendar={false}
        />
    )                    
};

export default Calendar;