'use client';

import { ContractStatusBadge } from '@/features/(core-operations)/contracts/components';
import { ReceiptProgress } from '@/features/(core-operations)/contracts/components/receipt-progress';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { formatDate } from '@/lib/utils/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Progress } from '@/ui/progress';
import { ScrollArea } from '@/ui/scroll-area';
import { Separator } from '@/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { useMemo } from 'react';

interface ContractDetailsSheetProps {
  contract: Contract;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ContractDetailsSheet({
  contract,
  isOpen,
  onOpenChange,
}: ContractDetailsSheetProps) {
  const totalPaid = contract.payments
    .filter((p) => p.status === '已付款')
    .reduce((acc, p) => acc + p.amount, 0);
  const paymentProgress =
    contract.totalValue > 0 ? (totalPaid / contract.totalValue) * 100 : 0;

  // 將合約的文字版「工作範疇」解析為結構化清單
  const scopeItems = useMemo(() => {
    const lines = (contract.scope || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const items: Array<{
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    const itemLineRegex =
      /^([^.]+)\.\s*(.+?)（\s*數量：([\d.]+)\s*，\s*單價：([\d.]+)\s*，\s*小計：([\d.]+)\s*）$/;

    for (const line of lines) {
      const match = line.match(itemLineRegex);
      if (match) {
        const id = String(match[1]).trim();
        const name = String(match[2]).trim();
        const quantity = Number(match[3]);
        const unitPrice = Number(match[4]);
        const subtotal = Number(match[5]);
        if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice)) {
          items.push({
            id,
            name,
            quantity,
            unitPrice,
            subtotal: Number.isNaN(subtotal) ? quantity * unitPrice : subtotal,
          });
        }
      }
    }

    return items;
  }, [contract.scope]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-2xl">
        <ScrollArea className="h-full pr-6">
          <SheetHeader className="mb-4">
            <SheetTitle>{contract.name}</SheetTitle>
            <SheetDescription>
              {contract.customId || contract.id} - {contract.client}
            </SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="details">詳細資料</TabsTrigger>
              <TabsTrigger value="payments">付款</TabsTrigger>
              <TabsTrigger value="receipts">收款</TabsTrigger>
              <TabsTrigger value="changes">變更單</TabsTrigger>
              <TabsTrigger value="history">歷史紀錄</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        承包商
                      </h3>
                      <p className="font-semibold">{contract.contractor}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        客戶
                      </h3>
                      <p className="font-semibold">{contract.client}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        開始日期
                      </h3>
                      <p className="font-semibold">
                        {formatDate(
                          contract.startDate instanceof Date
                            ? contract.startDate
                            : contract.startDate?.toDate()
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        結束日期
                      </h3>
                      <p className="font-semibold">
                        {formatDate(
                          contract.endDate instanceof Date
                            ? contract.endDate
                            : contract.endDate?.toDate()
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        總價值
                      </h3>
                      <p className="font-semibold">
                        ${contract.totalValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        狀態
                      </h3>
                      <ContractStatusBadge status={contract.status} />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      工作範疇
                    </h3>
                    <div className="mt-2 space-y-2">
                      {scopeItems.length > 0 ? (
                        scopeItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border bg-card p-2 pl-3"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 flex items-center justify-center text-xs rounded bg-muted text-muted-foreground">
                                {item.id}
                              </div>
                              <div className="font-medium">{item.name}</div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div>
                                數量:{' '}
                                <span className="font-semibold text-foreground">
                                  {item.quantity}
                                </span>
                              </div>
                              <div>
                                單價:{' '}
                                <span className="font-semibold text-foreground">
                                  ${item.unitPrice.toLocaleString()}
                                </span>
                              </div>
                              <div className="rounded border px-2 py-0.5 text-foreground">
                                小計: ${item.subtotal.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">
                          {contract.scope}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>付款追蹤</CardTitle>
                  <CardDescription>
                    所有付款請求及其狀態的紀錄。
                  </CardDescription>
                  <div className="pt-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        總付款金額: ${totalPaid.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium">
                        ${contract.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={paymentProgress}
                      aria-label={`${paymentProgress.toFixed(0)}% 已付款`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>金額</TableHead>
                        <TableHead>請求日期</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>付款日期</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.payments.length > 0 ? (
                        contract.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>
                              ${payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {formatDate(
                                payment.requestDate instanceof Date
                                  ? payment.requestDate
                                  : payment.requestDate?.toDate()
                              )}
                            </TableCell>
                            <TableCell>
                              <ContractStatusBadge
                                status={
                                  payment.status as
                                    | '啟用中'
                                    | '已完成'
                                    | '暫停中'
                                    | '已終止'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {payment.paidDate
                                ? formatDate(
                                    payment.paidDate instanceof Date
                                      ? payment.paidDate
                                      : payment.paidDate?.toDate()
                                  )
                                : '未付款'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                            尚無付款紀錄
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="receipts" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>收款追蹤</CardTitle>
                  <CardDescription>
                    所有收款請求及其狀態的紀錄。
                  </CardDescription>
                  <div className="pt-2">
                    <ReceiptProgress
                      receipts={contract.receipts || []}
                      totalValue={contract.totalValue}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>金額</TableHead>
                        <TableHead>請求日期</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>收款日期</TableHead>
                        <TableHead>發票號碼</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.receipts && contract.receipts.length > 0 ? (
                        contract.receipts.map((receipt) => (
                          <TableRow key={receipt.id}>
                            <TableCell>
                              ${receipt.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {formatDate(
                                receipt.requestDate instanceof Date
                                  ? receipt.requestDate
                                  : receipt.requestDate?.toDate()
                              )}
                            </TableCell>
                            <TableCell>
                              <ContractStatusBadge
                                status={
                                  receipt.status as
                                    | '啟用中'
                                    | '已完成'
                                    | '暫停中'
                                    | '已終止'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {receipt.receivedDate
                                ? formatDate(
                                    receipt.receivedDate instanceof Date
                                      ? receipt.receivedDate
                                      : receipt.receivedDate?.toDate()
                                  )
                                : '未收款'}
                            </TableCell>
                            <TableCell>
                              {receipt.invoiceNumber || '-'}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24">
                            尚無收款紀錄
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="changes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>變更單</CardTitle>
                  <CardDescription>合約修改與修訂的管理。</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>標題</TableHead>
                        <TableHead>日期</TableHead>
                        <TableHead>狀態</TableHead>
                        <TableHead>成本影響</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.changeOrders.length > 0 ? (
                        contract.changeOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              {order.title}
                            </TableCell>
                            <TableCell>
                              {formatDate(
                                order.date instanceof Date
                                  ? order.date
                                  : order.date?.toDate()
                              )}
                            </TableCell>
                            <TableCell>
                              <ContractStatusBadge
                                status={
                                  order.status as
                                    | '啟用中'
                                    | '已完成'
                                    | '暫停中'
                                    | '已終止'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              ${order.impact.cost.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center h-24">
                            尚無變更單紀錄
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>版本歷史</CardTitle>
                  <CardDescription>合約版本的時間順序記錄。</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contract.versions.length > 0 ? (
                      contract.versions.map((version, index) => (
                        <div
                          key={version.version}
                          className="grid grid-cols-[auto_1fr] items-start gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              {version.version}
                            </div>
                            {index < contract.versions.length - 1 && (
                              <div className="h-10 w-px bg-border" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {formatDate(
                                version.date instanceof Date
                                  ? version.date
                                  : version.date?.toDate()
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {version.changeSummary}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        尚無版本紀錄
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
