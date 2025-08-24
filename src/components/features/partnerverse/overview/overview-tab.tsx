
'use client';

import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { Partner } from '@/lib/types';

interface OverviewTabProps {
  partner: Partner;
}

export const OverviewTab: FC<OverviewTabProps> = ({ partner }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className='text-foreground'>{partner.overview}</p>
      </CardContent>
    </Card>
  );
};
