// components/WorkoutPicker.jsx
import { CheckIcon,  } from '../common/Icons';
import { useMemo, useState } from 'react';
import '../../styles/Log.css'; 
import { Modal, Input, Divider, Button, List, Typography } from 'antd';

const { Search } = Input;
const { Title, Text } = Typography;
export default function WorkoutPickerReadOnly({ onSelect, onClose, ExercisePrelist, CategoriesOfExercisePrelist }) {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSelection = (exercise) => {
        onSelect(exercise); 
        onClose();
    };
    const filteredList = useMemo( () => 
        ExercisePrelist.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [ExercisePrelist, searchTerm])

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
            <Search
                placeholder="جستجوی تمرین..."
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
                size="large"
            />
                <div className="picker-content" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {searchTerm ? (
                        filteredList.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredList}
                                renderItem={exercise => (
                                    <List.Item 
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
                        CategoriesOfExercisePrelist.map(Category => (
                            <div key={Category.id}>
                                <Divider titlePlacement="left" style={{ margin: '8px 0' }}>
                                    <Title level={4} style={{ display: 'inline', margin: 0 }}>
                                        {Category.name}
                                    </Title>
                                </Divider>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={ExercisePrelist.filter(exc => exc.category === Category.name || exc.secondarycategory === Category.name)}
                                    renderItem={exercise => (
                                        <List.Item
                                            actions={[
                                                <Button type="text" icon={<span style={{ display: 'inline-flex', alignItems: 'center' ,color: 'green'}}><CheckIcon  /></span>} onClick={(e) => {e.stopPropagation(); handleSelection(exercise);}} key="select"/>
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