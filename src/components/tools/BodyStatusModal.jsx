import { Modal, Space, Button, Typography, InputNumber, Form, Card, List, Row, Col, Select, Alert } from 'antd'
const {Title, Text } = Typography
import {useLastId} from '../../utils/hooks'
import BodyPerformanceDetails from '../charts/BodyPerformance'
import { message } from 'antd'
import { BODYLOG_METRICS } from '../../utils/constants'
export default function BodyStatus({onClose,BodyLogData, effectBodyLogData, lastDate}) {
    const [form] = Form.useForm()
    const nextId = useLastId(BodyLogData)
    const onFinish = (values) => {
        effectBodyLogData({
            type: "Add",
            id: nextId.current,
            date: lastDate,
            metr: values.metric,
            value: values.value
        });
        message.success('لاگ بدن با موفقیت ثبت شد')
    };
    const onDelete = (who) => {
        effectBodyLogData({
            type: "Delete",
            id: who.id
        })
        message.success('لاگ بدن با موفقیت حذف شد')
    }
    return (
        <Modal
        open={true}
        onCancel={onClose}
        footer={null}
        title={<Title level={4} style={{ margin: 0, direction: 'rtl' }}>لاگ بدن</Title>}
        centered
        width={600}
        >
            <Space orientation="vertical">
                <Form
                    form={form}
                    onFinish={onFinish}
                    initialValues={{ weight: 100, reps: 5 }}
                ><Alert title={`لاگ به تاریخ انتخاب شده اضافه می شود: ${lastDate}`} />
                    <Row gutter={10}>
                        <Col span={12}>
                            <Form.Item
                            name='metric'
                            label='متریک'
                            rules={[{ required:true, message: 'انتخاب نوع متریک الزامی است' }]}
                            >
                                <Select size="large" options={BODYLOG_METRICS} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="value" 
                                label="مقدار" 
                                rules={[{ required: true, message: 'ورود مقدار الزامی است.' }]}
                            >
                                <InputNumber 
                                    min={1} 
                                    step={0.1} 
                                    size="large" 
                                    style={{ width: '100%' }} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ marginTop: 20 }}>
                        <Button type="primary" htmlType="submit" size="large" block>
                            + ثبت گزارش جدید
                        </Button>
                    </Form.Item>
                </Form>
                <BodyPerformanceDetails 
                    BodyLogData={BodyLogData}
                    METRICS={BODYLOG_METRICS}
                />
                <Card 
                    title="تاریخچه لاگ بدن" 
                    style={{ marginTop: 20 }}
                    size="small" // برای ظاهری فشرده‌تر
                >

                    <List
                        style={{ 
                            maxHeight: '40vh', // به جای px از vh استفاده شد
                            overflowY: 'auto',
                            paddingRight: 10 // برای جبران نوار اسکرول
                        }}
                        dataSource={BodyLogData}
                        renderItem={(item) => {
                            const metricDetails = BODYLOG_METRICS.find(m => m.value === item.metr);
                            return (
                            <List.Item
                                actions={[
                                    // دکمه حذف لاگ (باید effectBodyLogData را فراخوانی کند)
                                    <Button 
                                        type="link" 
                                        danger 
                                        onClick={() => {
                                            onDelete(item)
                                        }}
                                    >
                                        حذف
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            <Text strong style={{ color: 'var(--primary-color)' }}>
                                                {item.value} {metricDetails ? metricDetails.label : 'نامشخص'}
                                            </Text>
                                            <Text type="secondary">
                                                در تاریخ {item.date}
                                            </Text>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}}
                    />

                </Card>
            </Space>
        </Modal>
    )
}