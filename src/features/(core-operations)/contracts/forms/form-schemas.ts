/**
 * @fileoverview 合約表單驗證 Schema
 */

import { CONTRACT_STATUSES } from '@/features/(core-operations)/contracts/constants';
import { z } from 'zod';

export const contractSchema = z
  .object({
    customId: z.string().optional(),
    name: z.string().min(3, '合約名稱至少需要 3 個字元。'),
    contractor: z.string().min(2, '承包商名稱至少需要 2 個字元。'),
    client: z.string().min(2, '客戶名稱至少需要 2 個字元。'),
    clientRepresentative: z.string().optional(),
    totalValue: z.coerce.number().min(1, '總價值至少需要為 1。'),
    scope: z.string().min(10, '工作範疇描述至少需要 10 個字元。'),
    status: z.enum([
      CONTRACT_STATUSES.ACTIVE,
      CONTRACT_STATUSES.COMPLETED,
      CONTRACT_STATUSES.PAUSED,
      CONTRACT_STATUSES.TERMINATED,
    ]),
    startDate: z.date({ required_error: '起始日期為必填項。' }),
    endDate: z.date({ required_error: '結束日期為必填項。' }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: '結束日期不能早於起始日期。',
    path: ['endDate'],
  });

export type ContractFormValues = z.infer<typeof contractSchema>;
