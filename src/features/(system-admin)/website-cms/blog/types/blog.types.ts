/**
 * @fileoverview Blog Type Definitions
 * @description Defines the core TypeScript types for the blog feature.
 */

export type PostStatus = '草稿' | '已發布' | '已封存';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status: PostStatus;
  category?: string;
  tags?: string[];
  authorId: string;
  authorName: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
