import { useState } from "react";
import { Modal, Space, Typography, Select, Input, Checkbox, Button} from "antd";
const {Text, Title} = Typography
const {Option} = Select
export default function WorkoutAdder({onClose, pushNewWorkout, CategoriesofExercisePrelist, ExercisePrelist}) {
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState(CategoriesofExercisePrelist[0].name || '');
    const [countsByWeight, setCountsByWeight] = useState(true); 
    const [unitType, setUnitType] = useState(''); 
    const [notes, setNotes] = useState('')

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (!exerciseName.trim() || !category.trim()) {
            alert('نام تمرین و دسته بندی نمی‌توانند خالی باشند!')
            console.error('نام تمرین و دسته بندی نمی‌توانند خالی باشند!');
            return;
        }
        if (ExercisePrelist.find(e => e.name == exerciseName)) {
            alert('نام تمرین قبلا انتخاب شده است!')
            return;
        }
        const newWorkoutData = {
            name: exerciseName.trim(),
            category: category,
            countsByWeight: countsByWeight,
            specialRepFlag: unitType.trim() === 'reps' || unitType.trim() === '' ? undefined : unitType.trim(),
            notes: notes
        };

        pushNewWorkout(newWorkoutData);
        onClose();
    };

    return (  
        <Modal            
            title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>افزودن تمرین سفارشی</Title>}
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            width={600}>
            <Space orientation="vertical" size="middle" style={{ width: '100%', paddingTop: 16 }}>
                <Space.Compact orientation="vertical" style={{ width: '100%', padding: 0 }}> 
                    <Text strong>نام تمرین</Text>
                    <Input 
                        type="text" 
                        placeholder="نام"
                        value={exerciseName} 
                        onChange={(e) => {setExerciseName(e.target.value)}}
                        required
                    />

                    <Text strong>دسته بندی اصلی</Text>
                    <Select 
                        value={category.name} 
                        onChange={(e) => setCategory(e)}
                        style={{ width: '100%', marginTop: '4px' }}
                        required
                    >
                        {CategoriesofExercisePrelist.map(cat => (
                            <Option key={cat.id} value={cat.name}>{cat.name}</Option>
                        ))}
                    </Select>

                    <Text strong>واحد اندازه‌گیری (تکرار/وزن/زمان/متر)</Text>
                    <Input 
                        type='text'
                        placeholder="reps, m, s, min..."
                        value={unitType} 
                        onChange={(e) => setUnitType(e.target.value)}
                    />

                    <div>
                        <Text strong>تمرین با وزن/مقاومت است؟
                        <Checkbox 
                            checked={countsByWeight} 
                            onChange={(e) => setCountsByWeight(e.target.checked)}
                        /></Text>                        
                    </div>
                    <div>
                        <Text>یادداشت</Text>
                        <Input 
                            type='text'
                            placeholder="type something... "
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />                        
                    </div>

                    <Button 
                        type={'default'} 
                        onClick={handleSubmit}
                        danger={(!exerciseName) || (!category)} 
                        size="large"
                        style={{ width: '100%' }}
                    >
                        افزودن تمرین
                    </Button>
                </Space.Compact>
            </Space>
        </Modal>
    )
}