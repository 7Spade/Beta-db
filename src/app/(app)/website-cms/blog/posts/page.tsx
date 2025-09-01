/**
 * @fileoverview Blog Posts Management Page
 * @description This is the entry point for the admin page that lists all blog posts.
 */
import { BlogListView } from '@/features/website-cms/blog/views/BlogListView';

export default function AdminBlogPostsPage() {
  return <BlogListView />;
}
