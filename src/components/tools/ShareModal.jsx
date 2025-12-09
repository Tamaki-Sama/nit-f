import { Modal, Typography } from 'antd'
const { Title, Text } = Typography
import { Fragment } from 'react'

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
export default function Share({onClose, date, LogData}) {
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
            open={true}
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