'use client';

import { useState, useEffect, type FC } from 'react';
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
import { Badge } from '@/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Partner, Contract } from '@/lib/types/types';
import { firestore } from '@/lib/db/firebase-client/firebase-client';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { formatDate } from '@/lib/utils/utils';
import { toDate } from '@/lib/utils/date-utils';
import Link from 'next/link';

interface ContractsTabProps {
  partner: Partner;
}

export const ContractsTab: FC<ContractsTabProps> = ({ partner }) => {
  const [relatedContracts, setRelatedContracts] = useState<Contract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!partner.name) return;
      setIsLoadingContracts(true);
      try {
        const contractsRef = collection(firestore, 'contracts');
        const q = query(contractsRef, where('client', '==', partner.name));
        const querySnapshot = await getDocs(q);
        const contractsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startDate: toDate(data.startDate),
            endDate: toDate(data.endDate),
          } as Contract;
        });
        setRelatedContracts(contractsList);
      } catch (error) {
        console.error('獲取相關合約時發生錯誤：', error);
      } finally {
        setIsLoadingContracts(false);
      }
    };

    fetchContracts();
  }, [partner.name]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>合約</CardTitle>
        <CardDescription>與 {partner.name} 相關的合約。</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingContracts ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="ml-2">正在載入合約...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>合約名稱</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>開始日期</TableHead>
                <TableHead>結束日期</TableHead>
                <TableHead className="text-right">總價值</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatedContracts.length > 0 ? (
                relatedContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/contracts`}
                        className="hover:underline text-primary"
                      >
                        {contract.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          contract.status === '啟用中' ? 'default' : 'secondary'
                        }
                      >
                        {contract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(contract.startDate)}</TableCell>
                    <TableCell>{formatDate(contract.endDate)}</TableCell>
                    <TableCell className="text-right">
                      ${contract.totalValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    找不到與此夥伴相關的合約。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
