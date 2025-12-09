// components/WorkoutPicker.jsx
import { Delete, Confirm, Cancel, Add, CheckIcon,  } from '../common/Icons';
import WorkoutAdder from '../tools/WorkoutAdderModal';
import { useMemo, useState } from 'react';
import '../../styles/Log.css'; 
import { Modal, Input, Button, List, Form, Typography, Divider } from 'antd';

const { Search } = Input;
const { Title, Text } = Typography;
export default function WorkoutPicker({ onSelect, onClose, ExercisePrelist, setExercisePrelist, setCategoriesofExercisePrelist, CategoriesofExercisePrelist, pushNewWorkout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
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
                
            {isWorkoutAdderOpen && (<WorkoutAdder onClose={() => setisWorkoutAdderOpen(false)} ExercisePrelist={ExercisePrelist} CategoriesofExercisePrelist={CategoriesofExercisePrelist} pushNewWorkout={pushNewWorkout}/>)}


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