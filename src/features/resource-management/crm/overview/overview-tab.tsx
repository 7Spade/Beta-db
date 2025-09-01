
'use client';

import type { FC } from 'react';
import { Card, CardContent } from '@/ui/card';
import type { Partner } from '@/lib/types/types';

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
