'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { savePostAction } from '../actions/blog.actions';
import { BlogEditor } from '../components/BlogEditor';
import { MediaUploader } from '../components/MediaUploader';
import { useBlogForm, type PostFormValues } from '../hooks/use-blog-form';
import type { Post } from '../types/blog.types';

interface BlogFormViewProps {
  post: Post | null;
}

export function BlogFormView({ post }: BlogFormViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useBlogForm(post);

  const onSubmit = async (values: PostFormValues) => {
    const result = await savePostAction(values, post?.id);
    if (result.success) {
      toast({ title: "成功", description: "文章已成功儲存。" });
      router.push('/website-cms/blog-management/posts');
    } else {
      toast({ title: "儲存失敗", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            儲存文章
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>文章內容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>標題</FormLabel>
                      <FormControl><Input placeholder="您的文章標題" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>內容 (支援 Markdown)</FormLabel>
                      <FormControl><BlogEditor {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle>設定</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>狀態</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="草稿">草稿</SelectItem>
                          <SelectItem value="已發布">已發布</SelectItem>
                          <SelectItem value="已封存">已封存</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl><Input placeholder="unique-post-slug" {...field} /></FormControl>
                      <FormDescription>文章的網址，請保持唯一性。</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>文章主圖</CardTitle></CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <MediaUploader
                        currentImageUrl={field.value}
                        onUploadSuccess={(url) => field.onChange(url)}
                      />
                      <FormDescription>或貼上圖片網址</FormDescription>
                      <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
