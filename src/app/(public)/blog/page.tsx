
import Link from 'next/link';
import { Card, CardDescription, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

// 這是模擬的部落格文章列表資料
const mockPosts = [
  {
    slug: 'digital-transformation-in-construction',
    title: '營建業的數位轉型：AI 與數據分析的未來',
    excerpt: '探討人工智慧和數據分析如何重塑傳統的營建業，從專案估算到工地管理，開啟一個更高效、更智能的新時代。',
    category: '產業趨勢',
    imageUrl: 'https://placehold.co/600x400.png',
    date: '2024-08-25',
  },
  {
    slug: 'ai-project-estimation',
    title: 'AI 如何協助專案估算，告別超支風險',
    excerpt: '傳統的專案估算依賴大量人工經驗，不僅耗時且容易出錯。了解如何運用 AI 為您的專案提供精準的成本和時程預測。',
    category: '技術應用',
    imageUrl: 'https://placehold.co/600x400.png',
    date: '2024-08-24',
  },
  {
    slug: '5-tips-for-safer-construction-sites',
    title: '5 個運用科技提升工地安全的實用技巧',
    excerpt: '安全是每個營造專案的重中之重。本文將介紹五種可以立即應用於您工地的科技工具與方法，有效降低意外發生率。',
    category: '實務分享',
    imageUrl: 'https://placehold.co/600x400.png',
    date: '2024-08-20',
  },
];

export default function BlogListPage() {
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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col overflow-hidden group">
            <div className="flex-shrink-0">
              <Image 
                className="h-48 w-full object-cover" 
                src={post.imageUrl} 
                alt={post.title} 
                width={600}
                height={400}
                data-ai-hint="construction technology" 
              />
            </div>
            <div className="flex-1 bg-background p-6 flex flex-col justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-primary">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <Link href={`/blog/${post.slug}`} className="block mt-2">
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-3 text-base text-muted-foreground">
                    {post.excerpt}
                  </CardDescription>
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {post.date}
                </p>
                <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                  繼續閱讀 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
