/**
 * @fileoverview Blog Server Actions
 * @description Contains server-side logic for creating, updating, and deleting blog posts.
 */
'use server';

import { getPostById } from '@/shared/services/blog/blog.service';
import * as CacheService from '@/shared/services/blog/cache.service';
import { adminAuth, adminDb } from '@root/src/features/integrations/database/firebase-admin/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { slugify } from '../utils/slug.utils';

const postSchema = z.object({
  title: z.string().min(3, '標題至少需要 3 個字元。'),
  content: z.string().min(10, '內容至少需要 10 個字元。'),
  status: z.enum(['草稿', '已發布', '已封存']),
  slug: z.string().min(3, 'Slug 至少需要 3 個字元。').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小寫字母、數字和連字符號。'),
  excerpt: z.string().optional(),
  imageUrl: z.string().url('請輸入有效的圖片網址。').optional().or(z.literal('')),
});

export type PostFormValues = z.infer<typeof postSchema>;
export type PostActionResponse = { success: boolean; error?: string; postId?: string; };

/**
 * Saves a blog post to Firestore (creates or updates).
 */
export async function savePostAction(data: PostFormValues, postId?: string | null): Promise<PostActionResponse> {
  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  const { slug, ...postData } = validation.data;
  const finalSlug = slugify(slug);

  try {
    const sessionCookie = (await cookies()).get('session')?.value;
    if (!sessionCookie) return { success: false, error: '未授權' };
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);

    const postsCollection = adminDb.collection('posts');

    // Check for slug uniqueness
    const existingPostQuery = await postsCollection.where('slug', '==', finalSlug).limit(1).get();
    if (!existingPostQuery.empty && existingPostQuery.docs[0].id !== postId) {
      return { success: false, error: '這個 Slug 已經被另一篇文章使用了。' };
    }

    if (postId) {
      // Update existing post
      const postRef = postsCollection.doc(postId);
      const originalPost = await getPostById(postId);

      await postRef.update({
        ...postData,
        slug: finalSlug,
        updatedAt: Timestamp.now(),
      });
      // Invalidate cache for the old slug if it changed
      if (originalPost && originalPost.slug !== finalSlug) {
        await CacheService.invalidatePostCache(originalPost.slug);
      }
    } else {
      // Create new post
      const docRef = await postsCollection.add({
        ...postData,
        slug: finalSlug,
        authorId: decodedToken.uid,
        authorName: decodedToken.name || decodedToken.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        publishedAt: postData.status === '已發布' ? Timestamp.now() : null,
      });
      postId = docRef.id;
    }

    // Invalidate caches
    await CacheService.invalidateBlogListCache();
    await CacheService.invalidatePostCache(finalSlug);

    // Revalidate Next.js paths
    revalidatePath('/website-cms/blog-management/posts');
    revalidatePath('/blog');
    revalidatePath(`/blog/${finalSlug}`);

    return { success: true, postId };
  } catch (error) {
    console.error('Error saving post:', error);
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
    return { success: false, error: `儲存文章失敗: ${errorMessage}` };
  }
}

/**
 * Deletes a blog post from Firestore.
 */
export async function deletePostAction(postId: string): Promise<PostActionResponse> {
  if (!postId) {
    return { success: false, error: '缺少文章 ID。' };
  }
  try {
    const post = await getPostById(postId);
    if (!post) {
      return { success: false, error: '找不到要刪除的文章。' };
    }

    await adminDb.collection('posts').doc(postId).delete();

    await CacheService.invalidateBlogListCache();
    await CacheService.invalidatePostCache(post.slug);

    revalidatePath('/website-cms/blog-management/posts');
    revalidatePath('/blog');

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
    return { success: false, error: `刪除文章失敗: ${errorMessage}` };
  }
}
