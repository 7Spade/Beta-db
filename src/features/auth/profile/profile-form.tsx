'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateUserProfile } from './actions/profile-actions';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: '名稱至少需要 2 個字元。' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues: ProfileFormValues;
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    const result = await updateUserProfile(data);
    setIsSaving(false);

    if (result.success) {
      toast({ title: '已更新', description: '您的個人資料已成功更新。' });
    } else {
      toast({ title: '更新失敗', description: result.error, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>顯示名稱</CardTitle>
        <CardDescription>這將是您在應用程式中公開顯示的名稱。</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>您的名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入您的顯示名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              儲存變更
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
