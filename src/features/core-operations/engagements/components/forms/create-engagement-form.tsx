/**
 * @fileoverview 創建 Engagement 表單組件
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createEngagementAction } from '../../actions';
import type { CreateEngagementInput } from '../../types';

// 表單驗證 schema
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

type CreateEngagementFormData = z.infer<typeof createEngagementSchema>;

interface CreateEngagementFormProps {
  onSuccess?: (engagementId: string) => void;
  onCancel?: () => void;
}

export function CreateEngagementForm({ onSuccess, onCancel }: CreateEngagementFormProps) {
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

  const onSubmit = async (data: CreateEngagementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const input: CreateEngagementInput = {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };

      const result = await createEngagementAction(input);

      if (result.success && result.engagementId) {
        onSuccess?.(result.engagementId);
        form.reset();
      } else {
        setError(result.error || '創建失敗');
      }
    } catch (err) {
      setError('發生未知錯誤');
      console.error('創建 Engagement 失敗:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>創建新的專案合約</CardTitle>
        <CardDescription>
          填寫以下信息來創建一個新的專案合約管理項目
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>專案名稱 *</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入專案名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>承包商 *</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入承包商名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>客戶 *</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入客戶名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientRepresentative"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>客戶代表</FormLabel>
                    <FormControl>
                      <Input placeholder="輸入客戶代表姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>專案描述 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="輸入專案描述" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始日期 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>結束日期 *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>總價值 *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>貨幣 *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇貨幣" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TWD">新台幣 (TWD)</SelectItem>
                        <SelectItem value="USD">美元 (USD)</SelectItem>
                        <SelectItem value="EUR">歐元 (EUR)</SelectItem>
                        <SelectItem value="JPY">日圓 (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>工作範疇 *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="描述工作範疇和交付物" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    詳細描述專案的工作範疇、交付物和預期成果
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  取消
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '創建中...' : '創建專案合約'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}