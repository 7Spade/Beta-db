/**
 * @fileoverview Public Single Blog Post Page
 * @description Fetches and displays a single published blog post by its slug.
 */
import { generatePostSeo } from '@/features/website-cms/blog/utils/seo.utils';
import { BlogDetailView } from '@/features/website-cms/blog/views/BlogDetailView';
import { getPostBySlug, getPublishedPosts } from '@/shared/services/blog/blog.service';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
