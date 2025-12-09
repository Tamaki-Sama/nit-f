import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {stringToDateObject, dateObjectToString} from '../../utils/formatters'

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