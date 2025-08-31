
"use client";

import type { WorkItem } from '@/features/docu-parse/types';
import { exportToCSV, exportToJSON } from '@/features/docu-parse/utils';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { FileJson, FileText, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';


interface WorkItemsTableProps {
  initialData: WorkItem[];
  onDataChange: (data: WorkItem[]) => void;
}

export function WorkItemsTable({ initialData, onDataChange }: WorkItemsTableProps) {
  const [data, setData] = useState<WorkItem[]>(initialData.map(item => ({ ...item, total: item.quantity * item.unitPrice })));

  useEffect(() => {
    setData(initialData.map(item => ({ ...item, total: item.quantity * item.unitPrice })));
  }, [initialData]);

  const updateData = (newData: WorkItem[]) => {
    setData(newData);
    onDataChange(newData);
  }

  const handleInputChange = (index: number, field: keyof WorkItem, value: string | number) => {
    const newData = [...data];
    const updatedItem = { ...newData[index] };

    if (field === 'id' || field === 'name') {
      (updatedItem[field] as string) = String(value);
    } else if (field === 'quantity' || field === 'unitPrice') {
      const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      (updatedItem[field] as number) = numericValue;
    } else {
      (updatedItem[field] as number) = 0;
    }

    // Automatic calculation logic
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItem.total = parseFloat((updatedItem.quantity * updatedItem.unitPrice).toFixed(2));
    }

    newData[index] = updatedItem;
    updateData(newData);
  };

  const handleRemoveRow = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    updateData(newData);
  };

  const handleAddRow = () => {
    const newRow: WorkItem = {
      id: (data.length + 1).toString(),
      name: '新項目',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    updateData([...data, newRow]);
  };

  const totalAmount = data.reduce((sum, item) => sum + (item.total || 0), 0);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">文件中未提取到任何工作項目。</p>
        <p className="text-muted-foreground mt-2">您可以在下方手動新增項目。</p>
        <Button onClick={handleAddRow} className="mt-4" variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          新增項目
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%] text-center">項次</TableHead>
              <TableHead className="w-[10%] text-center">佔比</TableHead>
              <TableHead className="w-[40%]">品名/說明</TableHead>
              <TableHead className="text-right w-[120px]">數量</TableHead>
              <TableHead className="text-right w-[150px]">單價</TableHead>
              <TableHead className="text-right w-[150px]">總價</TableHead>
              <TableHead className="w-12 p-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="p-1">
                  <Input
                    value={row.id}
                    onChange={(e) => handleInputChange(index, 'id', e.target.value)}
                    className="text-center bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">
                    {totalAmount > 0 ? (((row.total || 0) / totalAmount) * 100).toFixed(1) : '0.0'}%
                  </Badge>
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    value={row.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.unitPrice}
                    onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="number"
                    value={row.total}
                    readOnly
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring text-muted-foreground"
                    step="0.01"
                  />
                </TableCell>
                <TableCell className="p-1 text-center">
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveRow(index)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    <span className="sr-only">移除此行</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleAddRow} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          新增一列
        </Button>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">總金額</p>
          <p className="text-2xl font-bold">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex justify-start items-center mt-6">
        <div className="flex gap-2">
          <Button onClick={() => exportToCSV(data)} variant="secondary">
            <FileText className="mr-2 h-4 w-4" />
            匯出 CSV
          </Button>
          <Button onClick={() => exportToJSON(data)} variant="secondary">
            <FileJson className="mr-2 h-4 w-4" />
            匯出 JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
