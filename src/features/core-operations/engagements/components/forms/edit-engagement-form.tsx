/**
 * @fileoverview 編輯 Engagement 表單組件
 */
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateEngagementAction } from '../../actions';
import { engagementService } from '../../services';
import type { Engagement, UpdateEngagementInput, EngagementStatus, EngagementPhase } from '../../types';

// 表單驗證 schema
const editEngagementSchema = z.object({
  name: z.string().min(1, '名稱不能為空').max(100, '名稱不能超過100個字符'),
  description: z.string().min(1, '描述不能為空').max(500, '描述不能超過500個字符'),
  contractor: z.string().min(1, '承包商不能為空'),
  client: z.string().min(1, '客戶不能為空'),
  clientRepresentative: z.string().optional(),
  startDate: z.string().min(1, '開始日期不能為空'),
  endDate: z.string().min(1, '結束日期不能為空'),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
  totalValue: z.number().min(0, '總價值不能為負數'),
  currency: z.string().min(1, '貨幣不能為空'),
  status: z.enum(['草稿', '已簽約', '進行中', '暫停', '已完成', '已終止', '已取消']),
  phase: z.enum(['規劃', '執行', '監控', '收尾', '維護']),
  scope: z.string().min(1, '工作範疇不能為空').max(1000, '工作範疇不能超過1000個字符'),
});

type EditEngagementFormData = z.infer<typeof editEngagementSchema>;

interface EditEngagementFormProps {
  engagementId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditEngagementForm({ engagementId, onSuccess, onCancel }: EditEngagementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [engagement, setEngagement] = useState<Engagement | null>(null);

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

  // 載入 Engagement 數據
  useEffect(() => {
    const loadEngagement = async () => {
      try {
        const result = await engagementService.getEngagement(engagementId);
        if (result.success && result.engagement) {
          setEngagement(result.engagement);
          const data = result.engagement;
          
          // 格式化日期
          const formatDate = (date: Date | any) => {
            if (!date) return '';
            const d = date.toDate ? date.toDate() : new Date(date);
            return d.toISOString().split('T')[0];
          };

          form.reset({
            name: data.name,
            description: data.description,
            contractor: data.contractor,
            client: data.client,
            clientRepresentative: data.clientRepresentative || '',
            startDate: formatDate(data.startDate),
            endDate: formatDate(data.endDate),
            actualStartDate: formatDate(data.actualStartDate),
            actualEndDate: formatDate(data.actualEndDate),
            totalValue: data.totalValue,
            currency: data.currency,
            status: data.status,
            phase: data.phase,
            scope: data.scope,
          });
        } else {
          setError(result.error || '載入失敗');
        }
      } catch (err) {
        setError('載入數據時發生錯誤');
        console.error('載入 Engagement 失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEngagement();
  }, [engagementId, form]);

  const onSubmit = async (data: EditEngagementFormData) => {
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

      const result = await updateEngagementAction(engagementId, input);

      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || '更新失敗');
      }
    } catch (err) {
      setError('發生未知錯誤');
      console.error('更新 Engagement 失敗:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">載入中...</div>
        </CardContent>
      </Card>
    );
  }

  if (!engagement) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">載入失敗</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>編輯專案合約</CardTitle>
        <CardDescription>
          修改專案合約的相關信息
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
                name="actualStartDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>實際開始日期</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="actualEndDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>實際結束日期</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>狀態 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="選擇狀態" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="草稿">草稿</SelectItem>
                        <SelectItem value="已簽約">已簽約</SelectItem>
                        <SelectItem value="進行中">進行中</SelectItem>
                        <SelectItem value="暫停">暫停</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                        <SelectItem value="已終止">已終止</SelectItem>
                        <SelectItem value="已取消">已取消</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>階段 *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇階段" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="規劃">規劃</SelectItem>
                      <SelectItem value="執行">執行</SelectItem>
                      <SelectItem value="監控">監控</SelectItem>
                      <SelectItem value="收尾">收尾</SelectItem>
                      <SelectItem value="維護">維護</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? '更新中...' : '更新專案合約'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}