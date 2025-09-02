/**
 * @fileoverview Engagement 詳細視圖
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { EngagementSummaryCard } from '../components/cards';
import { EditEngagementForm } from '../components/forms';
import { useEngagement } from '../hooks';
import { formatDate, formatCurrency, getStatusColor, getPhaseColor } from '../utils';
import type { EngagementStatus, EngagementPhase } from '../types';

interface EngagementDetailViewProps {
  engagementId: string;
  onBack?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EngagementDetailView({
  engagementId,
  onBack,
  onEdit,
  onDelete,
}: EngagementDetailViewProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const { engagement, isLoading, error, refresh } = useEngagement(engagementId);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    refresh();
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !engagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600">
              {error || '載入專案合約失敗'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showEditForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleEditCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-2xl font-bold">編輯專案合約</h1>
              <p className="text-muted-foreground">修改專案合約的相關信息</p>
            </div>
          </div>
        </div>
        <EditEngagementForm
          engagementId={engagementId}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{engagement.name}</h1>
            <p className="text-muted-foreground">
              {engagement.contractor} → {engagement.client}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowEditForm(true)}>
            <Edit className="h-4 w-4 mr-2" />
            編輯
          </Button>
          <Button variant="destructive" onClick={() => onDelete?.(engagement.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            刪除
          </Button>
        </div>
      </div>

      {/* 狀態和階段標籤 */}
      <div className="flex items-center space-x-2">
        <Badge className={getStatusColor(engagement.status)}>
          {engagement.status}
        </Badge>
        <Badge variant="outline" className={getPhaseColor(engagement.phase)}>
          {engagement.phase}
        </Badge>
        {engagement.customId && (
          <Badge variant="secondary">
            ID: {engagement.customId}
          </Badge>
        )}
      </div>

      {/* 主要內容 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概覽</TabsTrigger>
          <TabsTrigger value="tasks">任務</TabsTrigger>
          <TabsTrigger value="financial">財務</TabsTrigger>
          <TabsTrigger value="progress">進度</TabsTrigger>
          <TabsTrigger value="documents">文件</TabsTrigger>
          <TabsTrigger value="risks">風險</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EngagementSummaryCard engagement={engagement} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                任務管理
              </CardTitle>
              <CardDescription>
                管理專案的所有任務和子任務
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                任務管理功能開發中...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                財務管理
              </CardTitle>
              <CardDescription>
                管理付款、收款和發票
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {engagement.payments.length}
                  </div>
                  <div className="text-sm text-muted-foreground">付款記錄</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagement.receipts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">收款記錄</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {engagement.invoices.length}
                  </div>
                  <div className="text-sm text-muted-foreground">發票</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                進度管理
              </CardTitle>
              <CardDescription>
                追蹤里程碑和交付物進度
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {engagement.milestones.length}
                  </div>
                  <div className="text-sm text-muted-foreground">里程碑</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagement.deliverables.length}
                  </div>
                  <div className="text-sm text-muted-foreground">交付物</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                文件管理
              </CardTitle>
              <CardDescription>
                管理專案相關的文件和附件
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {engagement.documents.length}
                  </div>
                  <div className="text-sm text-muted-foreground">文件</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagement.attachments.length}
                  </div>
                  <div className="text-sm text-muted-foreground">附件</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                風險管理
              </CardTitle>
              <CardDescription>
                識別和管理專案風險與問題
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {engagement.risks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">風險</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {engagement.issues.length}
                  </div>
                  <div className="text-sm text-muted-foreground">問題</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}