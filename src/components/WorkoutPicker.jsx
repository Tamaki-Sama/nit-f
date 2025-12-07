// components/WorkoutPicker.jsx
import { Delete, Confirm, Cancel } from './Icons';
import { useMemo, useState } from 'react';
import '../App.css'; 
import { Add } from './Icons';
import { Modal, Input, Button, List, Form, Select, Typography, Divider, Space, Checkbox } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const CheckIcon = () => (
    <svg className="icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


export default function WorkoutPicker({ onSelect, onClose, ExercisePrelist, setExercisePrelist, setCategoriesofExercisePrelist, CategoriesofExercisePrelist, pushNewWorkout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseCategory, setNewExerciseCategory] = useState(CategoriesofExercisePrelist[0]?.name || '');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isWorkoutAdderOpen, setisWorkoutAdderOpen] = useState(false)
    // 💡 تابع Selection حالا آبجکت کامل تمرین را پاس می‌دهد
    const handleSelection = (exercise) => {
        onSelect(exercise); 
        onClose(); // بستن پس از انتخاب
    };
    
    // فیلتر کردن لیست بر اساس جستجوی کاربر
    const filteredList = useMemo( () => 
        ExercisePrelist.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [ExercisePrelist, searchTerm])

    const handleDeleteWorkout = (exerciseToDelete) => {
        const updatedList = ExercisePrelist.filter(ex => ex.id !== exerciseToDelete.id);
        setExercisePrelist(updatedList);
        localStorage.setItem('ExercisePrelist', JSON.stringify(updatedList));
    }

    const handleAddCategory = () => {
        if (!newCategoryName) {
            console.error("Category name is required.");
            return;
        }
        
        const maxId = CategoriesofExercisePrelist.reduce((max, cat) => cat.id > max ? cat.id : max, 0);
        const newCategory = {
            id: maxId + 1,
            name: newCategoryName,
            color: "#aaa" // رنگ پیش‌فرض
        };
        
        const updatedCategories = [...CategoriesofExercisePrelist, newCategory];
        setCategoriesofExercisePrelist(updatedCategories);
        localStorage.setItem('CategoriesofExercisePrelist', JSON.stringify(updatedCategories));
        
        setNewCategoryName('');
        setIsAddingCategory(false);
    };

    const handleCategoryDeleteButton = (categoryToDelete) => {
        // سختگیری: اخطار بدهید! با حذف دسته، تمرینات آن حذف نمی‌شوند اما دسته‌بندی آن‌ها خراب می‌شود.
        if (window.confirm(`آیا مطمئنید که می‌خواهید دسته "${categoryToDelete.name}" را حذف کنید؟ این عمل غیرقابل بازگشت است.`)) {
            const updatedCategories = CategoriesofExercisePrelist.filter(cat => cat.id !== categoryToDelete.id);
            setCategoriesofExercisePrelist(updatedCategories);
            const updatedExercises = ExercisePrelist.filter(ex => ex.category !== categoryToDelete.name);
            setExercisePrelist(updatedExercises)
            localStorage.setItem('CategoriesofExercisePrelist', JSON.stringify(updatedCategories));
            localStorage.setItem('CategoriesofExercisePrelist', JSON.stringify(updatedExercises));
        }
    }


    return (
        <Modal
            title={<Title level={3} style={{ margin: 0 }}>انتخاب تمرین</Title>}
            open={true}
            onCancel={onClose}
            footer={null}
            closable={true}
            destroyOnHidden={true}
            centered 
            style={{ margin: '0 auto' }} 
        >
            <div className="picker-tools" style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '16px' }}>
                <Button 
                    type={isWorkoutAdderOpen ? "primary" : "default"} 
                    icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{Add}</span>}
                    onClick={() => setisWorkoutAdderOpen(!isWorkoutAdderOpen)}
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    size="large"
                >
                    تمرین سفارشی
                </Button>
                <Button 
                    type={isAddingCategory ? "primary" : "default"} 
                    icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{Add}</span>}
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    size="large"
                >
                    دسته سفارشی
                </Button>
            </div>
                
            {isWorkoutAdderOpen && (<WorkoutAdder onClose={() => setisWorkoutAdderOpen(false)} CategoriesofExercisePrelist={CategoriesofExercisePrelist} pushNewWorkout={pushNewWorkout}/>)}


            {/* فرم افزودن دسته جدید */}
            {isAddingCategory && (
                <Form onFinish={handleAddCategory} layout="vertical" style={{ marginBottom: '16px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <Title level={5}>افزودن دسته جدید</Title>
                    <Form.Item label="نام دسته" required>
                        <Input 
                            placeholder="مثل: Calves" 
                            value={newCategoryName} 
                            onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button onClick={() => setIsAddingCategory(false)} style={{ marginRight: '8px' }}>
                            {Cancel}
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {Confirm}
                        </Button>
                    </Form.Item>
                </Form>
            )}
            <Search
                placeholder="جستجوی تمرین..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
                size="large"
            />
                <div className="picker-content" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {/*<Alert
                    title='فعلا تمرینات را حذف نکنید'
                    description='در صورتی که قبلا استفاده شده باشد امکان خطا در محاسبات وجود دارد'
                    />*/}
                    {searchTerm ? (
                        filteredList.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredList}
                                renderItem={exercise => (
                                    <List.Item 
                                        actions={[
                                            // 💡 دکمه حذف
                                            <Button type="text" danger icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{Delete}</span>} onClick={(e) => {e.stopPropagation(); handleDeleteWorkout(exercise);}} key="delete"/>,
                                            // 💡 دکمه انتخاب
                                            <Button type="text" icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{CheckIcon()}</span>} onClick={(e) => {e.stopPropagation(); handleSelection(exercise);}} key="select"/>
                                        ]}
                                        onClick={() => handleSelection(exercise)} // انتخاب با کلیک روی آیتم
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <List.Item.Meta title={exercise.name} />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">تمرینی یافت نشد.</Text>
                        )
                    ) : (
                        // حالت نمایش بر اساس دسته
                        CategoriesofExercisePrelist.map(Category => (
                            <div key={Category.id}>
                                <Divider titlePlacement="left" style={{ margin: '8px 0' }}>
                                    <Title level={4} style={{ display: 'inline', margin: 0 }}>
                                        {Category.name}
                                    </Title>
                                    {/* دکمه حذف دسته */}
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{Delete}</span>}
                                        onClick={() => handleCategoryDeleteButton(Category)} 
                                        style={{ marginLeft: '8px' }}
                                    />
                                </Divider>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={ExercisePrelist.filter(exc => exc.category === Category.name || exc.secondarycategory === Category.name)}
                                    renderItem={exercise => (
                                        <List.Item
                                            actions={[
                                                <Button type="text" danger icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{Delete}</span>} onClick={(e) => {e.stopPropagation(); handleDeleteWorkout(exercise);}} key="delete"/>,
                                                <Button type="text" icon={<span style={{ display: 'inline-flex', alignItems: 'center' }}>{CheckIcon()}</span>} onClick={(e) => {e.stopPropagation(); handleSelection(exercise);}} key="select"/>
                                            ]}
                                            onClick={() => handleSelection(exercise)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <List.Item.Meta title={exercise.name} />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        ))
                    )}
                </div>
        </Modal>
    );
}
// --- Placeholder Components ---
function WorkoutAdder({onClose, pushNewWorkout, CategoriesofExercisePrelist}) {
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState(CategoriesofExercisePrelist[0].name || '');
    const [countsByWeight, setCountsByWeight] = useState(true); 
    const [unitType, setUnitType] = useState(''); 
    const [notes, setNotes] = useState('')
    
    // 💡 تابع مدیریت ارسال فرم
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        // 🛑 اخطار سختگیرانه: بررسی حداقل اعتبار سنجی
        if (!exerciseName.trim() || !category.trim()) {
            alert('نام تمرین و دسته بندی نمی‌توانند خالی باشند!')
            console.error('نام تمرین و دسته بندی نمی‌توانند خالی باشند!');
            return;
        }

        // 💡 ساخت آبجکت داده‌ها
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