import { BlogList } from '../components/BlogList';
import type { Post } from '../types/blog.types';

interface PublicBlogViewProps {
  posts: Post[];
}

export function PublicBlogView({ posts }: PublicBlogViewProps) {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          我們的部落格
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          探索營建產業的最新趨勢、技術應用與實務分享。
        </p>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
