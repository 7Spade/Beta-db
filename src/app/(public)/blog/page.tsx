/**
 * @fileoverview Public Blog Listing Page
 * @description Fetches and displays all published blog posts.
 */
import { getPublishedPosts } from '@/lib/services/blog/blog.service';
import { PublicBlogView } from '@/features/(system-admin)/website-cms/blog/views/PublicBlogView';

export const revalidate = 3600; // Revalidate every hour

export default async function PublicBlogPage() {
  const posts = await getPublishedPosts();
  return <PublicBlogView posts={posts} />;
}
