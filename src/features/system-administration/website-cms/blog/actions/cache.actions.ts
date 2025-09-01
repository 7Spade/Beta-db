/**
 * @fileoverview Blog Cache Actions
 * @description Server actions for manually managing blog-related caches.
 */
'use server';

import * as CacheService from '@/lib/services/blog/cache.service';
import { revalidatePath } from 'next/cache';

/**
 * Manually triggers a revalidation of all public blog pages.
 */
export async function revalidateBlogPages(): Promise<{ success: boolean }> {
  try {
    // Invalidate data caches
    await CacheService.invalidateBlogListCache();

    // Revalidate Next.js paths
    revalidatePath('/blog', 'layout'); // Revalidates list and all post pages

    console.log('Blog pages revalidated.');
    return { success: true };
  } catch (error) {
    console.error('Error revalidating blog pages:', error);
    return { success: false };
  }
}
