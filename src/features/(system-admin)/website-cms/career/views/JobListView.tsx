
'use client';

import { Button } from '@/ui/button';
import { Briefcase, PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Placeholder for the job list view

export function JobListView() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">職位管理</h1>
          <p className="text-muted-foreground">管理招聘职位，包括发布、编辑和下架</p>
        </div>
        <Button asChild>
            <Link href="/website-cms/career-management/jobs/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                新增職位
            </Link>
        </Button>
      </div>
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">職位列表功能開發中</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          這裡將會顯示所有已建立的職位空缺。
        </p>
      </div>
    </div>
  );
}
