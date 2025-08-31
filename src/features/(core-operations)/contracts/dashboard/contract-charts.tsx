/**
 * @fileoverview 合約圖表
 */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

export function ContractCharts() {
  const chartData = [
    { month: '一月', desktop: 186 },
    { month: '二月', desktop: 305 },
    { month: '三月', desktop: 237 },
    { month: '四月', desktop: 73 },
    { month: '五月', desktop: 209 },
    { month: '六月', desktop: 214 },
  ];

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>合約價值圖表</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
