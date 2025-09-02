/**
 * @fileoverview Engagements 主頁面
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EngagementProvider } from '@/features/core-operations/engagements';
import { EngagementListView, EngagementDashboard } from '@/features/core-operations/engagements';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, List, Plus } from 'lucide-react';

export default function EngagementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 從 URL 參數讀取初始狀態
  useEffect(() => {
    const tab = searchParams.get('tab');
    const create = searchParams.get('create');
    
    if (tab === 'list') {
      setActiveTab('list');
    }
    
    if (create === 'true') {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const handleCreateEngagement = (engagementId: string) => {
    // 創建成功後跳轉到詳細頁面
    setShowCreateForm(false);
    router.push(`/core-operations/engagements/${engagementId}`);
  };

  const handleViewEngagement = (id: string) => {
    router.push(`/core-operations/engagements/${id}`);
  };

  const handleEditEngagement = (id: string) => {
    router.push(`/core-operations/engagements/${id}?edit=true`);
  };

  const handleDeleteEngagement = (id: string) => {
    // TODO: 實現刪除確認對話框
    console.log('Delete engagement:', id);
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    setActiveTab('list');
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
  };

  return (
    <EngagementProvider>
      <div className="container mx-auto py-6 space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">專案合約管理</h1>
            <p className="text-muted-foreground">
              管理所有專案合約的完整生命週期，從創建到完成的全流程管理
            </p>
          </div>
          <Button onClick={handleShowCreateForm}>
            <Plus className="h-4 w-4 mr-2" />
            創建專案合約
          </Button>
        </div>

        {/* 標籤頁導航 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>儀表板</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>專案列表</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <EngagementDashboard
              onCreateEngagement={handleShowCreateForm}
              onViewEngagement={handleViewEngagement}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <EngagementListView
              onCreateEngagement={handleCreateEngagement}
              onViewEngagement={handleViewEngagement}
              onEditEngagement={handleEditEngagement}
              onDeleteEngagement={handleDeleteEngagement}
              showCreateForm={showCreateForm}
              onCancelCreate={handleCancelCreate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </EngagementProvider>
  );
}