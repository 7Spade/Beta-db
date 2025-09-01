/**
 * @fileoverview Public Single Blog Post Page
 * @description Fetches and displays a single published blog post by its slug.
 */
import { getPostBySlug, getPublishedPosts } from '@/lib/services/blog/blog.service';
import { generatePostSeo } from '@/features/system-administration/website-cms/blog/utils/seo.utils';
import { notFound } from 'next/navigation';
import { BlogDetailView } from '@/features/system-administration/website-cms/blog/views/BlogDetailView';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: '找不到文章',
    };
  }
  return generatePostSeo(post);
}

// Statically generate routes for all published posts
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} />;
}
