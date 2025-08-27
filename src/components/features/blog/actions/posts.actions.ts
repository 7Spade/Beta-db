
'use server';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { collection, doc, addDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

interface PostActionResponse {
  success: boolean;
  error?: string;
  postId?: string;
}

const postSchema = z.object({
    title: z.string().min(3, '標題至少需要 3 個字元。'),
    content: z.string().min(10, '內容至少需要 10 個字元。'),
    status: z.enum(['草稿', '已發布', '已封存']),
    slug: z.string().min(3, 'Slug 至少需要 3 個字元。'),
    excerpt: z.string().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
});

export type PostFormValues = z.infer<typeof postSchema>;

/**
 * Saves a blog post to Firestore (creates or updates).
 */
export async function savePost(data: PostFormValues, postId?: string | null): Promise<PostActionResponse> {
  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.errors.map(e => e.message).join(', ') };
  }

  try {
    if (postId) {
      // Update existing post
      const postRef = doc(firestore, 'posts', postId);
      await setDoc(postRef, { 
        ...validation.data, 
        updatedAt: serverTimestamp() 
      }, { merge: true });
    } else {
      // Create new post
      const collectionRef = collection(firestore, 'posts');
      const docRef = await addDoc(collectionRef, {
        ...validation.data,
        authorId: 'user-placeholder', // TODO: Replace with actual user ID
        authorName: 'Admin User', // TODO: Replace with actual user name
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      postId = docRef.id;
    }

    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${validation.data.slug}`);
    revalidatePath('/blog');
    
    return { success: true, postId: postId! };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
    return { success: false, error: `儲存文章失敗: ${errorMessage}` };
  }
}

/**
 * Deletes a blog post from Firestore.
 */
export async function deletePost(postId: string): Promise<PostActionResponse> {
    if (!postId) {
        return { success: false, error: '缺少文章 ID。' };
    }
    try {
        await deleteDoc(doc(firestore, 'posts', postId));
        revalidatePath('/admin/blog');
        revalidatePath('/blog');
        return { success: true };
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
        return { success: false, error: `刪除文章失敗: ${errorMessage}` };
    }
}
