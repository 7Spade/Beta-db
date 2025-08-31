'use client';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { approveUser, rejectUser } from '@root/src/features/(system-admin)/admin/actions/user-actions';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UserProfile {
  id: string;
  displayName?: string;
  email?: string;
  role?: 'Admin' | 'Member';
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
}

export function UserManagementView() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          displayName: data.displayName,
          email: data.email,
          role: data.role,
          status: data.status,
          createdAt: data.createdAt?.toDate?.(),
        } as UserProfile;
      });
      setUsers(usersData);
      setLoading(false);
    }, () => {
      toast({ title: '錯誤', description: '無法載入待審核用戶列表。', variant: 'destructive' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleApprove = async (userId: string) => {
    const result = await approveUser(userId);
    if (result.success) {
      toast({ title: '用戶已核准' });
    } else {
      toast({ title: '操作失敗', description: result.error, variant: 'destructive' });
    }
  };

  const handleReject = async (userId: string) => {
    const result = await rejectUser(userId);
    if (result.success) {
      toast({ title: '用戶已拒絕' });
    } else {
      toast({ title: '操作失敗', description: result.error, variant: 'destructive' });
    }
  };

  const LoadingSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名稱</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>註冊時間</TableHead>
          <TableHead>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell className="flex gap-2"><Skeleton className="h-8 w-16" /><Skeleton className="h-8 w-16" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">使用者管理</h1>
        <p className="text-muted-foreground">審核新註冊的使用者帳號。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>待審核使用者</CardTitle>
          <CardDescription>以下是等待您核准的新使用者列表。</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? <LoadingSkeleton /> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名稱</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>註冊時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName || user.email || user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleReject(user.id)}>拒絕</Button>
                      <Button size="sm" onClick={() => handleApprove(user.id)}>核准</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && users.length === 0 && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">目前沒有待審核的使用者。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
