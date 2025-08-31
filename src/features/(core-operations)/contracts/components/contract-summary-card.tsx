/**
 * @fileoverview 合約摘要卡片組件
 */
'use client';

import type { Contract } from '@/features/(core-operations)/contracts/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

interface ContractSummaryCardProps {
  contract: Contract;
}

export function ContractSummaryCard({ contract }: ContractSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{contract.name}</CardTitle>
        <CardDescription>{contract.client}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>此處顯示合約摘要資訊。</p>
      </CardContent>
    </Card>
  );
}
