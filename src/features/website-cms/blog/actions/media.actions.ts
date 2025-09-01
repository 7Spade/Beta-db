/**
 * @fileoverview Blog Media Server Actions
 * @description Handles media uploads specifically for the blog.
 */
'use server';

import * as MediaService from '@/shared/services/blog/media.service';

export type MediaUploadResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Uploads a blog image using the dedicated media service.
 * @param {FormData} formData - The form data containing the file to upload.
 * @returns {Promise<MediaUploadResponse>} The result of the upload operation.
 */
export async function uploadImageAction(formData: FormData): Promise<MediaUploadResponse> {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { success: false, error: '找不到檔案。' };
  }

  try {
    const result = await MediaService.uploadBlogImage(file);
    return { success: true, url: result.url };
  } catch (error) {
    console.error('Image upload failed:', error);
    const errorMessage = error instanceof Error ? error.message : '上傳失敗。';
    return { success: false, error: errorMessage };
  }
}
