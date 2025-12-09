import { useState, useEffect } from "react";
import { Add, Delete } from '../common/Icons'
import { Modal, Space, Button, Typography, Input, Select,  } from 'antd'
const {Text, Title} = Typography
import {getSavedValue} from '../../utils/reader'
import {RoutinesDefault} from '../../utils/defaults'
import Routine from '../routine/Routine'
import {useLastId} from '../../utils/hooks'

export default function RoutineUser({date, onClose, ExercisePrelist, CategoriesofExercisePrelist, setExercisePrelist, setCategoriesofExercisePrelist, importRoutine, LogData}) {
    const [selectedRoutineId, setSelectedRoutineId] = useState(1)
    const [newRoutineName, setNewRoutineName] = useState("")
    function handleInputChange(value) {
        setSelectedRoutineId(Number(value));
    }
    function handleNewInputChange(e) {
        setNewRoutineName(e.target.value);
    }
    const [Routines, setRoutines] = useState(getSavedValue("Routines", RoutinesDefault))
    const nextRoutineId = useLastId(Routines)
    useEffect(() => {
        localStorage.setItem('Routines', JSON.stringify(Routines));
    }, [Routines])
    function AddNewRoutine() {
        setRoutines(routs => [...routs, {id: nextRoutineId.current, name: newRoutineName, days: []}])
    }
    function deleteSelectedRoutine() {
        setRoutines(Routines.filter(r=> r.id !== selectedRoutineId))
        setSelectedRoutineId(nextRoutineId.current)
    }
    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>مدیریت و وارد کردن روتین‌ها</Title>}
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <Space orientation="vertical" size="middle" style={{ width: '100%', paddingTop: 16 }}>
                <Text strong>ایجاد روتین جدید</Text>
                <Space.Compact block orientation="vertical">
                    <Input 
                        value={newRoutineName} 
                        onChange={handleNewInputChange} 
                        type="text" 
                        placeholder="نام روتین جدید" 
                        size="large"
                        style={{ flex: 1 }}
                    />
                    <Button 
                        type="primary" 
                        icon={Add} 
                        onClick={(e) => { e.preventDefault(); AddNewRoutine(); }}
                        size="large"
                    >
                        روتین جدید
                    </Button>
                </Space.Compact>
                <Space.Compact block orientation="vertical">
                    <Text strong style={{ marginTop: '16px', display: 'block' }}>انتخاب روتین</Text>
                    <Select 
                        onChange={handleInputChange} 
                        value={selectedRoutineId}  
                        style={{ width: '100%', marginTop: '4px' }}
                        size="large"
                        placeholder="یک روتین را انتخاب کنید"
                    >
                        {Routines.length > 0 && 
                            Routines.map( routine => 
                                <Option value={routine.id} key={routine.id}>
                                    {routine.name}
                                </Option>
                            )
                        }
                    </Select>
                    <Button 
                        type="default" 
                        danger 
                        icon={Delete} 
                        onClick={(e) => { e.preventDefault(); deleteSelectedRoutine(); }}
                        size="large"
                        disabled={Routines.length <= 1}
                    >
                        حذف
                    </Button>
                </Space.Compact>

                {/* ۳. نمایش و مدیریت روتین انتخاب شده (کامپوننت Routine) */}
                <div style={{ width: '100%', marginTop: '16px' }}>
                    {Routines.map( foundRoutine =>
                        selectedRoutineId === foundRoutine.id &&
                        <Routine 
                            importRoutine={importRoutine} 
                            key={foundRoutine.id} 
                            Routines={Routines} 
                            setRoutines={setRoutines} 
                            myself={foundRoutine} 
                            setExercisePrelist={setExercisePrelist} 
                            setCategoriesofExercisePrelist={setCategoriesofExercisePrelist} 
                            ExercisePrelist={ExercisePrelist} 
                            CategoriesofExercisePrelist={CategoriesofExercisePrelist} 
                            LogData={LogData}
                            date={date}
                        />
                    )}
                </div>

            </Space>
        </Modal>
    )
}