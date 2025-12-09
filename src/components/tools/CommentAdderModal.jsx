import { Modal, Space, Button, Typography, Input, Form } from 'antd'
const {Title} = Typography
import {useLastId} from '../../utils/hooks'

export default function CommentAdder({onClose,Comments, setComments, date}) {
    const [form] = Form.useForm()
    const nextId = useLastId(Comments)
    const onFinish = (values) => {
        setComments(prev => [...prev, {id: nextId.current, date: date, text: values.text}]);
        onClose();
    }
    return (
        <Modal
        open={true}
        footer={null}
        title={<Title level={3}>افزودن یادداشت</Title>}
        onCancel={onClose}
        >
            <Space orientation="vertical">
                <Form
                form={form}
                style={{display: 'block',width: '100%'}}
                orientation="vertical"
                onFinish={onFinish}
                >
                    <Form.Item name='text'>
                        <Input.TextArea 
                            rows={4}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>اضافه کن</Button>
                    </Form.Item>
                    
                </Form>
            </Space>
        </Modal>
    )
}