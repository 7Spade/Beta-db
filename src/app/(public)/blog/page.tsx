/**
 * @fileoverview Public Blog Listing Page
 * @description Fetches and displays all published blog posts.
 */
import { PublicBlogView } from '@/features/system-administration/website-cms/blog/views/PublicBlogView';
import { getPublishedPosts } from '@/shared/services/blog/blog.service';

export const revalidate = 3600; // Revalidate every hour

export default async function PublicBlogPage() {
  const posts = await getPublishedPosts();
  return <PublicBlogView posts={posts} />;
}
