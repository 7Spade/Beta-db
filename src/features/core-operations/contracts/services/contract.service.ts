/**
 * @fileoverview 合約 CRUD 操作服務
 */

import type { Contract } from '@/features/core-operations/contracts/types';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

export const contractService = {
  createContract: async (
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions' | 'receipts'>
  ): Promise<string> => {
    try {
      const newContractData = {
        ...data,
        startDate: Timestamp.fromDate(data.startDate as Date),
        endDate: Timestamp.fromDate(data.endDate as Date),
        payments: [],
        changeOrders: [],
        versions: [
          {
            version: 1,
            date: Timestamp.now(),
            changeSummary: '初始版本',
          },
        ],
      };

      const docRef = await addDoc(
        collection(firestore, 'contracts'),
        newContractData
      );
      return docRef.id;
    } catch (error) {
      console.error('創建合約時發生錯誤：', error);
      throw new Error('創建合約失敗');
    }
  },

  updateContract: async (
    id: string,
    data: Partial<Omit<Contract, 'id'>>
  ): Promise<void> => {
    try {
      const docRef = doc(firestore, 'contracts', id);
      const updateData: Partial<Omit<Contract, 'id'>> = { ...data };

      if (data.startDate) {
        if (data.startDate instanceof Date) {
          updateData.startDate = Timestamp.fromDate(data.startDate);
        } else {
          updateData.startDate = data.startDate;
        }
      }
      if (data.endDate) {
        if (data.endDate instanceof Date) {
          updateData.endDate = Timestamp.fromDate(data.endDate);
        } else {
          updateData.endDate = data.endDate;
        }
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('更新合約時發生錯誤：', error);
      throw new Error('更新合約失敗');
    }
  },

  deleteContract: async (id: string): Promise<void> => {
    try {
      const docRef = doc(firestore, 'contracts', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('刪除合約時發生錯誤：', error);
      throw new Error('刪除合約失敗');
    }
  },
};
