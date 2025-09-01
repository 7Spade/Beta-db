import type { Post } from '@/features/system-administration/website-cms/blog/types/blog.types';
import { Badge } from '@/ui/badge';
import { CardDescription, CardTitle } from '@/ui/card';
import { formatDate } from '@root/src/shared/utils';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block flex-shrink-0">
        <Image
          className="h-56 w-full object-cover"
          src={post.imageUrl || 'https://placehold.co/600x400.png'}
          alt={post.title}
          width={600}
          height={400}
          data-ai-hint="blog post"
        />
      </Link>
      <div className="flex-1 bg-background p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Badge variant="secondary">{post.category || '未分類'}</Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
          </div>
          <Link href={`/blog/${post.slug}`} className="block mt-2">
            <CardTitle className="text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </CardTitle>
            <CardDescription className="mt-3 text-base text-muted-foreground line-clamp-3">
              {post.excerpt}
            </CardDescription>
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{post.authorName}</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
            繼續閱讀 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
