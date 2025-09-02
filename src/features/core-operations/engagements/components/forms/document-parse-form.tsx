/**
 * @fileoverview 文件解析創建 Engagement 表單組件
 * @description 整合文件解析功能到 engagements 模組中
 */
'use client';

import { createEngagementFromDocument } from '@/features/core-operations/engagements/actions';
import type { DocDetails, WorkItem } from '@/features/automation-tools/docu-parse/types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { useToast } from '@/shared/hooks/use-toast';
import { BrainCircuit, Cpu, FileCog, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DocumentParseFormProps {
  extractedData: {
    fileName: string;
    workItems: WorkItem[];
    subtotal?: number;
  };
  partners: Array<{
    id: string;
    name: string;
    contacts?: Array<{
      id: string;
      name: string;
      role: string;
    }>;
  }>;
  onSuccess?: (engagementId: string) => void;
  onCancel?: () => void;
}

export function DocumentParseForm({
  extractedData,
  partners,
  onSuccess,
  onCancel,
}: DocumentParseFormProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [docDetails, setDocDetails] = useState<DocDetails>({
    customId: `ENG-${Date.now()}`,
    name: extractedData.fileName?.replace(/\.[^/.]+$/, '') || '',
    client: '',
    clientRepresentative: '',
  });
  const [workItems, setWorkItems] = useState<WorkItem[]>(extractedData.workItems || []);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);

  const handleDetailChange = (key: keyof DocDetails, value: string) => {
    setDocDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    const partner = partners.find((p) => p.id === partnerId);
    setDocDetails((prev) => ({
      ...prev,
      client: partner?.name || '',
      clientRepresentative: partner?.contacts?.[0]?.name || '',
    }));
  };

  const handleCreateEngagement = async () => {
    if (!docDetails.name || !docDetails.client || workItems.length === 0) {
      toast({
        variant: 'destructive',
        title: '缺少必要資訊',
        description: '請填寫「名稱」、「客戶」，並確保至少有一個工作項目。',
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createEngagementFromDocument({
        docDetails,
        workItems,
      });

      if (result.error) {
        toast({
          variant: 'destructive',
          title: '創建失敗',
          description: result.error,
        });
      } else {
        toast({
          title: '成功！',
          description: `專案合約 "${docDetails.name}" 已成功創建。`,
        });
        onSuccess?.(result.engagementId!);
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : '發生未知錯誤';
      toast({ variant: 'destructive', title: '創建失敗', description: error });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">創建專案合約</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-2">
              <FileCog className="w-4 h-4" />
              {extractedData.fileName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {extractedData?.subtotal && (
              <Badge variant="outline" className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                <span>文件總計: ${extractedData.subtotal.toLocaleString()}</span>
              </Badge>
            )}
            {extractedData.workItems.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>共提取 {extractedData.workItems.length} 個項目</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customId">自訂 ID</Label>
            <Input
              id="customId"
              placeholder="專案合約 ID"
              value={docDetails.customId}
              onChange={(e) => handleDetailChange('customId', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">名稱 *</Label>
            <Input
              id="name"
              placeholder="專案合約名稱"
              value={docDetails.name}
              onChange={(e) => handleDetailChange('name', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">客戶 *</Label>
            <Select value={selectedPartnerId} onValueChange={handlePartnerChange}>
              <SelectTrigger id="client">
                <SelectValue placeholder="選擇一個合作夥伴" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id!}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientRepresentative">客戶代表</Label>
            <Select
              value={docDetails.clientRepresentative}
              onValueChange={(value) => handleDetailChange('clientRepresentative', value)}
              disabled={
                !selectedPartner ||
                !selectedPartner.contacts ||
                selectedPartner.contacts.length === 0
              }
            >
              <SelectTrigger id="clientRepresentative">
                <SelectValue
                  placeholder={
                    !selectedPartner ? '請先選擇客戶' : '選擇一位聯絡人'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {selectedPartner?.contacts?.map((contact) => (
                  <SelectItem key={contact.id} value={contact.name}>
                    {contact.name} ({contact.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 工作項目摘要 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">工作項目摘要</h3>
          <div className="grid gap-2">
            {workItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {(item as any).description && (
                    <div className="text-sm text-muted-foreground">
                      {(item as any).description}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {item.quantity} × ${item.unitPrice}
                    {(item.discount || 0) > 0 && (
                      <span className="text-red-500"> - ${item.discount || 0}</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    小計: $
                    {(
                      Number(item.quantity) * Number(item.unitPrice) -
                      Number(item.discount)
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right text-lg font-semibold border-t pt-2">
            總計: $
            {workItems
              .reduce(
                (sum, item) =>
                  sum +
                  Number(item.quantity) * Number(item.unitPrice) -
                  Number(item.discount),
                0
              )
              .toLocaleString()}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button
            onClick={handleCreateEngagement}
            disabled={isCreating}
            className="min-w-[200px]"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                創建中...
              </>
            ) : (
              <>
                <FileCog className="mr-2 h-4 w-4" />
                創建專案合約
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
