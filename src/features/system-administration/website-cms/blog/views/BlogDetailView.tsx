// This view would be for the admin preview of a blog post
import type { Post } from '../types/blog.types';
import { Badge } from '@/ui/badge';
import { formatDate } from '@/utils';
import Image from 'next/image';

interface BlogDetailViewProps {
  post: Post;
}

export function BlogDetailView({ post }: BlogDetailViewProps) {
  return (
    <article className="container mx-auto max-w-3xl py-12">
      <div className="space-y-4 mb-8 text-center">
        <div className="flex justify-center gap-2">
           <Badge variant="secondary">{post.category || '未分類'}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <p>作者: {post.authorName}</p>
          <p>發布於: {formatDate(post.publishedAt)}</p>
        </div>
      </div>

      {post.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }} // In a real app, use a proper Markdown renderer to prevent XSS
      />

       <div className="mt-8 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
    </article>
  );
}
