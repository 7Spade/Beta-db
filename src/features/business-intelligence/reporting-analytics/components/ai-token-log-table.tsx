
'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table'
import { createClient } from '@root/src/features/integrations/database/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { CheckCircle, Cpu, XCircle } from 'lucide-react'
import { cookies } from 'next/headers'

// 定义AI Token日志类型
interface AiTokenLog {
  id: string;
  flow_name: string;
  timestamp: string;
  total_tokens: number;
  status: string;
}

// 极简配置：自动显示 AI Token 消耗记录
export async function AiTokenLogTable() {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // 自动获取最近的日志记录
    const { data: logs } = await supabase
      .from('ai_token_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10)

    const StatusIndicator = ({ status }: { status: string }) => {
      if (status === 'succeeded') {
        return <CheckCircle className="h-5 w-5 text-green-500" />
      }
      return <XCircle className="h-5 w-5 text-destructive" />
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <span>AI Token 消耗紀錄</span>
          </CardTitle>
          <CardDescription>最近 10 次 AI 流程調用紀錄</CardDescription>
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
              {(logs || []).map((log: AiTokenLog) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.flow_name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.timestamp ?
                      formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: zhTW }) :
                      'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {log.total_tokens?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="flex justify-center items-center pt-4">
                    <StatusIndicator status={log.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(!logs || logs.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              尚無任何 AI 使用紀錄
            </div>
          )}
        </CardContent>
      </Card>
    )
  } catch (e) {
    const error = e as Error;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-6 w-6" />
            <span>AI Token 消耗紀錄</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            載入 AI 使用紀錄時發生錯誤: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }
}
