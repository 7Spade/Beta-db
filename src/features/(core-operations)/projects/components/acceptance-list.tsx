'use client';

import { AcceptanceRecord } from '@/lib/types/types';
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
import { AcceptanceStatusBadge } from './acceptance-status-badge';
import { formatDate } from '@/lib/utils/utils';
import { Button } from '@/ui/button';

interface AcceptanceListProps {
  acceptances: AcceptanceRecord[];
}

export function AcceptanceList({ acceptances }: AcceptanceListProps) {
  if (acceptances.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium">尚無驗收單</h3>
        <p className="text-sm text-muted-foreground">
          建立任務並完成後，即可發起驗收。
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
              <TableHead>專案</TableHead>
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
                <TableCell>{record.projectName}</TableCell>
                <TableCell>{record.applicantName}</TableCell>
                <TableCell>{formatDate(record.submittedAt)}</TableCell>
                <TableCell>
                  <AcceptanceStatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    查看詳情
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
