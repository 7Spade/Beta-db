'use client';

import { ContractStatusBadge } from '@/features/(core-operations)/contracts/components';
import { ContractDetailsSheet } from '@/features/(core-operations)/contracts/sheets';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { toDate } from '@/lib/utils/date-utils';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { formatDate } from '@/utils';
import { Download, Eye, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

interface ContractsTableProps {
  contracts: Contract[];
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const [selectedContract, setSelectedContract] =
    React.useState<Contract | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedContract(null);
    }
  };

  const handleExport = () => {
    const headers = [
      'ID',
      '名稱',
      '承包商',
      '客戶',
      '開始日期',
      '結束日期',
      '總價值',
      '狀態',
    ];
    const rows = contracts.map((c) =>
      [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.contractor.replace(/"/g, '""')}"`,
        `"${c.client.replace(/"/g, '""')}"`,
        formatDate(toDate(c.startDate)),
        formatDate(toDate(c.endDate)),
        c.totalValue,
        c.status,
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    }); // Add BOM for Excel
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contracts_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>合約</CardTitle>
            <CardDescription>
              所有進行中和已完成的營造合約總覽。
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            匯出 CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>合約名稱</TableHead>
                <TableHead className="hidden md:table-cell">承包商</TableHead>
                <TableHead className="hidden lg:table-cell">結束日期</TableHead>
                <TableHead>價值</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>
                  <span className="sr-only">操作</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow
                  key={contract.id}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(contract)}
                >
                  <TableCell className="font-medium">{contract.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {contract.contractor}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(toDate(contract.endDate))}
                  </TableCell>
                  <TableCell>${contract.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <ContractStatusBadge status={contract.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">切換選單</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          onSelect={() => handleViewDetails(contract)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          查看詳情
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedContract && (
        <ContractDetailsSheet
          contract={selectedContract}
          isOpen={isSheetOpen}
          onOpenChange={handleSheetOpenChange}
        />
      )}
    </>
  );
}
