/**
 * @fileoverview Firebase 合約服務
 */

import { adminDb as firestore } from '@/db/firebase-admin';
import type { Contract } from '@/contracts/types';
import { Timestamp } from 'firebase-admin/firestore';
import type { DocumentData } from 'firebase/firestore';

export class FirebaseContractService {
  private readonly collectionName = 'contracts';

  async createContract(data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>): Promise<string> {
    try {
      const newContractData = {
        ...data,
        startDate: Timestamp.fromDate(data.startDate as Date),
        endDate: Timestamp.fromDate(data.endDate as Date),
        payments: [],
        changeOrders: [],
        versions: [{
          version: 1,
          date: Timestamp.now(),
          changeSummary: "初始版本"
        }]
      };

      const docRef = await firestore.collection(this.collectionName).add(newContractData as any);
      return docRef.id as string;
    } catch (error) {
      console.error("創建合約時發生錯誤：", error);
      throw new Error("創建合約失敗");
    }
  }

  async getContractById(id: string): Promise<Contract | null> {
    try {
      const docRef = firestore.collection(this.collectionName).doc(id);
      const docSnap = await docRef.get();
      
      if (docSnap.exists) {
        const data = docSnap.data() as any;
        return {
          ...data,
          id: docSnap.id,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          payments: data.payments?.map((p: any) => ({
            ...p,
            requestDate: p.requestDate?.toDate(),
            paidDate: p.paidDate?.toDate(),
          })) || [],
          changeOrders: data.changeOrders?.map((co: any) => ({
            ...co,
            date: co.date?.toDate(),
          })) || [],
          versions: data.versions?.map((v: any) => ({
            ...v,
            date: v.date?.toDate(),
          })) || [],
        } as Contract;
      }
      
      return null;
    } catch (error) {
      console.error("獲取合約時發生錯誤：", error);
      throw new Error("獲取合約失敗");
    }
  }

  async getAllContracts(): Promise<Contract[]> {
    try {
      const querySnapshot = await firestore
        .collection(this.collectionName)
        .orderBy('startDate', 'desc')
        .get();
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          ...data,
          id: doc.id,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          payments: data.payments?.map((p: any) => ({
            ...p,
            requestDate: p.requestDate?.toDate(),
            paidDate: p.paidDate?.toDate(),
          })) || [],
          changeOrders: data.changeOrders?.map((co: any) => ({
            ...co,
            date: co.date?.toDate(),
          })) || [],
          versions: data.versions?.map((v: any) => ({
            ...v,
            date: v.date?.toDate(),
          })) || [],
        } as Contract;
      });
    } catch (error) {
      console.error("獲取所有合約時發生錯誤：", error);
      throw new Error("獲取所有合約失敗");
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
      console.error("更新合約時發生錯誤：", error);
      throw new Error("更新合約失敗");
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      const docRef = firestore.collection(this.collectionName).doc(id);
      await docRef.delete();
    } catch (error) {
      console.error("刪除合約時發生錯誤：", error);
      throw new Error("刪除合約失敗");
    }
  }
}
