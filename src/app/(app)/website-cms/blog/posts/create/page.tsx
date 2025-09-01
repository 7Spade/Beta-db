/**
 * @fileoverview Create Blog Post Page
 * @description The entry point for creating a new blog post. It renders the form view.
 */
import { BlogFormView } from '@/features/website-cms/blog/views/BlogFormView';

export default function CreatePostPage() {
  return <BlogFormView post={null} />;
}
