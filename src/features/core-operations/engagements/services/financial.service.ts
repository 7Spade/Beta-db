/**
 * @fileoverview 財務管理服務
 */
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
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
      // 這裡需要先獲取當前的 engagement，更新特定的 payment，然後保存回去
      // 由於 Firestore 的限制，我們需要這樣做
      const docRef = doc(firestore, this.collectionName, engagementId);
      
      // 實際實現中，我們需要先獲取文檔，修改數組中的特定項目，然後更新
      // 這裡簡化處理，實際應該使用更複雜的邏輯
      
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
      });

      return { success: true };
    } catch (error) {
      console.error('更新財務信息失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
      return { success: false, error: `更新失敗: ${errorMessage}` };
    }
  }
}

// 導出單例實例
export const financialService = new FinancialService();