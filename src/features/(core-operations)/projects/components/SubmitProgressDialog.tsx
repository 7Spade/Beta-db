
'use client';

import { useAuth } from '@/features/auth';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { submitTaskProgressForReview } from '../actions/workflow.actions';
import type { Project, Task } from '../types';

interface SubmitProgressDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: Task;
  project: Project;
  remainingQuantity: number;
}

export function SubmitProgressDialog({
  isOpen,
  onOpenChange,
  task,
  project,
  remainingQuantity,
}: SubmitProgressDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const progressSchema = z.object({
    submittedQuantity: z
      .number()
      .min(0.01, '數量必須大於 0。')
      .max(remainingQuantity, `數量不能超過剩餘的 ${remainingQuantity}。`),
    notes: z.string().optional(),
  });

  type ProgressFormValues = z.infer<typeof progressSchema>;

  const form = useForm<ProgressFormValues>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      submittedQuantity: remainingQuantity > 0 ? 1 : 0,
      notes: '',
    },
  });

  const onSubmit = async (values: ProgressFormValues) => {
    if (!user || !profile) {
      toast({
        variant: 'destructive',
        title: '錯誤',
        description: '無法驗證您的身分。',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await submitTaskProgressForReview({
      projectId: project.id,
      taskId: task.id,
      taskTitle: task.title,
      submittedQuantity: values.submittedQuantity,
      notes: values.notes,
      applicantId: user.uid,
      applicantName: profile.displayName || user.email || '未知使用者',
      reviewerId: 'admin_placeholder', // This should be determined by project settings in a real app
    });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: '成功',
        description: '您的進度回報已提交，正在等待審核。',
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        variant: 'destructive',
        title: '提交失敗',
        description: result.error,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>回報任務進度</DialogTitle>
          <DialogDescription>
            對於任務「{task.title}」，請輸入您本次完成的數量。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="submittedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>完成數量 (剩餘: {remainingQuantity})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="輸入数量"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      step="any"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備註 (可選)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="任何需要說明的細節..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                提交以供驗收
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
