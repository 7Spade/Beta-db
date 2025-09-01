/**
 * @fileoverview Blog Post Detail Page (Admin)
 * @description This page is for viewing the details of a single blog post from an admin's perspective.
 * In this new structure, this route is for viewing details, and a sub-route is for editing.
 */
import { BlogDetailView } from '@/features/system-administration/website-cms/blog/views/BlogDetailView';
import { getPostById } from '@/shared/services/blog/blog.service';
import { Button } from '@/ui/button';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function AdminPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/website-cms/blog-management/posts/${post.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> 編輯此文章
          </Link>
        </Button>
      </div>
      <BlogDetailView post={post} />
    </div>
  );
}
