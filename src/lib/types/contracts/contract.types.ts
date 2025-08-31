/**
 * @fileoverview 合約核心類型 - 服務層
 * @description 此檔案為服務層使用的合約類型，可能包含與資料庫互動相關的擴展。
 */

import type { Contract as CoreContract } from '@/features/(core-operations)/contracts/types';
import type { Timestamp } from 'firebase/firestore';

export interface FirebaseContract
  extends Omit<CoreContract, 'startDate' | 'endDate'> {
  startDate: Timestamp;
  endDate: Timestamp;
}
