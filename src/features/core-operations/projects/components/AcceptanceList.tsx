'use client';

import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { approveAcceptanceWorkflow } from '../actions/workflow.actions';
import type { AcceptanceRecord } from '../types';
import { formatDate } from '../utils';
import { AcceptanceStatusBadge } from './AcceptanceStatusBadge';

interface AcceptanceListProps {
  acceptances: AcceptanceRecord[];
}

export function AcceptanceList({ acceptances }: AcceptanceListProps) {
  const { toast } = useToast();

  const handleApprove = async (acceptanceId: string) => {
    // In a real app, we'd get the current admin's ID
    const adminId = 'admin_user_placeholder';
    const result = await approveAcceptanceWorkflow({ acceptanceId, adminId });

    if (result.success) {
      toast({
        title: '成功',
        description: '驗收單已批准，相關任務進度已更新。',
      });
    } else {
      toast({
        variant: 'destructive',
        title: '操作失敗',
        description: result.error,
      });
    }
  };

  if (acceptances.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">尚無驗收單</h3>
        <p className="text-sm text-muted-foreground">
          當有進度被回報時，對應的驗收單將會顯示在這裡。
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>驗收單列表</CardTitle>
        <CardDescription>所有已提交的工程驗收請求。</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>標題</TableHead>
              <TableHead>專案 / 任務</TableHead>
              <TableHead>提交數量</TableHead>
              <TableHead>申請人</TableHead>
              <TableHead>提交日期</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acceptances.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.title}</TableCell>
                <TableCell>
                  <div>{record.projectName}</div>
                  <div className="text-xs text-muted-foreground">
                    {record.taskId}
                  </div>
                </TableCell>
                <TableCell>{record.submittedQuantity}</TableCell>
                <TableCell>{record.applicantName}</TableCell>
                <TableCell>{formatDate(record.submittedAt as Date)}</TableCell>
                <TableCell>
                  <AcceptanceStatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                  {record.status === '待審批' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(record.id)}
                    >
                      批准
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      查看
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
