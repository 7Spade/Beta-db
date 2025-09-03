/**
 * @fileoverview 財務分析圖表組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { EngagementSummary } from '../../types';

interface FinancialChartProps {
    data: EngagementSummary[];
    title?: string;
    description?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function FinancialChart({
    data,
    title = "財務分析",
    description = "專案財務狀況分布"
}: FinancialChartProps) {
    // 簡潔的財務數據計算
    const totalValue = data.reduce((sum, engagement) => sum + engagement.totalValue, 0);
    const totalPaid = data.reduce((sum, engagement) => sum + engagement.paidAmount, 0);
    const totalPending = totalValue - totalPaid;

    const chartData = [
        { name: '已付款', value: totalPaid, color: '#00C49F' },
        { name: '待付款', value: totalPending, color: '#FFBB28' }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`NT$ ${Number(value).toLocaleString()}`, '金額']}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
