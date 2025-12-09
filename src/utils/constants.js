// CONSTANT values
export {DATE_FILTERS, DISTANCE_UNITS, PACE_UNITS, CALCULATOR_CATEGORIES, STRENGTH_TOOLS, UTILITY_TOOLS
    , NUTRITION_TOOLS
}
const DATE_FILTERS = [
    { value: 'all', label: 'همه زمان‌ها' },
    { value: 'year', label: 'سال اخیر' },
    { value: '6_months', label: 'شش ماه اخیر' },
    { value: '3_months', label: 'سه ماه اخیر' },
    { value: 'month', label: 'ماه اخیر' },
];

// --- ثابت‌های ماشین حساب Pace ---
const DISTANCE_UNITS = [
    { value: 'km', label: 'کیلومتر (km)' },
    { value: 'm', label: 'متر (m)' },
    { value: 'mile', label: 'مایل (mile)' },
];
const PACE_UNITS = [
    { value: 'km', label: 'Min / km' },
    { value: 'mile', label: 'Min / mile' },
];
// --- توابع تبدیل ---
const CALCULATOR_CATEGORIES = [
    { value: 'strength', label: 'ورزشی' },
    { value: 'nutrition', label: 'تغذیه و بدن' },
    { value: 'utility', label: 'ابزارهای کمکی' },
];

const STRENGTH_TOOLS = [
    { value: '1rm', label: 'محاسبه حداکثر یک تکرار (1RM)' },
    { value: 'volume_calc', label: 'محاسبه حجم کل (Volume)' }
];
const UTILITY_TOOLS = [
    { value: 'pace_calc', label: 'محاسبه سرعت گام (Pace)' },
    { value: 'distance_calc', label: 'محاسبه مسافت کل' },
    { value: 'time_calc', label: 'محاسبه زمان کل' },
];
const NUTRITION_TOOLS = [
    { value: 'tdee_calc', label: 'محاسبه کالری موردنیاز (TDEE)' },
    { value: 'macro_calc', label: 'تفکیک غذایی (Macro)' }
]

export const UPDATE_LOGS = [
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
        features: ["تنظیمات","تقویم میلادی (قابل انتخاب)","رفع باگ های جزئی","آپدیت تایمر","نمایش نمودارها براساس واحد اندازه گیری حرکات (وزن، زمان و...)","طراحی روتین ها از روی تمرینات موجود در روز انتخاب شده"],
    },
    {
        id: 8, 
        version: "7.0.0",
        date: "1404/09/18",
        title: "ریفکتوری",
        features: ["طراحی مجدد", "بهینه سازی داخلی", "مدیریت خطا و باگ های احتمالی", "اضافه شدن نوتیف بالا راست صفحه"],
    },
];