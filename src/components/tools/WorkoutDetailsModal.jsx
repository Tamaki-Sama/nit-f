import { useMemo, useState, useEffect } from 'react'
import { useModal } from '../../utils/hooks';
import { Edit } from '../common/Icons'
import { DATE_FILTERS } from '../../utils/constants';
import WorkoutPerformanceDetails from '../charts/WorkoutPerformance'
import { calculateSetVolume, calculateOneRM } from '../../utils/calculations';
import { Modal, Typography, Space } from 'antd'
const { Title } = Typography
import WorkoutPickerReadOnly from '../pickers/WorkoutPickerReadOnly'
export default function WorkoutDetails({LogData, onClose, lastChosen, ExercisePrelist}) {
    const [targetName, setTargetName] = useState(lastChosen)
    const [fullObj, setFullObj] = useState(ExercisePrelist.find( e => e.name === targetName ))
    const handleWorkoutSelection = (selectedExercise) => {
        setTargetName(selectedExercise.name);
        setFullObj(selectedExercise)
        closePicker(); 
    }
    const [isPickerOpen, openPicker, closePicker] = useModal();


    const rawHistory = useMemo(()=> LogData.filter(e => e.name === targetName),
    [LogData, targetName])
    
    
    // تشخیص نوع تمرین (کاردیو یا قدرتی)
    const isCardio = rawHistory?.some(w => w.specialRepFlag === 'm' || w.specialRepFlag === 'km');

    // ✅ State برای متریک و فیلتر
    const [selectedMetric, setSelectedMetric] = useState(''); // ابتدا خالی می‌گذاریم تا در useEffect ست شود
    const [selectedFilter, setSelectedFilter] = useState(DATE_FILTERS[0].value);

    // ✅ تنظیم متریک پیش‌فرض مناسب بر اساس نوع تمرین
    useEffect(() => {
        if (isCardio) {
            setSelectedMetric('max_distance');
        } else {
            setSelectedMetric('max_weight');
        }
    }, [isCardio]);

    const filteredAndProcessedData = useMemo(() => {
        const filterDate = (dateString, filterType) => {
            if (filterType === 'all') return true;
            // TODO: منطق دقیق تاریخ شمسی
            return true;
        };
        const processed = rawHistory
            .filter(w => filterDate(w.date, selectedFilter))
            .map(workout => {
                let max_1rm = 0, max_w = 0, max_r = 0, max_v_set = 0, total_v = 0, total_r = 0;
                let max_dist = 0, max_time = 0, max_speed = 0, total_dist = 0, total_time = 0;

                workout.sets.forEach(set => {
                    const volume = calculateSetVolume(set);
                    
                    // معیارهای کلی
                    total_v += volume;
                    total_r += set.reps;

                    // معیارهای حداکثر
                    max_w = Math.max(max_w, set.weight || 0);
                    max_r = Math.max(max_r, set.reps);
                    max_v_set = Math.max(max_v_set, volume);
                    
                    // 1RM
                    if (set.weight) {
                        const rm = calculateOneRM(set.weight, set.reps);
                        max_1rm = Math.max(max_1rm, rm);
                    }
                    
                    // کاردیو
                    if (workout.specialRepFlag === 'm' || workout.specialRepFlag === 'km') {
                        const distance = set.reps; 
                        const time = set.weight || 0; 

                        max_dist = Math.max(max_dist, distance);
                        total_dist += distance;
                        max_time = Math.max(max_time, time);
                        total_time += time;
                        if (time > 0) max_speed = Math.max(max_speed, distance / time);
                    }
                });

                return {
                    date: workout.date,
                    id: workout.id,
                    max_1rm: max_1rm, 
                    max_weight: max_w,
                    max_reps: max_r,
                    max_volume_set: max_v_set,
                    workout_volume: total_v,
                    workout_reps: total_r,
                    max_distance: max_dist,
                    max_time: max_time,
                    max_speed: max_speed,
                    workout_distance: total_dist,
                    workout_time: total_time,
                    sets: workout.sets, 
                    countsByWeight: workout.countsByWeight,
                    specialRepFlag: workout.specialRepFlag
                };
            });
            
        // ✅ مرتب‌سازی بر اساس تاریخ (نزولی - جدیدترین بالا)
        return processed.sort((a, b) => b.id - a.id); // یا مقایسه تاریخ

    }, [rawHistory, selectedFilter]); // removed selectedMetric dependency from processing logic
    
    // if (!selectedMetric || !filteredAndProcessedData?.length) return null;

    const getUnit = (metric) => {
        if (metric.includes('weight') || metric.includes('1rm') || metric.includes('volume')) return ' kgs';
        if (metric.includes('reps')) return ' reps';
        if (metric.includes('distance')) return ' m';
        if (metric.includes('time')) return ' s';
        return '';
    }
    const unit = getUnit(selectedMetric);
    let METRICS = [];
    if (fullObj) {
        if (fullObj.specialRepFlag === 'reps' || !fullObj.specialRepFlag) {
            METRICS.push(
            { value: 'workout_reps', label: 'تعداد کل تکرار' },
            { value: 'max_reps', label: 'حداکثر تکرار ست' },
            )
        }
        if (fullObj.specialRepFlag === 'sec') {
            METRICS.push({ value: 'max_time', label: 'حداکثر زمان' })
        }
        if (fullObj.specialRepFlag === 'm') {
            METRICS.push( { value: 'max_distance', label: 'حداکثر مسافت' })
        }
        if (fullObj.countsByWeight && (fullObj.specialRepFlag === 'reps' || !fullObj.specialRepFlag)) {
            METRICS.push(
            { value: '1rm', label: 'حداکثر یک تکرار (1RM)', },
            { value: 'max_weight', label: 'حداکثر وزن ست' },
            { value: 'max_volume_set', label: 'حداکثر حجم ست' },
            { value: 'workout_volume', label: 'حجم کل تمرین' },
            )
        }
    } else {
        METRICS.push({ value: 'null', label: 'انتخاب نشده' })
    }
    return (
            
        <Modal            
            title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>{targetName ? `جزئیات پیشرفت: ${targetName}` : `جزئیات پیشرفت`}</Title>}
            open={true} 
            onCancel={onClose}
            footer={null} 
            centered
            width={600}>
            <Space orientation="vertical" size="middle" style={{ width: '100%', padding: 0 }}>
                <button type="button" onClick={openPicker} className="workout-picker-btn ant-style-button-input" dir="rtl">
                    {fullObj?.name ? `انتخاب شده: ${fullObj.name}` : "انتخاب تمرین..."}
                    {Edit}
                </button>
                {isPickerOpen && (
                    <WorkoutPickerReadOnly 
                        onSelect={handleWorkoutSelection}
                        onClose={closePicker} 
                        ExercisePrelist={ExercisePrelist}
                    />
                )}
                <WorkoutPerformanceDetails
                    LogData={LogData} 
                    exerciseName={targetName}
                    METRICS={METRICS}
                /> 
                <History array={filteredAndProcessedData} metric={selectedMetric} unit={unit} />
            </Space>
        </Modal>
    )
}
// --- Component History (Fixed) ---
function History({array, metric, unit}){
    const getMetricValue = (workout) => {
        const value = workout[metric];
        return value !== undefined ? `${value.toFixed(1)}` : '-';
    }

    return (
        <div className="history-table-container">
            <h3>تاریخچه</h3>
            <div className="history-list">
            {array.length === 0 ? (
                <p className="no-history">داده‌ای یافت نشد.</p>
            ) : (
                array.map(w => (
                    <div key={w.id} className="history-workout-item"> 
                        <div className="history-date-header">
                            <span>📅 {w.date}</span>
                            <span className="highlight-metric">{getMetricValue(w)} {unit}</span>
                        </div>
                        <ul className="history-sets-table"> 
                            {w.sets.map((s, sid) => 
                                <li className={`history-set-item ${s.done ? 'set-done' : ''}`} key={sid}>
                                    <span className="set-number">{sid+1}</span>
                                    <span className="set-weight">
                                        {w.countsByWeight && s.weight !== undefined ? `${s.weight} kg` : ''}
                                    </span>
                                    <span className="set-reps">
                                        {s.reps} {w.specialRepFlag || 'reps'}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                ))
            )}
            </div>
        </div>
    )
}