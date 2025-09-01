/**
 * @fileoverview Edit Blog Post Page
 * @description Fetches a post's data on the server and passes it to the form view for editing.
 */
import { BlogFormView } from '@/features/website-cms/blog/views/BlogFormView';
import { getPostById } from '@/shared/services/blog/blog.service';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return <BlogFormView post={post} />;
}
