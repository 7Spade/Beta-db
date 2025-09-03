/**
 * @fileoverview 進度追蹤圖表組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EngagementSummary } from '../../types';

interface ProgressChartProps {
    data: EngagementSummary[];
    title?: string;
    description?: string;
}

export function ProgressChart({
    data,
    title = "進度追蹤",
    description = "專案進度趨勢圖"
}: ProgressChartProps) {
    // 簡潔的進度數據處理
    const chartData = data.map(engagement => ({
        name: engagement.name.length > 10 ? engagement.name.substring(0, 10) + '...' : engagement.name,
        progress: engagement.progress?.overallProgress || 0,
        taskProgress: engagement.progress?.taskProgress || 0,
        financialProgress: engagement.progress?.financialProgress || 0
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                            formatter={(value) => [`${value}%`, '進度']}
                        />
                        <Line
                            type="monotone"
                            dataKey="progress"
                            stroke="#8884d8"
                            strokeWidth={2}
                            name="總進度"
                        />
                        <Line
                            type="monotone"
                            dataKey="taskProgress"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            name="任務進度"
                        />
                        <Line
                            type="monotone"
                            dataKey="financialProgress"
                            stroke="#ffc658"
                            strokeWidth={2}
                            name="財務進度"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
