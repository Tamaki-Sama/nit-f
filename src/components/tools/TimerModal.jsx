import { Modal, Input, Statistic, Button, Typography, Checkbox } from 'antd'
const {Title} = Typography
export default function Timer({onClose, timer}) {
    
    function handleTimerInputChange(e) {
        const value = Number(e.target.value);
        if (value >= 0) {
            timer.setInputTime(value);
        }
    }
    return (
        <Modal 
            title="تایمر استراحت"
            open={true} 
            onCancel={onClose} 
            footer={null} 
            centered
            destroyOnHidden={true} 
        >
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px' }}>
                <Statistic
                    value={timer.formattedTime}
                    valueStyle={{ 
                        fontSize: '3.5em', 
                        fontWeight: 'bold', 
                        color: timer.isActive ? '#52c41a' : '#faad14' 
                    }}
                />
            </div>
            
            <form onSubmit={(e) => {e.preventDefault();timer.toggle()}} className="timer-form">
                <Input 
                    type="number" 
                    placeholder="زمان (ثانیه)" 
                    value={timer.inputTime} 
                    onChange={handleTimerInputChange} 
                    min="1"
                    required
                    size="large"
                    style={{ marginBottom: '16px', textAlign: 'center' }}
                />
                <div className="timer-controls" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button 
                        type={timer.isActive ? 'default' : 'primary'}
                        htmlType="submit" 
                        danger={timer.isActive} 
                        size="large"
                        style={{ width: '120px' }}
                    >
                        {timer.isActive ? 'توقف' : 'شروع'}
                    </Button>
                    
                    <Button 
                        type="default" 
                        onClick={() => {timer.reset()}}
                        size="large"
                        style={{ width: '120px' }}
                    >
                        ریست
                    </Button>
                </div>
            </form>
            <Title level={5}><Checkbox checked={timer.autoStart} onChange={() => {timer.setAutoStart(!timer.autoStart)}} /> شروع خودکار بعد از تیک خوردن</Title>
        </Modal>
    )
}