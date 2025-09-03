/**
 * @fileoverview 風險矩陣組件
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import type { Risk } from '../../types';

interface RiskMatrixProps {
    risks: Risk[];
}

export function RiskMatrix({ risks }: RiskMatrixProps) {
    // 創建風險矩陣數據
    const matrixData = Array.from({ length: 5 }, (_, impact) =>
        Array.from({ length: 5 }, (_, probability) => {
            const impactValue = (impact + 1) * 20;
            const probabilityValue = (probability + 1) * 20;
            const riskScore = (impactValue * probabilityValue) / 100;

            const risksInCell = (risks || []).filter(risk => {
                const riskImpact = Math.ceil(risk.impact / 20) - 1;
                const riskProbability = Math.ceil(risk.probability / 20) - 1;
                return riskImpact === impact && riskProbability === probability;
            });

            return {
                impact: impactValue,
                probability: probabilityValue,
                riskScore,
                risks: risksInCell,
                count: risksInCell.length
            };
        })
    );

    const getRiskLevel = (score: number) => {
        if (score >= 80) return { level: '極高', color: 'bg-red-500', textColor: 'text-red-600' };
        if (score >= 60) return { level: '高', color: 'bg-orange-500', textColor: 'text-orange-600' };
        if (score >= 40) return { level: '中', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
        return { level: '低', color: 'bg-green-500', textColor: 'text-green-600' };
    };

    const getCellColor = (score: number) => {
        if (score >= 80) return 'bg-red-50 border-red-200';
        if (score >= 60) return 'bg-orange-50 border-orange-200';
        if (score >= 40) return 'bg-yellow-50 border-yellow-200';
        return 'bg-green-50 border-green-200';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    風險矩陣
                </CardTitle>
                <CardDescription>
                    根據可能性和影響程度評估風險等級
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* 圖例 */}
                    <div className="flex flex-wrap gap-2">
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            極高風險 (80-100)
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            高風險 (60-79)
                        </Badge>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            中風險 (40-59)
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            低風險 (0-39)
                        </Badge>
                    </div>

                    {/* 風險矩陣表格 */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                                        可能性 \ 影響程度
                                    </th>
                                    {[20, 40, 60, 80, 100].map(impact => (
                                        <th key={impact} className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                                            {impact}%
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrixData.map((row, probabilityIndex) => (
                                    <tr key={probabilityIndex}>
                                        <td className="border border-gray-300 p-2 text-sm font-medium bg-gray-50">
                                            {((probabilityIndex + 1) * 20)}%
                                        </td>
                                        {row.map((cell, impactIndex) => {
                                            const riskLevel = getRiskLevel(cell.riskScore);
                                            return (
                                                <td
                                                    key={impactIndex}
                                                    className={`border border-gray-300 p-2 text-center min-w-[80px] ${getCellColor(cell.riskScore)}`}
                                                >
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="cursor-pointer">
                                                                    <div className={`text-xs font-medium ${riskLevel.textColor}`}>
                                                                        {riskLevel.level}
                                                                    </div>
                                                                    <div className="text-xs text-gray-600">
                                                                        {cell.riskScore}
                                                                    </div>
                                                                    {cell.count > 0 && (
                                                                        <Badge variant="secondary" className="text-xs mt-1">
                                                                            {cell.count}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="space-y-1">
                                                                    <div className="font-medium">
                                                                        可能性: {cell.probability}% | 影響: {cell.impact}%
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        風險分數: {cell.riskScore}
                                                                    </div>
                                                                    {cell.risks.length > 0 && (
                                                                        <div className="text-sm">
                                                                            <div className="font-medium">風險項目:</div>
                                                                            {cell.risks.map(risk => (
                                                                                <div key={risk.id} className="text-xs">
                                                                                    • {risk.title}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 統計信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {(risks || []).filter(r => r.riskScore >= 80).length}
                            </div>
                            <div className="text-sm text-muted-foreground">極高風險</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {(risks || []).filter(r => r.riskScore >= 60 && r.riskScore < 80).length}
                            </div>
                            <div className="text-sm text-muted-foreground">高風險</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {(risks || []).filter(r => r.riskScore >= 40 && r.riskScore < 60).length}
                            </div>
                            <div className="text-sm text-muted-foreground">中風險</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {(risks || []).filter(r => r.riskScore < 40).length}
                            </div>
                            <div className="text-sm text-muted-foreground">低風險</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
