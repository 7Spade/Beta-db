/**
 * @fileoverview Firebase 合約服務
 */

import { adminDb as firestore } from '@/db/firebase-admin';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { Timestamp } from '@firebase/firestore';

// 定义Firestore文档数据类型
interface FirestoreContractData {
  id?: string;
  customId?: string;
  name: string;
  contractor: string;
  client: string;
  clientRepresentative?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  totalValue: number;
  status: string;
  scope: string;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    requestDate: Timestamp;
    paidDate?: Timestamp;
    description?: string;
  }>;
  changeOrders: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    date: Timestamp;
    impact: {
      cost: number;
      scheduleDays: number;
    };
    approvedBy?: string;
    approvedDate?: Timestamp;
  }>;
  versions: Array<{
    version: number;
    date: Timestamp;
    changeSummary: string;
    changedBy?: string;
    approvalStatus?: string;
    approvalDate?: Timestamp;
    approvalBy?: string;
  }>;
}

export class FirebaseContractService {
  private readonly collectionName = 'contracts';

  async createContract(
    data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions' | 'receipts'>
  ): Promise<string> {
    try {
      const newContractData: FirestoreContractData = {
        ...data,
        startDate: data.startDate instanceof Date ? Timestamp.fromDate(data.startDate) : data.startDate,
        endDate: data.endDate instanceof Date ? Timestamp.fromDate(data.endDate) : data.endDate,
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

      const docRef = await firestore
        .collection(this.collectionName)
        .add(newContractData);
      return docRef.id as string;
    } catch (error) {
      console.error('創建合約時發生錯誤：', error);
      throw new Error('創建合約失敗');
    }
  }

  async getContractById(id: string): Promise<Contract | null> {
    try {
      const docRef = firestore.collection(this.collectionName).doc(id);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const data = docSnap.data() as FirestoreContractData;
        return {
          ...data,
          id: docSnap.id,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          payments:
            data.payments?.map((p) => ({
              ...p,
              requestDate: p.requestDate?.toDate(),
              paidDate: p.paidDate?.toDate(),
            })) || [],
          changeOrders:
            data.changeOrders?.map((co) => ({
              ...co,
              date: co.date?.toDate(),
            })) || [],
          versions:
            data.versions?.map((v) => ({
              ...v,
              date: v.date?.toDate(),
            })) || [],
        } as Contract;
      }

      return null;
    } catch (error) {
      console.error('獲取合約時發生錯誤：', error);
      throw new Error('獲取合約失敗');
    }
  }

  async getAllContracts(): Promise<Contract[]> {
    try {
      const querySnapshot = await firestore
        .collection(this.collectionName)
        .orderBy('startDate', 'desc')
        .get();
      return querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreContractData;
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          payments:
            data.payments?.map((p) => ({
              ...p,
              requestDate: p.requestDate?.toDate(),
              paidDate: p.paidDate?.toDate(),
            })) || [],
          changeOrders:
            data.changeOrders?.map((co) => ({
              ...co,
              date: co.date?.toDate(),
            })) || [],
          versions:
            data.versions?.map((v) => ({
              ...v,
              date: v.date?.toDate(),
            })) || [],
        } as Contract;
      });
    } catch (error) {
      console.error('獲取所有合約時發生錯誤：', error);
      throw new Error('獲取所有合約失敗');
    }
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<void> {
    try {
      const docRef = firestore.collection(this.collectionName).doc(id);
      const updateData: Partial<Contract> = { ...data };

      if (data.startDate) {
        // 确保startDate是Date类型
        if (data.startDate instanceof Date) {
          updateData.startDate = Timestamp.fromDate(data.startDate);
        } else {
          // 如果已经是Timestamp，直接使用
          updateData.startDate = data.startDate;
        }
      }
      if (data.endDate) {
        // 确保endDate是Date类型
        if (data.endDate instanceof Date) {
          updateData.endDate = Timestamp.fromDate(data.endDate);
        } else {
          // 如果已经是Timestamp，直接使用
          updateData.endDate = data.endDate;
        }
      }

      await docRef.update(updateData);
    } catch (error) {
      console.error('更新合約時發生錯誤：', error);
      throw new Error('更新合約失敗');
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      const docRef = firestore.collection(this.collectionName).doc(id);
      await docRef.delete();
    } catch (error) {
      console.error('刪除合約時發生錯誤：', error);
      throw new Error('刪除合約失敗');
    }
  }
}
