import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Calendar } from 'lucide-react';
import { Badge } from '@/ui/badge';
import Image from 'next/image';

// 這是模擬的單篇文章資料
const mockPost = {
  title: '營建業的數位轉型：AI 與數據分析的未來',
  author: '陳小明',
  authorAvatar: 'https://placehold.co/128x128.png',
  publishedDate: '2024-08-25',
  category: '產業趨勢',
  tags: ['AI', '數位轉型', '營造科技'],
  imageUrl: 'https://placehold.co/1200x600.png',
  content: `
    <p>營造業長久以來被視為一個相對傳統、數位化程度較低的產業。然而，隨著人工智慧（AI）、物聯網（IoT）和數據分析技術的成熟，這個古老的行業正迎來一場前所未有的數位變革。</p>
    <h2 class="text-2xl font-bold mt-8 mb-4">AI 在專案估算中的應用</h2>
    <p>傳統的專案估算依賴大量的人工經驗，不僅耗時，且容易出錯。透過機器學習模型分析歷史專案數據，AI 可以提供更精準的成本和時程預測，大幅降低超支風險。</p>
    <h2 class="text-2xl font-bold mt-8 mb-4">數據驅動的工地管理</h2>
    <p>透過在工地部署感測器和無人機，我們可以即時收集大量的數據，從進度追蹤、物料管理到安全監控，數據分析平台能夠將這些資訊轉化為可執行的洞察，幫助專案經理做出更明智的決策。</p>
  `,
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // 在真實應用中，您會使用 params.slug 從後端獲取對應的文章資料
  const post = mockPost;

  return (
    <article className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4 mb-8 text-center">
        <div className="flex justify-center gap-2">
           <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorAvatar} data-ai-hint="person face" />
              <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedDate}>{post.publishedDate}</time>
          </div>
        </div>
      </div>

      <div className="overflow-hidden mb-8">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
          data-ai-hint="construction technology"
        />
      </div>
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

       <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
    </article>
  );
}
