
'use client';

import type { Partner } from '@root/src/shared/types/types';
import type { FC } from 'react';
import { WorkflowDesigner } from './workflow-designer';

interface FinancialsTabProps {
  partner: Partner;
}

export const FinancialsTab: FC<FinancialsTabProps> = ({ partner }) => {
  return (
    <WorkflowDesigner partner={partner} />
  );
};
