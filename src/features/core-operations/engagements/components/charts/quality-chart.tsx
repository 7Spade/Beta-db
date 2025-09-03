/**
 * @fileoverview 品質指標圖表組件
 */
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Legend, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { EngagementSummary } from '../../types';

interface QualityChartProps {
    data: EngagementSummary[];
    title?: string;
    description?: string;
}

export function QualityChart({
    data,
    title = "品質指標",
    description = "專案品質評分分布"
}: QualityChartProps) {
    // 簡潔的品質數據計算
    const qualityData = data.map(engagement => {
        const qualityScore = engagement.qualityChecks?.length
            ? engagement.qualityChecks.reduce((sum, check) => sum + (check.score || 0), 0) / engagement.qualityChecks.length
            : 0;

        return {
            name: engagement.name.length > 15 ? engagement.name.substring(0, 15) + '...' : engagement.name,
            score: Math.round(qualityScore),
            fill: qualityScore >= 80 ? '#00C49F' : qualityScore >= 60 ? '#FFBB28' : '#FF8042'
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={qualityData}>
                        <RadialBar dataKey="score" cornerRadius={10} fill="#8884d8" />
                        <Tooltip
                            formatter={(value) => [`${value} 分`, '品質評分']}
                        />
                        <Legend />
                    </RadialBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
