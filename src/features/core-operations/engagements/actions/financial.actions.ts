/**
 * @fileoverview 財務相關的 Server Actions
 */
'use server';

import { revalidatePath } from 'next/cache';
import { engagementService, financialService, notificationService } from '../services';
import type {
  CreatePaymentInput,
  CreateReceiptInput,
  CreateInvoiceInput,
  PaymentStatus,
  ReceiptStatus,
  InvoiceStatus,
} from '../types';

/**
 * 添加付款記錄
 */
export async function addPaymentAction(
  engagementId: string,
  input: CreatePaymentInput
): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  try {
    const result = await financialService.addPayment(engagementId, input);
    
    if (result.success) {
      // 更新 Engagement 的財務摘要
      const engagementResult = await engagementService.getEngagement(engagementId);
      if (engagementResult.success && engagementResult.engagement) {
        const engagement = engagementResult.engagement;
        const financialSummary = financialService.calculateFinancialSummary(
          engagement.totalValue,
          [...engagement.payments, { ...input, id: result.paymentId!, status: '待處理' } as any],
          engagement.receipts,
          engagement.invoices
        );
        
        await financialService.updateFinancialInfo(engagementId, financialSummary);
      }
      
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }
    
    return result;
  } catch (error) {
    console.error('添加付款 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `添加失敗: ${errorMessage}` };
  }
}

/**
 * 更新付款狀態
 */
export async function updatePaymentStatusAction(
  engagementId: string,
  paymentId: string,
  status: PaymentStatus,
  paidDate?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await financialService.updatePaymentStatus(
      engagementId,
      paymentId,
      status,
      paidDate
    );
    
    if (result.success) {
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }
    
    return result;
  } catch (error) {
    console.error('更新付款狀態 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 添加收款記錄
 */
export async function addReceiptAction(
  engagementId: string,
  input: CreateReceiptInput
): Promise<{ success: boolean; receiptId?: string; error?: string }> {
  try {
    const result = await financialService.addReceipt(engagementId, input);
    
    if (result.success) {
      // 更新 Engagement 的財務摘要
      const engagementResult = await engagementService.getEngagement(engagementId);
      if (engagementResult.success && engagementResult.engagement) {
        const engagement = engagementResult.engagement;
        const financialSummary = financialService.calculateFinancialSummary(
          engagement.totalValue,
          engagement.payments,
          [...engagement.receipts, { ...input, id: result.receiptId!, status: '待處理' } as any],
          engagement.invoices
        );
        
        await financialService.updateFinancialInfo(engagementId, financialSummary);
      }
      
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }
    
    return result;
  } catch (error) {
    console.error('添加收款 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `添加失敗: ${errorMessage}` };
  }
}

/**
 * 更新收款狀態
 */
export async function updateReceiptStatusAction(
  engagementId: string,
  receiptId: string,
  status: ReceiptStatus,
  receivedDate?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: 實現更新收款狀態的邏輯
    // 類似於 updatePaymentStatus，但針對 receipts
    
    revalidatePath('/engagements');
    revalidatePath(`/engagements/${engagementId}`);
    
    return { success: true };
  } catch (error) {
    console.error('更新收款狀態 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 添加發票
 */
export async function addInvoiceAction(
  engagementId: string,
  input: CreateInvoiceInput
): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
  try {
    const result = await financialService.addInvoice(engagementId, input);
    
    if (result.success) {
      // 更新 Engagement 的財務摘要
      const engagementResult = await engagementService.getEngagement(engagementId);
      if (engagementResult.success && engagementResult.engagement) {
        const engagement = engagementResult.engagement;
        const financialSummary = financialService.calculateFinancialSummary(
          engagement.totalValue,
          engagement.payments,
          engagement.receipts,
          [...engagement.invoices, { ...input, id: result.invoiceId!, status: '草稿' } as any]
        );
        
        await financialService.updateFinancialInfo(engagementId, financialSummary);
      }
      
      revalidatePath('/engagements');
      revalidatePath(`/engagements/${engagementId}`);
    }
    
    return result;
  } catch (error) {
    console.error('添加發票 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `添加失敗: ${errorMessage}` };
  }
}

/**
 * 更新發票狀態
 */
export async function updateInvoiceStatusAction(
  engagementId: string,
  invoiceId: string,
  status: InvoiceStatus,
  paidDate?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: 實現更新發票狀態的邏輯
    
    revalidatePath('/engagements');
    revalidatePath(`/engagements/${engagementId}`);
    
    return { success: true };
  } catch (error) {
    console.error('更新發票狀態 Action 失敗:', error);
    const errorMessage = error instanceof Error ? error.message : '發生未知錯誤';
    return { success: false, error: `更新失敗: ${errorMessage}` };
  }
}

/**
 * 標記付款為已付款
 */
export async function markPaymentAsPaidAction(
  engagementId: string,
  paymentId: string,
  paidDate?: Date
): Promise<{ success: boolean; error?: string }> {
  return updatePaymentStatusAction(
    engagementId,
    paymentId,
    '已付款',
    paidDate || new Date()
  );
}

/**
 * 標記收款為已收款
 */
export async function markReceiptAsReceivedAction(
  engagementId: string,
  receiptId: string,
  receivedDate?: Date
): Promise<{ success: boolean; error?: string }> {
  return updateReceiptStatusAction(
    engagementId,
    receiptId,
    '已收款',
    receivedDate || new Date()
  );
}