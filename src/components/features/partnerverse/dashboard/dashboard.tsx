
/**
 * @project Beta-db Integrated Platform - 統一整合平台 PartnerVerse 儀表板
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 * 
 * @fileoverview PartnerVerse 儀表板元件
 * @description 顯示合作夥伴相關統計數據，包括總數、各類別分佈及近期活動。
 */
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Partner } from '@/lib/types';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { DashboardStats, type StatCardData } from '@/components/features/dashboard/dashboard-stats';

interface DashboardProps {
    partners?: Partner[];
}

export const Dashboard: FC<DashboardProps> = ({ partners: initialPartners }) => {
    const [partners, setPartners] = useState<Partner[]>(initialPartners || []);
    const [isLoading, setIsLoading] = useState(!initialPartners);
    const router = useRouter();

    useEffect(() => {
        if (!initialPartners) {
            setIsLoading(true);
            const partnersCollection = collection(db, 'partners');
            const unsubscribe = onSnapshot(partnersCollection, (snapshot) => {
                const partnerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Partner[];
                setPartners(partnerList);
                setIsLoading(false);
            }, (error) => {
                console.error("為儀表板獲取合作夥伴時發生錯誤：", error);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
          setPartners(initialPartners);
          setIsLoading(false);
        }
    }, [initialPartners]);
    
    if (isLoading) {
        return (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Skeleton className="h-[125px] w-full" />
            <Skeleton className="h-[125px] w-full" />
            <Skeleton className="h-[125px] w-full" />
            <Skeleton className="h-[125px] w-full" />
          </div>
        );
    }

    const totalPartners = partners.length;
    const activePartners = partners.filter(p => p.status === '啟用中').length;
    const pendingPartners = partners.filter(p => p.status === '待審核').length;
    const totalTransactions = partners.reduce((sum, p) => sum + (p.transactions?.length || 0), 0);

    const stats: StatCardData[] = [
        {
            title: '總合作夥伴數',
            value: totalPartners.toString(),
            description: '系統中所有合作夥伴',
            icon: Users
        },
        {
            title: '活躍合作夥伴',
            value: activePartners.toString(),
            description: totalPartners > 0 ? `${((activePartners/totalPartners) * 100).toFixed(0)}% 的佔比` : '',
            icon: CheckCircle
        },
        {
            title: '待審批合作夥伴',
            value: pendingPartners.toString(),
            description: '等待批准',
            icon: Clock
        },
        {
            title: '總交易量',
            value: totalTransactions.toString(),
            description: '所有合作夥伴的總和',
            icon: Users
        }
    ];

  return <DashboardStats stats={stats} />;
};
