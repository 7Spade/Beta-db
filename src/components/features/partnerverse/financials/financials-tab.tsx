
'use client';

import type { FC } from 'react';
import type { Partner } from '@/types/types';
import { WorkflowDesigner } from './workflow-designer';

interface FinancialsTabProps {
  partner: Partner;
}

export const FinancialsTab: FC<FinancialsTabProps> = ({ partner }) => {
  return (
    <WorkflowDesigner partner={partner} />
  );
};
