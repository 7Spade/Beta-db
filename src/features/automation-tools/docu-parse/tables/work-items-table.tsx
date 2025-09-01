
"use client";

import type { WorkItem } from '@/features/automation-tools/docu-parse/types';
import { exportToCSV, exportToJSON } from '@/features/automation-tools/docu-parse/utils';
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
  originalSubtotal?: number;
}

export function WorkItemsTable({ initialData, onDataChange, originalSubtotal }: WorkItemsTableProps) {
  const [data, setData] = useState<WorkItem[]>(initialData.map(item => ({ ...item, total: item.quantity * item.unitPrice, discount: item.discount || 0 })));

  useEffect(() => {
    setData(initialData.map(item => ({ ...item, total: (item.quantity * item.unitPrice) - (item.discount || 0), discount: item.discount || 0 })));
  }, [initialData]);

  const updateData = (newData: WorkItem[]) => {
    setData(newData);
    onDataChange(newData);
  }

  const handleInputChange = (index: number, field: keyof WorkItem, value: string) => {
    const newData = [...data];
    const updatedItem = { ...newData[index] };

    // 直接更新值，不立即转换
    (updatedItem[field] as any) = value;

    const quantity = parseFloat(String(updatedItem.quantity)) || 0;
    const unitPrice = parseFloat(String(updatedItem.unitPrice)) || 0;
    const discount = parseFloat(String(updatedItem.discount)) || 0;

    // 根据变动的栏位进行重新计算
    updatedItem.total = (quantity * unitPrice) - discount;
    
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
      discount: 0,
    };
    updateData([...data, newRow]);
  };

  const calculatedTotal = data.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalMismatch = typeof originalSubtotal === 'number' && Math.abs(originalSubtotal - calculatedTotal) > 0.01;

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
              <TableHead className="text-right w-[120px]">数量</TableHead>
              <TableHead className="text-right w-[150px]">單價</TableHead>
              <TableHead className="text-right w-[150px]">折扣</TableHead>
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
                    {calculatedTotal > 0 ? (((row.total || 0) / calculatedTotal) * 100).toFixed(1) : '0.0'}%
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
                    type="text"
                    value={row.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={row.unitPrice}
                    onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={row.discount || ''}
                    onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </TableCell>
                <TableCell className="p-1">
                  <Input
                    type="text"
                    value={row.total?.toFixed(2) || '0.00'}
                    readOnly
                    className="text-right bg-transparent border-0 h-9 focus-visible:ring-1 focus-visible:ring-ring"
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
        <div className="text-right space-y-2">
          {totalMismatch && (
            <div>
              <p className="text-xs text-muted-foreground">文件原始總計</p>
              <p className="text-lg font-semibold text-muted-foreground line-through">
                ${originalSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
          <div>
            <p className={`text-sm ${totalMismatch ? 'text-destructive' : 'text-muted-foreground'}`}>
              {totalMismatch ? '計算總和（與原始總計不符）' : '總金額'}
            </p>
            <p className={`text-2xl font-bold ${totalMismatch ? 'text-destructive' : ''}`}>
              ${calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
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
