/**
 * @fileoverview 變更單項目組件
 */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { ChangeOrder } from '../types';

interface ChangeOrderItemProps {
  changeOrder: ChangeOrder;
}

export function ChangeOrderItem({ changeOrder }: ChangeOrderItemProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-semibold">{changeOrder.title}</p>
        <p className="text-sm text-muted-foreground">{changeOrder.description}</p>
      </CardContent>
    </Card>
  );
}
