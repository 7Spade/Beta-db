'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Skeleton } from '@/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { formatDate } from '@root/src/shared/utils';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePostAction } from '../actions/blog.actions';
import { useBlogList } from '../hooks/use-blog-list';

export function BlogListView() {
  const { posts, loading, error } = useBlogList();
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (postId: string) => {
    const result = await deletePostAction(postId);
    if (result.success) {
      toast({ title: '成功', description: '文章已刪除。' });
    } else {
      toast({ title: '錯誤', description: result.error, variant: 'destructive' });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case '已發布': return 'default';
      case '草稿': return 'secondary';
      case '已封存': return 'outline';
      default: return 'default';
    }
  };

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (error) {
    return <div className="text-destructive">錯誤: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
          <p className="text-muted-foreground">建立、編輯和管理您的所有部落格文章。</p>
        </div>
        <Button asChild>
          <Link href="/website-cms/blog-management/posts/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            新增文章
          </Link>
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
                <TableHead>作者</TableHead>
                <TableHead>建立日期</TableHead>
                <TableHead><span className="sr-only">操作</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell
                    className="font-medium hover:text-primary cursor-pointer"
                    onClick={() => router.push(`/website-cms/blog-management/posts/${post.id}/edit`)}
                  >
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.authorName || 'N/A'}</TableCell>
                  <TableCell>{formatDate(post.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">操作選單</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/website-cms/blog-management/posts/${post.id}/edit`)}>
                            編輯
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => window.open(`/blog/${post.slug}`, '_blank')}>
                            預覽
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              刪除
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>確定要刪除「{post.title}」嗎？</AlertDialogTitle>
                          <AlertDialogDescription>此操作無法復原，將永久刪除此篇文章。</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)}>繼續刪除</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!loading && posts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              尚無任何文章。
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
