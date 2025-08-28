'use server';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Cpu, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import type { AiTokenLogRow } from '@/lib/db/supabase';

type ViewRow = {
  id: string;
  flowName: string;
  totalTokens: number;
  status: 'succeeded' | 'failed';
  timestamp: Date | null;
};

export async function AiUsageLog() {
  const supabase = getSupabaseAdmin();
  
  const { data: docs, error } = await supabase
    .from('ai_token_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Failed to fetch AI token logs:', error);
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            載入 AI 使用紀錄時發生錯誤。
          </div>
        </CardContent>
      </Card>
    );
  }

  const logs: ViewRow[] = (docs as AiTokenLogRow[] || []).map((d) => ({
    id: d.id,
    flowName: d.flow_name,
    totalTokens: d.total_tokens,
    status: d.status,
    timestamp: d.timestamp ? new Date(d.timestamp) : null,
  }));

  const StatusIndicator = ({ status }: { status: 'succeeded' | 'failed' }) => {
    if (status === 'succeeded') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-6 w-6" />
          <span>近期 AI Token 消耗紀錄</span>
        </CardTitle>
        <CardDescription>最近 10 次 AI 流程調用紀錄。</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>流程名稱</TableHead>
              <TableHead>時間</TableHead>
              <TableHead className="text-right">Token 數量</TableHead>
              <TableHead className="text-center">狀態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.flowName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {log.timestamp ? formatDistanceToNow(log.timestamp, { addSuffix: true, locale: zhTW }) : 'N/A'}
                </TableCell>
                <TableCell className="text-right font-mono">{log.totalTokens.toLocaleString()}</TableCell>
                <TableCell className="flex justify-center items-center pt-4">
                  <StatusIndicator status={log.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {logs.length === 0 && (
          <div className="text-center text-muted-foreground py-8">尚無任何 AI 使用紀錄。</div>
        )}
      </CardContent>
    </Card>
  );
}
