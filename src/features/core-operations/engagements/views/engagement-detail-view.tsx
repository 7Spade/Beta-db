/**
 * @fileoverview Engagement 詳細視圖
 */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Clock,
  Edit,
  FileText,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { addTaskAction, deleteTaskAction, updateTaskAction } from '../actions/task.actions';
import { EngagementSummaryCard } from '../components/cards';
import { CommunicationList, MeetingList } from '../components/communication';
import { FinancialSummary, InvoiceList, PaymentList } from '../components/financial';
import { EditEngagementForm } from '../components/forms';
import { AcceptanceRecordList, QualityCheckList } from '../components/quality';
import { IssueList, RiskList, RiskMatrix } from '../components/risk';
import { TaskList } from '../components/tasks';
import { useEngagement } from '../hooks';
import type { Task } from '../types';
import { getPhaseColor, getStatusColor } from '../utils';

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

  // 任務管理處理函數
  const handleTaskCreate = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    try {
      // 轉換日期類型以符合 CreateTaskInput
      const createData = {
        ...taskData,
        dueDate: taskData.dueDate instanceof Date ? taskData.dueDate : undefined,
      };
      const result = await addTaskAction(engagementId, createData);
      if (result.success) {
        refresh(); // 重新載入 Engagement 數據
      } else {
        console.error('創建任務失敗:', result.error);
      }
    } catch (error) {
      console.error('創建任務失敗:', error);
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      // 轉換日期類型以符合 UpdateTaskInput
      const updateData = {
        ...updates,
        dueDate: updates.dueDate instanceof Date ? updates.dueDate : undefined,
        completedDate: updates.completedDate instanceof Date ? updates.completedDate : undefined,
      };
      const result = await updateTaskAction(engagementId, taskId, updateData);
      if (result.success) {
        refresh(); // 重新載入 Engagement 數據
      } else {
        console.error('更新任務失敗:', result.error);
      }
    } catch (error) {
      console.error('更新任務失敗:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const result = await deleteTaskAction(engagementId, taskId);
      if (result.success) {
        refresh(); // 重新載入 Engagement 數據
      } else {
        console.error('刪除任務失敗:', result.error);
      }
    } catch (error) {
      console.error('刪除任務失敗:', error);
    }
  };

  // 溝通管理處理函數
  const handleCommunicationCreate = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('創建溝通記錄失敗:', error);
    }
  };

  const handleCommunicationUpdate = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('更新溝通記錄失敗:', error);
    }
  };

  const handleCommunicationDelete = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('刪除溝通記錄失敗:', error);
    }
  };

  const handleMeetingCreate = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('創建會議失敗:', error);
    }
  };

  const handleMeetingUpdate = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('更新會議失敗:', error);
    }
  };

  const handleMeetingDelete = async () => {
    try {
      await refresh();
    } catch (error) {
      console.error('刪除會議失敗:', error);
    }
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
          <TabsTrigger value="quality">品質</TabsTrigger>
          <TabsTrigger value="communication">溝通</TabsTrigger>
          <TabsTrigger value="documents">文件</TabsTrigger>
          <TabsTrigger value="risks">風險</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EngagementSummaryCard engagement={engagement} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskList
            tasks={engagement.tasks}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialSummary
            summary={{
              totalValue: engagement.totalValue,
              paidAmount: engagement.paidAmount,
              pendingAmount: engagement.pendingAmount,
              overdueAmount: 0, // 暫時設為 0，後續可以從數據計算
              paymentProgress: engagement.totalValue > 0 ? (engagement.paidAmount / engagement.totalValue) * 100 : 0,
              receiptProgress: 0, // 暫時設為 0，後續可以從數據計算
              invoiceProgress: 0, // 暫時設為 0，後續可以從數據計算
              costBreakdown: {
                labor: 0,
                materials: 0,
                equipment: 0,
                overhead: 0,
                other: 0,
              },
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentList
              payments={engagement.payments}
              onPaymentCreate={() => refresh()}
              onPaymentUpdate={() => refresh()}
              onPaymentDelete={() => refresh()}
              isLoading={isLoading}
            />

            <InvoiceList
              invoices={engagement.invoices}
              onInvoiceCreate={() => refresh()}
              onInvoiceUpdate={() => refresh()}
              onInvoiceDelete={() => refresh()}
              isLoading={isLoading}
            />
          </div>
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
                    {engagement.milestones?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">里程碑</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagement.deliverables?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">交付物</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AcceptanceRecordList
              acceptanceRecords={engagement.acceptanceRecords}
              onAcceptanceRecordCreate={() => refresh()}
              onAcceptanceRecordUpdate={() => refresh()}
              onAcceptanceRecordDelete={() => refresh()}
              isLoading={isLoading}
            />

            <QualityCheckList
              qualityChecks={engagement.qualityChecks}
              onQualityCheckCreate={() => refresh()}
              onQualityCheckUpdate={() => refresh()}
              onQualityCheckDelete={() => refresh()}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommunicationList
              communications={engagement.communications}
              onCommunicationCreate={handleCommunicationCreate}
              onCommunicationUpdate={handleCommunicationUpdate}
              onCommunicationDelete={handleCommunicationDelete}
              isLoading={isLoading}
            />

            <MeetingList
              meetings={engagement.meetings}
              onMeetingCreate={handleMeetingCreate}
              onMeetingUpdate={handleMeetingUpdate}
              onMeetingDelete={handleMeetingDelete}
              isLoading={isLoading}
            />
          </div>
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
                    {engagement.documents?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">文件</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {engagement.attachments?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">附件</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {/* 風險矩陣 */}
          <RiskMatrix risks={engagement.risks} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskList
              risks={engagement.risks}
              onRiskCreate={() => refresh()}
              onRiskUpdate={() => refresh()}
              onRiskDelete={() => refresh()}
              isLoading={isLoading}
            />

            <IssueList
              issues={engagement.issues}
              onIssueCreate={() => refresh()}
              onIssueUpdate={() => refresh()}
              onIssueDelete={() => refresh()}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}