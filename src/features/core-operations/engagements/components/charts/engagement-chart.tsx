/**
 * @fileoverview 專案概覽圖表組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EngagementSummary } from '../../types';

interface EngagementChartProps {
    data: EngagementSummary[];
    title?: string;
    description?: string;
}

export function EngagementChart({
    data,
    title = "專案概覽",
    description = "專案狀態分布圖"
}: EngagementChartProps) {
    // 簡潔的數據處理
    const chartData = data.reduce((acc, engagement) => {
        const status = engagement.status;
        const existing = acc.find(item => item.status === status);

        if (existing) {
            existing.count += 1;
            existing.value += engagement.totalValue;
        } else {
            acc.push({
                status,
                count: 1,
                value: engagement.totalValue
            });
        }

        return acc;
    }, [] as Array<{ status: string; count: number; value: number }>);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => [
                                name === 'count' ? `${value} 個專案` : `NT$ ${value?.toLocaleString()}`,
                                name === 'count' ? '專案數量' : '總價值'
                            ]}
                        />
                        <Bar dataKey="count" fill="#8884d8" name="count" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
