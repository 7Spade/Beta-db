/**
 * @fileoverview Blog Media Service
 * @description Handles media uploads related to blog posts.
 */
'use server';

import { adminStorage } from '@/lib/db/firebase-admin/firebase-admin';

/**
 * Uploads an image for a blog post.
 * @param {File} file - The image file to upload.
 * @returns {Promise<{ url: string }>} A promise that resolves to the public URL of the uploaded image.
 */
export async function uploadBlogImage(file: File): Promise<{ url: string }> {
  const bucket = adminStorage.bucket();
  const filePath = `blog-media/${Date.now()}-${file.name}`;
  const fileUpload = bucket.file(filePath);
  
  const buffer = Buffer.from(await file.arrayBuffer());

  await fileUpload.save(buffer, {
    contentType: file.type,
    public: true, // Make the file publicly accessible
  });

  return { url: fileUpload.publicUrl() };
}
