// updateModal, confirmation and blank states
import { Modal, Space, Button, Typography, List } from 'antd'
const { Title, Text } = Typography
import { UPDATE_LOGS } from '../../utils/constants'
import {getSavedValue} from '../../utils/reader'
export function UpdateModal({onClose, showAllUpdates}) {
    const LATEST_LOG_ID = getSavedValue('lastViewedUpdateLogId')
    return (
        <Modal
        title={<Title level={4}>{!showAllUpdates ?`📢 چه خبر؟ نسخه ${UPDATE_LOGS[LATEST_LOG_ID + 1].version} منتشر شد!` : 'تاریخچه کل تغییرات'}</Title>}
        open={true}
        onCancel={onClose}
        centered
        footer={[
            <Button key="confirm" type="primary" onClick={onClose}>
                متوجه شدم!
            </Button>
        ]}
        >
            <Space orientation="vertical" style={{ width: '100%' }}>
                {
                UPDATE_LOGS
                    .filter(log => showAllUpdates ? true : log.id > LATEST_LOG_ID)
                    .map(log => (
                        <div key={log.id} style={{ marginBottom: '16px', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
                            <Title level={5} style={{ margin: '0 0 8px 0', color: 'var(--primary-color)' }}>
                                {log.title} ({log.version})
                            </Title>
                            <List
                                size="small"
                                dataSource={log.features}
                                renderItem={(item) => <List.Item style={{ border: 'none', padding: '4px 0' }}>• {item}</List.Item>}
                            />
                            <Text type="secondary" style={{ fontSize: '0.8em', display: 'block', textAlign: 'left' }}>
                                تاریخ انتشار: {log.date}
                            </Text>
                        </div>
                    ))
                }
            </Space>
        </Modal>
    )
}