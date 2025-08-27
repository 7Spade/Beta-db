'use client';

import React from 'react';
import { useAuth } from '@/components/features/auth/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileValues } from './auth-form-schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from './auth-actions';

export function ProfileView() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: profile?.displayName || '',
    },
  });

  const onSubmit = async (data: ProfileValues) => {
    if (!user) return;
    setSaving(true);
    const result = await updateUserProfile({ userId: user.uid, updates: { displayName: data.displayName } });
    setSaving(false);
    if (result.success) {
      toast({ title: '已更新', description: '您的個人資料已更新。' });
    } else {
      toast({ title: '更新失敗', description: result.error, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div>載入中…</div>;
  }

  if (!user) {
    return <div>請先登入。</div>;
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>我的個人資料</CardTitle>
        <CardDescription>更新您的顯示名稱。Email、角色與審核狀態為唯讀。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Email</div>
          <div>{user.email}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">角色</div>
          <div>{profile?.role || '-'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">審核狀態</div>
          <div>{profile?.status || '-'}</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顯示名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入您的顯示名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              儲存變更
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


