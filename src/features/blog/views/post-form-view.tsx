
'use client';

import { savePost, type PostFormValues } from '@/features/blog/actions/posts.actions';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Skeleton } from '@/ui/skeleton';
import { Textarea } from '@/ui/textarea';
import { DocumentData } from 'firebase/firestore';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

const postSchema = z.object({
    title: z.string().min(3, '標題至少需要 3 個字元。'),
    content: z.string().min(10, '內容至少需要 10 個字元。'),
    status: z.enum(['草稿', '已發布', '已封存']),
    slug: z.string().min(3, 'Slug 至少需要 3 個字元。').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字和連字符號。'),
    excerpt: z.string().optional(),
    imageUrl: z.string().url('請輸入有效的圖片網址。').optional().or(z.literal('')),
});

interface PostFormViewProps {
    postId: string | null;
}

export function PostFormView({ postId }: PostFormViewProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: '',
            content: '',
            status: '草稿',
            slug: '',
            excerpt: '',
            imageUrl: '',
        },
    });

    const slugify = useCallback((text: string) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\u4e00-\u9fa5a-z0-9-]+/g, '') // Remove all non-word chars
            .replace(/--+/g, '-')       // Replace multiple - with single -
            .replace(/^-+/, '')         // Trim - from start of text
            .replace(/-+$/, '');        // Trim - from end of text
    }, []);

    useEffect(() => {
        const titleSubscription = form.watch((value, { name }) => {
            if (name === 'title' && !form.getValues('slug')) {
                form.setValue('slug', slugify(value.title || ''));
            }
        });
        return () => titleSubscription.unsubscribe();
    }, [form, slugify]);

    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                const docRef = doc(firestore, 'posts', postId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as DocumentData;
                    form.reset({
                        ...data,
                        // Firestore timestamps need to be converted to Dates for the form
                        createdAt: (data.createdAt as Timestamp)?.toDate(),
                        updatedAt: (data.updatedAt as Timestamp)?.toDate(),
                    });
                } else {
                    toast({ title: "錯誤", description: "找不到該文章。", variant: "destructive" });
                    router.push('/admin/blog/posts');
                }
                setLoading(false);
            };
            fetchPost();
        } else {
            setLoading(false);
        }
    }, [postId, router, toast, form]);

    const onSubmit = async (values: PostFormValues) => {
        setIsSaving(true);
        const result = await savePost(values, postId);
        setIsSaving(false);
        if (result.success) {
            toast({ title: "成功", description: "文章已成功儲存。" });
            if (postId) {
                router.push('/admin/blog/posts');
            } else if (result.postId) {
                router.push(`/admin/blog/posts/${result.postId}`);
            } else {
                router.push('/admin/blog/posts');
            }
        } else {
            toast({ title: "儲存失敗", description: result.error, variant: "destructive" });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-40 w-full" />
                        <div className="flex justify-end">
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/blog/posts')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回文章列表
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSaving ? '儲存中...' : '儲存文章'}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{postId ? '編輯文章' : '新增文章'}</CardTitle>
                        <CardDescription>填寫文章的詳細內容並選擇發布狀態。</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>標題</FormLabel>
                                    <FormControl><Input placeholder="文章的標題" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>文章 Slug</FormLabel>
                                    <FormControl><Input placeholder="unique-post-slug" {...field} /></FormControl>
                                    <FormDescription>這是文章在網址中的唯一識別符。只能使用小寫字母、數字和連字符號。</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>內容</FormLabel>
                                    <FormControl><Textarea placeholder="文章內容，支援 Markdown 格式..." rows={15} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>狀態</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="選擇發布狀態" /></SelectTrigger></FormControl>
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
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
