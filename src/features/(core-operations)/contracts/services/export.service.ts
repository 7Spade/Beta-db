/**
 * @fileoverview 匯出功能服務
 */
import type { Contract } from '@/features/(core-operations)/contracts/types';
import { toDate } from '@/lib/utils/date-utils';
import { formatDate } from '@/lib/utils/utils';

export const exportService = {
  exportContractsToCSV: (contracts: Contract[]) => {
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
  },
};
