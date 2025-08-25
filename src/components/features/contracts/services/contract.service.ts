/**
 * @fileoverview 合約 CRUD 操作服務
 */

import { addDoc, updateDoc, deleteDoc, doc, collection, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import type { Contract } from '../types';

export const contractService = {
  createContract: async (data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>): Promise<string> => {
    try {
      const newContractData = {
        ...data,
        startDate: Timestamp.fromDate(data.startDate),
        endDate: Timestamp.fromDate(data.endDate),
        payments: [],
        changeOrders: [],
        versions: [{
          version: 1,
          date: Timestamp.now(),
          changeSummary: "初始版本"
        }]
      };

      const docRef = await addDoc(collection(firestore, 'contracts'), newContractData);
      return docRef.id;
    } catch (error) {
      console.error("創建合約時發生錯誤：", error);
      throw new Error("創建合約失敗");
    }
  },

  updateContract: async (id: string, data: Partial<Omit<Contract, 'id'>>): Promise<void> => {
    try {
      const docRef = doc(firestore, 'contracts', id);
      const updateData: any = { ...data };
      
      if (data.startDate) {
        updateData.startDate = Timestamp.fromDate(data.startDate);
      }
      if (data.endDate) {
        updateData.endDate = Timestamp.fromDate(data.endDate);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("更新合約時發生錯誤：", error);
      throw new Error("更新合約失敗");
    }
  },

  deleteContract: async (id: string): Promise<void> => {
    try {
      const docRef = doc(firestore, 'contracts', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("刪除合約時發生錯誤：", error);
      throw new Error("刪除合約失敗");
    }
  },
};
