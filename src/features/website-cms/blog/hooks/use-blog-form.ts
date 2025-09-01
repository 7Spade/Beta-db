'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Post } from '../types/blog.types';

const postSchema = z.object({
  title: z.string().min(3, '標題至少需要 3 個字元。'),
  content: z.string().min(10, '內容至少需要 10 個字元。'),
  status: z.enum(['草稿', '已發布', '已封存']),
  slug: z.string().min(3, 'Slug 至少需要 3 個字元。').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字和連字符號。'),
  excerpt: z.string().optional(),
  imageUrl: z.string().url('請輸入有效的圖片網址。').optional().or(z.literal('')),
});

export type PostFormValues = z.infer<typeof postSchema>;

/**
 * Custom hook to manage the blog post form state and logic.
 * @param {Post | null} post - The initial post data for editing, or null for creating.
 * @returns The form instance from react-hook-form.
 */
export function useBlogForm(post: Post | null) {
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

  // Function to generate a URL-friendly slug from text
  const slugify = useCallback((text: string) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\u4e00-\u9fa5a-z0-9-]+/g, '') // Keep Chinese characters, letters, numbers, and hyphens
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }, []);

  // Effect to auto-generate slug from title, only if slug is empty
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && !form.getValues('slug')) {
        form.setValue('slug', slugify(value.title || ''));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, slugify]);

  // Effect to reset the form when the initial post data changes
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        content: post.content,
        status: post.status,
        slug: post.slug,
        excerpt: post.excerpt,
        imageUrl: post.imageUrl,
      });
    } else {
      form.reset();
    }
  }, [post, form]);

  return form;
}
