import { Modal, Space, Button, Typography, Form, Select } from 'antd'
const { Title } = Typography
import { useModal } from '../../utils/hooks'
import {UpdateModal} from '../common/CommonComps.jsx'
export default function Settings({onClose, calendarType, setCalendarType}) {
    const [isUpdateDetailsOpen, openUpdateDetails, closeUpdateDetails] = useModal()
    return (
        <Modal
        open={true}
        onCancel={onClose}
        footer={null}
        title={<Title level={3}>تنظیمات</Title>}
        >
            <Space orientation="vertical">
                <Space><Button block type="default" onClick={openUpdateDetails}>نمایش کل تاریخچه آپدیت</Button></Space>
                <Space>
                    <Form.Item> 
                        <label htmlFor="">نوع تقویم</label> <Select value={calendarType} 
                        options={[{ value: 'default' , label: 'شمسی (پیشفرض)' }, { value: 'geg' , label: 'میلادی' }]}
                        onChange={(e) => setCalendarType(e)}
                        />
                    </Form.Item>
                </Space>
            </Space>
            {isUpdateDetailsOpen && <UpdateModal lastViewedLogId={1} onClose={closeUpdateDetails} showAllUpdates={true} />}
        </Modal>
    )
}
