/**
 * @fileoverview Edit Blog Post Page
 * @description Fetches a post's data on the server and passes it to the form view for editing.
 */
import { getPostById } from '@/lib/services/blog/blog.service';
import { notFound } from 'next/navigation';
import { BlogFormView } from '@/features/(system-admin)/website-cms/blog/views/BlogFormView';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return <BlogFormView post={post} />;
}
