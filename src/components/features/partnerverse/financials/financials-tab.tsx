
'use client';

import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Partner } from '@/lib/types';

interface FinancialsTabProps {
  partner: Partner;
}

export const FinancialsTab: FC<FinancialsTabProps> = ({ partner }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>財務流程管理</CardTitle>
        <CardDescription>
          在此合作夥伴的應收與應付流程都在專門的工作流程頁面中進行管理。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
          <div>
            <p className="text-muted-foreground mb-4">
              您可以在工作流程頁面中為 {partner.name} 設定、視覺化並優化財務流程。
            </p>
            <Button asChild>
              <Link href="/partnerverse/workflows">
                前往工作流程
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
