import { useState, useMemo } from 'react';
import { Select, Card, Space, Typography } from 'antd';
import Graph from './Graph'; 
import { getPerformanceDataForGraph } from './PerformanceCalculations';
const { Text } = Typography;

export default function WorkoutPerformanceDetails({ LogData, exerciseName, METRICS }) {
    const initialMetric = METRICS[0].value; 
    const [selectedMetricKey, setSelectedMetricKey] = useState(initialMetric);
    const selectedMetric = METRICS.find(m => m.value === selectedMetricKey);
    
    const graphData = useMemo(() => {
        return getPerformanceDataForGraph(LogData, exerciseName, selectedMetricKey);
    }, [LogData, exerciseName, selectedMetricKey]);

    const unit = selectedMetricKey === '1rm' || selectedMetricKey === 'max_weight' ? 'kg' : 'kg*reps'; // واحد Y-Axis

    return (
        <Card title={`پیشرفت تمرین: ${exerciseName}`} size="small" style={{ marginTop: 20 }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
                <Text strong>متریک پیشرفت</Text>
                <Select
                    style={{ width: 250 }}
                    value={selectedMetricKey}
                    onChange={setSelectedMetricKey}
                    options={METRICS}
                />
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
// تابع محاسبه رگرسیون خطی ساده
const calculateTrendLine = (data, dataKeyX, dataKeyY) => {
    if (!data || data.length < 2) {
        return { trendData: [], slope: 0 };
    }

    // ۱. تبدیل تاریخ به مقادیر عددی (x-values)
    // برای این منظور، از اندیس آرایه به عنوان x استفاده می‌کنیم.
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    const points = data.map((item, index) => {
        // x: اندیس (0, 1, 2, ...)
        // y: مقدار اصلی (مثلاً 78.5)
        const x = index; 
        const y = item[dataKeyY];

        sumX += x;
        sumY += y;
        sumXY += (x * y);
        sumX2 += (x * x);

        return { x, y, date: item[dataKeyX] };
    });

    // ۲. محاسبه شیب (m) و عرض از مبدأ (b)
    const denominator = n * sumX2 - sumX * sumX;
    
    // اگر مخرج صفر باشد (همه نقاط یکسان باشند)، شیب صفر است.
    const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // ۳. تولید نقاط ابتدایی و انتهایی خط روند
    const startPoint = points[0];
    const endPoint = points[n - 1];

    // محاسبه مقادیر y برای x شروع (0) و x پایان (n-1)
    const yStart = slope * 0 + intercept;
    const yEnd = slope * (n - 1) + intercept;
    
    // ساخت آرایه داده خط روند
    const trendData = [
        { [dataKeyX]: startPoint.date, trendY: yStart },
        { [dataKeyX]: endPoint.date, trendY: yEnd }
    ];
    
    return { trendData, slope, intercept };
};