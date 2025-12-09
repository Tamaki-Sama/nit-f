import { useState, useMemo } from 'react';
import { Select, Card, Space, Typography, Row, Col } from 'antd';
import Graph from './Graph'; 
import { getPerformanceDataForGraph } from '../../utils/calculations';
const { Text } = Typography;

export default function WorkoutPerformanceDetails({ LogData, exerciseName, METRICS }) {
    const initialMetric = METRICS[0].value; 
    const [selectedMetricKey, setSelectedMetricKey] = useState(initialMetric);
    const selectedMetric = METRICS.find(m => m.value === selectedMetricKey);
    
    const graphData = useMemo(() => {
        return getPerformanceDataForGraph(LogData, exerciseName, selectedMetricKey);
    }, [LogData, exerciseName, selectedMetricKey]);

    const unit = selectedMetricKey === '1rm' || selectedMetricKey === 'max_weight' ? 'kg' : 'kg*reps'; // واحد Y-Axis
    console.log(METRICS)
    return (
        <Card title={`پیشرفت تمرین: ${exerciseName}`} size="small" style={{ marginTop: 20 }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
                <Row>
                    <Col span={12}>
                        <Text strong>متریک پیشرفت</Text>
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
                            value={'در دست ساخت'}
                            options={{value: 'در دست ساخت', label: 'در دست ساخت'}}
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
            />
        </Card>
    );
}