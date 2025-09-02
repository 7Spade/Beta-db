/**
 * @fileoverview Engagement 表單相關的自定義 Hook
 */
'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  createEngagementAction, 
  updateEngagementAction 
} from '../actions';
import type { 
  CreateEngagementInput, 
  UpdateEngagementInput,
  Engagement 
} from '../types';

// 創建表單的驗證 schema
const createEngagementSchema = z.object({
  name: z.string().min(1, '名稱不能為空').max(100, '名稱不能超過100個字符'),
  description: z.string().min(1, '描述不能為空').max(500, '描述不能超過500個字符'),
  contractor: z.string().min(1, '承包商不能為空'),
  client: z.string().min(1, '客戶不能為空'),
  clientRepresentative: z.string().optional(),
  startDate: z.string().min(1, '開始日期不能為空'),
  endDate: z.string().min(1, '結束日期不能為空'),
  totalValue: z.number().min(0, '總價值不能為負數'),
  currency: z.string().min(1, '貨幣不能為空'),
  scope: z.string().min(1, '工作範疇不能為空').max(1000, '工作範疇不能超過1000個字符'),
});

// 編輯表單的驗證 schema
const editEngagementSchema = createEngagementSchema.extend({
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  status: z.enum(['草稿', '已簽約', '進行中', '暫停', '已完成', '已終止', '已取消']),
  phase: z.enum(['規劃', '執行', '監控', '收尾', '維護']),
});

type CreateEngagementFormData = z.infer<typeof createEngagementSchema>;
type EditEngagementFormData = z.infer<typeof editEngagementSchema>;

interface UseCreateEngagementFormReturn {
  form: ReturnType<typeof useForm<CreateEngagementFormData>>;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (data: CreateEngagementFormData) => Promise<{ success: boolean; engagementId?: string }>;
  reset: () => void;
}

export function useCreateEngagementForm(): UseCreateEngagementFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateEngagementFormData>({
    resolver: zodResolver(createEngagementSchema),
    defaultValues: {
      name: '',
      description: '',
      contractor: '',
      client: '',
      clientRepresentative: '',
      startDate: '',
      endDate: '',
      totalValue: 0,
      currency: 'TWD',
      scope: '',
    },
  });

  const onSubmit = useCallback(async (data: CreateEngagementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const input: CreateEngagementInput = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };

      const result = await createEngagementAction(input);

      if (result.success) {
        form.reset();
        return { success: true, engagementId: result.engagementId };
      } else {
        setError(result.error || '創建失敗');
        return { success: false };
      }
    } catch (err) {
      setError('發生未知錯誤');
      console.error('創建 Engagement 失敗:', err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    form.reset();
    setError(null);
  }, [form]);

  return {
    form,
    isSubmitting,
    error,
    onSubmit,
    reset,
  };
}

interface UseEditEngagementFormReturn {
  form: ReturnType<typeof useForm<EditEngagementFormData>>;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  onSubmit: (data: EditEngagementFormData) => Promise<{ success: boolean }>;
  loadEngagement: (engagement: Engagement) => void;
  reset: () => void;
}

export function useEditEngagementForm(): UseEditEngagementFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EditEngagementFormData>({
    resolver: zodResolver(editEngagementSchema),
    defaultValues: {
      name: '',
      description: '',
      contractor: '',
      client: '',
      clientRepresentative: '',
      startDate: '',
      endDate: '',
      actualStartDate: '',
      actualEndDate: '',
      totalValue: 0,
      currency: 'TWD',
      status: '草稿',
      phase: '規劃',
      scope: '',
    },
  });

  const onSubmit = useCallback(async (data: EditEngagementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const input: UpdateEngagementInput = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        actualStartDate: data.actualStartDate ? new Date(data.actualStartDate) : undefined,
        actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : undefined,
      };

      // 這裡需要從外部傳入 engagementId，或者從 context 獲取
      // 為了簡化，這裡假設有一個全局的 currentEngagementId
      const engagementId = (window as any).currentEngagementId;
      
      if (!engagementId) {
        setError('無法獲取 Engagement ID');
        return { success: false };
      }

      const result = await updateEngagementAction(engagementId, input);

      if (result.success) {
        return { success: true };
      } else {
        setError(result.error || '更新失敗');
        return { success: false };
      }
    } catch (err) {
      setError('發生未知錯誤');
      console.error('更新 Engagement 失敗:', err);
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const loadEngagement = useCallback((engagement: Engagement) => {
    setIsLoading(true);
    setError(null);

    try {
      // 格式化日期
      const formatDate = (date: Date | any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toISOString().split('T')[0];
      };

      form.reset({
        name: engagement.name,
        description: engagement.description,
        contractor: engagement.contractor,
        client: engagement.client,
        clientRepresentative: engagement.clientRepresentative || '',
        startDate: formatDate(engagement.startDate),
        endDate: formatDate(engagement.endDate),
        actualStartDate: formatDate(engagement.actualStartDate),
        actualEndDate: formatDate(engagement.actualEndDate),
        totalValue: engagement.totalValue,
        currency: engagement.currency,
        status: engagement.status,
        phase: engagement.phase,
        scope: engagement.scope,
      });
    } catch (err) {
      setError('載入數據時發生錯誤');
      console.error('載入 Engagement 數據失敗:', err);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const reset = useCallback(() => {
    form.reset();
    setError(null);
  }, [form]);

  return {
    form,
    isSubmitting,
    isLoading,
    error,
    onSubmit,
    loadEngagement,
    reset,
  };
}