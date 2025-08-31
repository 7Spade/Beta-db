
'use client';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { formatDate } from '@/utils';
import { deletePost } from '@root/src/features/(system-admin)/website-cms/blog/actions/posts.actions';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Skeleton } from '@/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  status: '已發布' | '草稿' | '已封存';
  createdAt: Date;
  authorName?: string;
}

export function PostsListView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const postsCollection = collection(firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          status: data.status,
          createdAt: (data.createdAt as Timestamp)?.toDate(),
          authorName: data.authorName,
        }
      }) as Post[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("獲取文章時發生錯誤: ", error);
      toast({ title: "錯誤", description: "無法載入文章列表。", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleDeletePost = async (postId: string) => {
    const result = await deletePost(postId);
    if (result.success) {
      toast({ title: "文章已刪除" });
    } else {
      toast({ title: "刪除失敗", description: result.error, variant: "destructive" });
    }
  };

  const getStatusVariant = (status: Post['status']) => {
    switch (status) {
      case '已發布': return 'default';
      case '草稿': return 'secondary';
      case '已封存': return 'outline';
      default: return 'default';
    }
  };

  const LoadingSkeleton = () => (
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
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
          <p className="text-muted-foreground">建立、編輯和管理您的所有部落格文章。</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/posts/create">
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
          {loading ? <LoadingSkeleton /> : (
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
                      onClick={() => router.push(`/admin/blog/posts/${post.id}`)}
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
                    <TableCell>
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">切換選單</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => router.push(`/admin/blog/posts/${post.id}`)}>
                              編輯
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
                            <AlertDialogAction onClick={() => handleDeletePost(post.id)}>繼續刪除</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && posts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">尚無任何文章。點擊「新增文章」開始創作。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
