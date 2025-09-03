
'use client';

import { Card, CardContent } from '@/ui/card';
import type { Partner } from '@root/src/shared/types/types';
import type { FC } from 'react';

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
