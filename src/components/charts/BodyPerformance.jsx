import { useState, useMemo } from 'react';
import { Select, Card, Space, Typography, Row, Col } from 'antd';
import Graph from './Graph'; 
import { TIME_PERIODS } from '../../utils/constants';
const { Text } = Typography;

export default function BodyPerformanceDetails({ BodyLogData, METRICS }) {
    const initialMetric = METRICS[0].value; 
    const [selectedMetricKey, setSelectedMetricKey] = useState(initialMetric);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(TIME_PERIODS[0].value);
    const selectedMetric = METRICS.find(m => m.value === selectedMetricKey);
    
    const graphData = useMemo(() => {
        return BodyLogData
            .filter(log => log.metr === selectedMetric.value) // <-- اصلاح شد
            .sort((a, b) => new Date(a.date) - new Date(b.date))
    }, [BodyLogData, selectedMetricKey]);

    let unit;
    if (selectedMetricKey === 'BodyWeight') unit = 'kg'
    if (selectedMetricKey === 'BodyFat') unit = '%'
    return (
        <Card title={selectedMetricKey ? `تغییرات مشخصه: ${selectedMetric.label}` : `انتخاب نشده`} size="small" style={{ marginTop: 20 }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
                <Row>
                    <Col span={12}>
                        <Text strong>متریک</Text>
                        <Select
                            style={{ width: 250 }}
                            value={selectedMetricKey}
                            onChange={setSelectedMetricKey}
                            options={METRICS}
                        />                    
                    </Col>
                    <Col span={12}>
                        <Text strong>دوره زمانی</Text>
                        <Select
                            style={{ width: 250 }}
                            value={selectedTimePeriod}
                            onChange={(e) => {setSelectedTimePeriod(e)}}
                            options={TIME_PERIODS}
                        />                    
                    </Col>
                </Row>
                

            </Space>
            <Graph
                data={graphData}
                dataKeyX="date"
                dataKeyY="value"
                name={selectedMetric?.label || 'عملکرد'}
                unit={unit}
                selectedTimePeriod={selectedTimePeriod}
            />
        </Card>
    );
}