/**
 * @fileoverview Firebase 合約服務
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contract } from '@/components/features/contracts/types';

export class FirebaseContractService {
  private readonly collectionName = 'contracts';

  async createContract(data: Omit<Contract, 'id' | 'payments' | 'changeOrders' | 'versions'>): Promise<string> {
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

      const docRef = await addDoc(collection(db, this.collectionName), newContractData);
      return docRef.id;
    } catch (error) {
      console.error("創建合約時發生錯誤：", error);
      throw new Error("創建合約失敗");
    }
  }

  async getContractById(id: string): Promise<Contract | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
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
      const q = query(
        collection(db, this.collectionName),
        orderBy('startDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
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
      const docRef = doc(db, this.collectionName, id);
      const updateData = { ...data } as any;
      
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
  }

  async deleteContract(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("刪除合約時發生錯誤：", error);
      throw new Error("刪除合約失敗");
    }
  }
}
