import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Typography } from 'antd';
const { Text } = Typography;
/**
 * کامپوننت نمایش گراف لاگ بدن
 * @param {Array<Object>} data - آرایه‌ای از آبجکت‌ها: [{ id: 1, value: 78.5 }, ...]
 * @param {string} dataKeyX - کلید مورد استفاده برای محور افقی (X): معمولاً 'id' یا 'date'
 * @param {string} dataKeyY - کلید مورد استفاده برای محور عمودی (Y): معمولاً 'value'
 * @param {string} name - نام سری داده (مثلاً 'وزن' یا 'چربی')
 * @param {string} unit - واحد اندازه‌گیری (مثلاً 'kg' یا '%')
 */
export default function Graph({ data, dataKeyX, dataKeyY, name, unit }) {
    
    if (!data || data.length === 0) {
        return (
            <Card style={{ textAlign: 'center', marginTop: 20 }}>
                <Text type="secondary">داده‌ای برای نمایش {name} وجود ندارد. لاگ‌های جدید اضافه کنید.</Text>
            </Card>
        );
    }
    const yAxisFormatter = (value) => `${value} ${unit || ''}`;
    return (
            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" aspect={16 / 9}>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        {/* شبکه‌بندی پس‌زمینه */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        
                        {/* محور X (افقی): آیدی یا تاریخ */}
                        {/* ما از 'id' به عنوان کلید استفاده می‌کنیم، اما می‌توانیم از یک Label سفارشی استفاده کنیم. */}
                        <XAxis 
                            dataKey={dataKeyX} 
                            interval="preserveStartEnd" // حفظ شروع و پایان
                            tick={{ fill: '#ffffffff', fontSize: 8, fontWeight: 'light' }}
                        />
                        <YAxis 
                            tickFormatter={yAxisFormatter} 
                            stroke="rgba(255, 255, 255, 0.85)"
                            
                            // ✅ تنظیمات برای استفاده بهینه از فضا
                            axisLine={false}
                            tickLine={false}
                        />
                        
                        <Tooltip 
                            formatter={(value) => [Math.round(value)]} 
                            labelFormatter={(label) => label}
                            labelStyle={{display: 'inline',width: 'fit-content', height: 'fit-content'}}
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