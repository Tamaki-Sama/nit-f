import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
import { formatJalaaliDateForGraph } from '../../utils/formatters'; 
const { Text } = Typography;

export default function Graph({ data, dataKeyX, dataKeyY, name, unit, selectedTimePeriod }) {
    
    if (!data || data.length === 0) {
        return (
            <Card style={{ textAlign: 'center', marginTop: 20 }}>
                <Text type="secondary">داده‌ای برای نمایش {name} وجود ندارد. اطلاعات جدید اضافه کنید یا گزینه انتخاب شده را تصحیح کنید.</Text>
            </Card>
        );
    }
    const yAxisFormatter = (value) => `${value} ${unit || ''}`;
    const xAxisFormatter = (dateString) => {
        if (!selectedTimePeriod || selectedTimePeriod === 'day') {
            return dateString;
        }
        return formatJalaaliDateForGraph(dateString, selectedTimePeriod);
    };
    return (
            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" aspect={16 / 9}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        
                        <XAxis 
                            dataKey={dataKeyX} 
                            interval="preserveStartEnd"
                            tick={{ fill: 'var(--border-color)', fontSize: 8, fontWeight: 'light' }}
                            tickFormatter={xAxisFormatter}
                        />
                        <YAxis 
                            tickFormatter={yAxisFormatter} 
                            stroke="var(--border-color)"
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            formatter={(value) => [Math.round(value)]} 
                            labelFormatter={(label) => label}
                            labelStyle={{display: 'inline',width: 'fit-content', height: 'fit-content', color: '#262626'}}
                        />
                        <Line 
                            type="monotone" // نوع خط (برای نرمی)
                            dataKey={dataKeyY} 
                            name={name}
                            stroke="#1890FF" // رنگ آبی Ant Design
                            activeDot={{ r: 8 }} // نقطه فعال روی خط
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
    );
}