import { useState } from 'react'
import Calendar from '../pickers/Calendar'
import { Delete } from '../common/Icons'
import { Modal, Space, Typography, Select, Button, List, Tooltip } from 'antd'
const {Title, Text} = Typography
export default function Cheater({onClose, lastChosenDate, LogData, effectLogData, nextWorkoutId, notifCall}) {
    const [method, setMethod] = useState('ThisToAnother')
    const [cheatDate, setCheatDate] = useState(lastChosenDate)
    const [newLogsList, setNewLogsList] = useState(LogData.filter(ex => ex.date === lastChosenDate))
    function handleDateSelection(result) {
        setCheatDate(result)
    }
    function generate(e) {
        e.preventDefault()
        if (method === "ThisToAnother"){
            const selectedLogsList = LogData.filter(ex => ex.date === lastChosenDate)
            setNewLogsList(selectedLogsList.map(ex => ({...ex, date : cheatDate})))
        }
        else {
            const selectedLogsList = LogData.filter(ex => ex.date === cheatDate)
            setNewLogsList(selectedLogsList.map(ex => ({...ex, date : lastChosenDate})))
        }
    }
    function finish(e) {
        e.preventDefault()
        try {
            newLogsList.map(ex => {

                effectLogData({
                    type: "Add",
                    log_id: nextWorkoutId.current++,
                    log_name: ex.name,
                    log_sets: ex.sets,
                    log_editing: ex.editing,
                    log_date: ex.date,
                    log_haveWeight: ex.countsByWeight,
                    log_specialRepFlag: ex.specialRepFlag
                })
            })
            onClose();
            notifCall.success({title: 'عملیات موفق', description: `تمرینات به تاریخ ${newLogsList[0].date} اضافه شدند`})
        } catch(error) {
            notifCall.error({title: 'خطا', description: error})
        }

    }
    return(
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>انتقال/کپی تمرینات (Cheater)</Title>}
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            width={600}
        >
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}> 
                    <Space 
                        orientation="vertical" 
                        size="middle" 
                        style={{ width: '100%' }} 
                    >
                        <div> 
                            <Text strong>نوع کپی</Text>
                            <Select
                                value={method}
                                onChange={setMethod}
                                style={{ width: '100%', marginTop: '4px' }}
                                size="large"
                            >
                                <Option value="ThisToAnother">
                                    کپی از امروز به تاریخ جدید
                                </Option>
                                <Option value="AnotherToThis">
                                    کپی از تاریخ جدید به امروز
                                </Option>
                            </Select>
                        </div>
                        <div>
                            <Text strong style={{display: 'block'}}>تاریخ ثانویه</Text>
                            <Calendar 
                                onSelect={handleDateSelection}
                                selectedDateOfParent={String(cheatDate)}
                            />
                        </div>
                        <Button onClick={generate} type="primary" size="large" block>
                            آپدیت (نمایش)
                        </Button>
                    </Space>
                </div>
                <Title level={5} style={{ margin: '8px 0 0' }}>
                    پیش‌نمایش تمرینات ({newLogsList.length})
                </Title>

                {newLogsList.length === 0 ? (
                    <Text type="secondary" style={{ display: 'block', padding: '10px', textAlign: 'center' }}>
                        در این روز داده‌ای وجود ندارد یا باید دکمه آپدیت را بزنید.
                    </Text>
                ) : (
                    <List
                        itemLayout="vertical"
                        dataSource={newLogsList}
                        style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                        renderItem={w => (
                            <List.Item
                                key={w.id}
                                actions={[
                                    // دکمه حذف ورک‌آوت از لیست پیش‌نمایش
                                    <Button 
                                        type="text" 
                                        danger 
                                        icon={Delete} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setNewLogsList(newLogsList.filter(savedW => savedW.id !== w.id));
                                        }} 
                                        key="delete-workout"
                                    >
                                        حذف
                                    </Button>
                                ]}
                                style={{ padding: '12px 16px', margin: '10px', background: 'black' }}
                            >
                                <List.Item.Meta
                                    title={<Title level={3} style={{ margin: 0, color: 'var(--border-color)' }}>{w.name}</Title>}
                                />
                                <List
                                    size="small"
                                    dataSource={w.sets.map((s, index) => ({...s, setIndex: index}))} 
                                    renderItem={s => (
                                        <List.Item
                                            key={s.id}
                                            style={{ padding: '4px 0', borderBottom: 'none', color: 'var(--border-color)' }}
                                            actions={[
                                                <Tooltip title="حذف ست">
                                                    <Button 
                                                        type="text" 
                                                        size="small"
                                                        danger 
                                                        icon={Delete} 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setNewLogsList(newLogsList.map(targetW => {
                                                                if (targetW.id === w.id) {
                                                                    return({...targetW, sets: targetW.sets.filter(set => set.id !== s.id)})
                                                                }
                                                                return(targetW)
                                                            }));
                                                        }}
                                                        key="delete-set"
                                                    />
                                                </Tooltip>
                                            ]}
                                        >
                                            <Space size="large">
                                                <Text type="secondary" style={{color: 'white'}}>{s.setIndex + 1}.</Text>
                                                <Text style={{color: 'white'}}>
                                                    {w.countsByWeight && s.weight !== undefined ? 
                                                        <Text strong style={{color: 'white'}}>{s.weight} kg</Text> : 
                                                        <Text type="secondary" style={{color: 'white'}}>بدون وزن</Text>}
                                                </Text>
                                                <Text style={{color: 'white'}}>
                                                    <Text strong style={{color: 'white'}}>{s.reps}</Text> {w.specialRepFlag || 'reps'}
                                                </Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                )}
                <Button 
                    onClick={finish} 
                    type="primary" 
                    size="large" 
                    block
                    disabled={newLogsList.length === 0}
                    style={{ marginTop: '16px' }}
                >
                    کپی **{newLogsList.length}** تمرین به روز مقصد
                </Button>

            </Space>
        </Modal>
    )
} 