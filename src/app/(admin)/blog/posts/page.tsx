import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// 這是模擬的部落格文章資料
const mockPosts = [
  { id: '1', title: '營建業的數位轉型之路', status: '已發布', createdAt: '2024-08-25' },
  { id: '2', title: 'AI 如何協助專案估算', status: '草稿', createdAt: '2024-08-24' },
  { id: '3', title: '5 個提升工地安全的技巧', status: '已封存', createdAt: '2024-08-20' },
];

export default function AdminBlogPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
          <p className="text-muted-foreground">建立、編輯和管理您的所有部落格文章。</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          新增文章
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>所有文章</CardTitle>
          <CardDescription>這裡是您所有的部落格文章列表。</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>標題</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>建立日期</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === '已發布' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.createdAt}</TableCell>
                  <TableCell>
                    <Button variant="link" size="sm">編輯</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
