/**
 * @fileoverview 財務管理服務
 */
import { firestore } from '@/features/integrations/database/firebase-client/firebase-client';
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import type {
  Payment,
  Receipt,
  Invoice,
  CreatePaymentInput,
  CreateReceiptInput,
  CreateInvoiceInput,
  FinancialSummary,
} from '../types';

export class FinancialService {
  private readonly collectionName = 'engagements';

  /**
   * 添加付款記錄
   */
  async addPayment(
    engagementId: string,
    input: CreatePaymentInput
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      const payment: Payment = {
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        status: '待處理',
        requestDate: Timestamp.now(),
        createdBy: 'system', // TODO: 從認證上下文獲取
        createdAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        payments: arrayUnion(payment),
        updatedAt: Timestamp.now(),
      });

      return { success: true, paymentId: payment.id };
    } catch (error) {
      console.error('添加付款記錄失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `添加失敗: ${errorMessage}` };
    }
  }

  /**
   * 更新付款狀態
   */
  async updatePaymentStatus(
    engagementId: string,
    paymentId: string,
    status: Payment['status'],
    paidDate?: Date
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      
      // 獲取當前的 engagement 文檔
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Engagement 不存在' };
      }
      
      const engagementData = docSnap.data();
      const payments = engagementData.payments || [];
      
      // 找到並更新特定的付款記錄
      const updatedPayments = payments.map((payment: Payment) => {
        if (payment.id === paymentId) {
          return {
            ...payment,
            status,
            ...(paidDate && { paidDate: Timestamp.fromDate(paidDate) }),
            updatedAt: Timestamp.now(),
            updatedBy: 'system', // TODO: 從認證上下文獲取
          };
        }
        return payment;
      });
      
      // 檢查是否找到要更新的付款記錄
      const paymentExists = payments.some((payment: Payment) => payment.id === paymentId);
      if (!paymentExists) {
        return { success: false, error: '付款記錄不存在' };
      }
      
      // 更新文檔
      await updateDoc(docRef, {
        payments: updatedPayments,
        updatedAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
      });
      
      return { success: true };
    } catch (error) {
      console.error('更新付款狀態失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 添加收款記錄
   */
  async addReceipt(
    engagementId: string,
    input: CreateReceiptInput
  ): Promise<{ success: boolean; receiptId?: string; error?: string }> {
    try {
      const receipt: Receipt = {
        id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        status: '待處理',
        requestDate: Timestamp.now(),
        createdBy: 'system', // TODO: 從認證上下文獲取
        createdAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        receipts: arrayUnion(receipt),
        updatedAt: Timestamp.now(),
      });

      return { success: true, receiptId: receipt.id };
    } catch (error) {
      console.error('添加收款記錄失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `添加失敗: ${errorMessage}` };
    }
  }

  /**
   * 添加發票
   */
  async addInvoice(
    engagementId: string,
    input: CreateInvoiceInput
  ): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    try {
      const invoice: Invoice = {
        id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...input,
        status: '草稿',
        issueDate: Timestamp.now(),
        dueDate: Timestamp.fromDate(input.dueDate),
        totalAmount: input.amount + (input.taxAmount || 0),
        items: input.items.map(item => ({
          ...item,
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })),
        createdBy: 'system', // TODO: 從認證上下文獲取
        createdAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        invoices: arrayUnion(invoice),
        updatedAt: Timestamp.now(),
      });

      return { success: true, invoiceId: invoice.id };
    } catch (error) {
      console.error('添加發票失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `添加失敗: ${errorMessage}` };
    }
  }

  /**
   * 計算財務摘要
   */
  calculateFinancialSummary(
    totalValue: number,
    payments: Payment[],
    receipts: Receipt[],
    invoices: Invoice[]
  ): FinancialSummary {
    const totalPaid = payments
      .filter(p => p.status === '已付款')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === '待處理')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOverdue = payments
      .filter(p => p.status === '已逾期')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalReceived = receipts
      .filter(r => r.status === '已收款')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalInvoiceAmount = invoices
      .filter(i => i.status === '已付款')
      .reduce((sum, i) => sum + i.totalAmount, 0);

    const paymentProgress = totalValue > 0 ? (totalPaid / totalValue) * 100 : 0;
    const receiptProgress = totalValue > 0 ? (totalReceived / totalValue) * 100 : 0;
    const invoiceProgress = totalValue > 0 ? (totalInvoiceAmount / totalValue) * 100 : 0;

    return {
      totalValue,
      paidAmount: totalPaid,
      pendingAmount: totalPending,
      overdueAmount: totalOverdue,
      paymentProgress: Math.round(paymentProgress),
      receiptProgress: Math.round(receiptProgress),
      invoiceProgress: Math.round(invoiceProgress),
      costBreakdown: {
        labor: 0, // TODO: 從任務數據計算
        materials: 0, // TODO: 從任務數據計算
        equipment: 0, // TODO: 從任務數據計算
        overhead: 0, // TODO: 從任務數據計算
        other: 0, // TODO: 從任務數據計算
      },
    };
  }

  /**
   * 更新收款狀態
   */
  async updateReceiptStatus(
    engagementId: string,
    receiptId: string,
    status: Receipt['status'],
    receivedDate?: Date
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      
      // 獲取當前的 engagement 文檔
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Engagement 不存在' };
      }
      
      const engagementData = docSnap.data();
      const receipts = engagementData.receipts || [];
      
      // 找到並更新特定的收款記錄
      const updatedReceipts = receipts.map((receipt: Receipt) => {
        if (receipt.id === receiptId) {
          return {
            ...receipt,
            status,
            ...(receivedDate && { receivedDate: Timestamp.fromDate(receivedDate) }),
            updatedAt: Timestamp.now(),
            updatedBy: 'system', // TODO: 從認證上下文獲取
          };
        }
        return receipt;
      });
      
      // 檢查是否找到要更新的收款記錄
      const receiptExists = receipts.some((receipt: Receipt) => receipt.id === receiptId);
      if (!receiptExists) {
        return { success: false, error: '收款記錄不存在' };
      }
      
      // 更新文檔
      await updateDoc(docRef, {
        receipts: updatedReceipts,
        updatedAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
      });
      
      return { success: true };
    } catch (error) {
      console.error('更新收款狀態失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 更新發票狀態
   */
  async updateInvoiceStatus(
    engagementId: string,
    invoiceId: string,
    status: Invoice['status'],
    paidDate?: Date
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      
      // 獲取當前的 engagement 文檔
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Engagement 不存在' };
      }
      
      const engagementData = docSnap.data();
      const invoices = engagementData.invoices || [];
      
      // 找到並更新特定的發票記錄
      const updatedInvoices = invoices.map((invoice: Invoice) => {
        if (invoice.id === invoiceId) {
          return {
            ...invoice,
            status,
            ...(paidDate && { paidDate: Timestamp.fromDate(paidDate) }),
            updatedAt: Timestamp.now(),
            updatedBy: 'system', // TODO: 從認證上下文獲取
          };
        }
        return invoice;
      });
      
      // 檢查是否找到要更新的發票記錄
      const invoiceExists = invoices.some((invoice: Invoice) => invoice.id === invoiceId);
      if (!invoiceExists) {
        return { success: false, error: '發票記錄不存在' };
      }
      
      // 更新文檔
      await updateDoc(docRef, {
        invoices: updatedInvoices,
        updatedAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
      });
      
      return { success: true };
    } catch (error) {
      console.error('更新發票狀態失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 更新 Engagement 的財務信息
   */
  async updateFinancialInfo(
    engagementId: string,
    financialSummary: FinancialSummary
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      await updateDoc(docRef, {
        paidAmount: financialSummary.paidAmount,
        pendingAmount: financialSummary.pendingAmount,
        updatedAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
      });

      return { success: true };
    } catch (error) {
      console.error('更新財務信息失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }

  /**
   * 批量更新財務記錄
   */
  async batchUpdateFinancialRecords(
    engagementId: string,
    updates: {
      payments?: Array<{ id: string; status: Payment['status']; paidDate?: Date }>;
      receipts?: Array<{ id: string; status: Receipt['status']; receivedDate?: Date }>;
      invoices?: Array<{ id: string; status: Invoice['status']; paidDate?: Date }>;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(firestore, this.collectionName, engagementId);
      
      // 獲取當前的 engagement 文檔
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Engagement 不存在' };
      }
      
      const engagementData = docSnap.data();
      let updatedData: any = {
        updatedAt: Timestamp.now(),
        updatedBy: 'system', // TODO: 從認證上下文獲取
      };
      
      // 更新付款記錄
      if (updates.payments) {
        const payments = engagementData.payments || [];
        const updatedPayments = payments.map((payment: Payment) => {
          const update = updates.payments!.find(u => u.id === payment.id);
          if (update) {
            return {
              ...payment,
              status: update.status,
              ...(update.paidDate && { paidDate: Timestamp.fromDate(update.paidDate) }),
              updatedAt: Timestamp.now(),
              updatedBy: 'system',
            };
          }
          return payment;
        });
        updatedData.payments = updatedPayments;
      }
      
      // 更新收款記錄
      if (updates.receipts) {
        const receipts = engagementData.receipts || [];
        const updatedReceipts = receipts.map((receipt: Receipt) => {
          const update = updates.receipts!.find(u => u.id === receipt.id);
          if (update) {
            return {
              ...receipt,
              status: update.status,
              ...(update.receivedDate && { receivedDate: Timestamp.fromDate(update.receivedDate) }),
              updatedAt: Timestamp.now(),
              updatedBy: 'system',
            };
          }
          return receipt;
        });
        updatedData.receipts = updatedReceipts;
      }
      
      // 更新發票記錄
      if (updates.invoices) {
        const invoices = engagementData.invoices || [];
        const updatedInvoices = invoices.map((invoice: Invoice) => {
          const update = updates.invoices!.find(u => u.id === invoice.id);
          if (update) {
            return {
              ...invoice,
              status: update.status,
              ...(update.paidDate && { paidDate: Timestamp.fromDate(update.paidDate) }),
              updatedAt: Timestamp.now(),
              updatedBy: 'system',
            };
          }
          return invoice;
        });
        updatedData.invoices = updatedInvoices;
      }
      
      // 更新文檔
      await updateDoc(docRef, updatedData);
      
      return { success: true };
    } catch (error) {
      console.error('批量更新財務記錄失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }
}

// 導出單例實例
export const financialService = new FinancialService();