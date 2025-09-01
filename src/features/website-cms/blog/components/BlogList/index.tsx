import type { Post } from '@/features/website-cms/blog/types/blog.types';
import { BlogCard } from '../BlogCard';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold">尚無文章</h2>
        <p className="text-muted-foreground mt-2">目前還沒有任何已發布的文章。</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
