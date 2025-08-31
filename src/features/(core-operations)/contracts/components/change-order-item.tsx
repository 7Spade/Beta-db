/**
 * @fileoverview 變更單項目組件
 */
'use client';

import type { ChangeOrder } from '@/features/(core-operations)/contracts/types';
import { Card, CardContent } from '@/ui/card';

interface ChangeOrderItemProps {
  changeOrder: ChangeOrder;
}

export function ChangeOrderItem({ changeOrder }: ChangeOrderItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-semibold">{changeOrder.title}</p>
        <p className="text-sm text-muted-foreground">
          {changeOrder.description}
        </p>
      </CardContent>
    </Card>
  );
}
