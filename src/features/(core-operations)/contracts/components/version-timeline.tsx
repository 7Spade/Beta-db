/**
 * @fileoverview 版本時間軸組件
 */
'use client';

import type { ContractVersion } from '@/features/(core-operations)/contracts/types';
import { toDate } from '@/lib/utils/date-utils';
import { formatDate } from '@/utils';

interface VersionTimelineProps {
  versions: ContractVersion[];
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  return (
    <div className="space-y-4">
      {versions.map((version, index) => (
        <div
          key={version.version}
          className="grid grid-cols-[auto_1fr] items-start gap-4"
        >
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {version.version}
            </div>
            {index < versions.length - 1 && (
              <div className="h-10 w-px bg-border" />
            )}
          </div>
          <div>
            <p className="font-semibold">{formatDate(toDate(version.date))}</p>
            <p className="text-sm text-muted-foreground">
              {version.changeSummary}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
