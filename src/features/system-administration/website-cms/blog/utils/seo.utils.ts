/**
 * @fileoverview SEO Utility Functions
 * @description Provides helper functions for generating SEO-related metadata.
 */

import type { Post } from '../types/blog.types';

/**
 * Generates metadata for a single blog post page.
 * @param {Post} post - The post object.
 * @returns {object} An object containing title, description, and Open Graph metadata.
 */
export function generatePostSeo(post: Post) {
  const title = post.title;
  const description = post.excerpt || post.content.substring(0, 150);
  const imageUrl = post.imageUrl || 'https://your-default-image.com/default.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article' as const,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [imageUrl],
    },
  };
}
