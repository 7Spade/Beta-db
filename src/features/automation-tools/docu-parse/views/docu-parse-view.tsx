/**
 * @project Beta-db Integrated Platform - 統一整合平台文檔處理頁面
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author Beta-db Development Team
 * @created 2025-01-22
 * @updated 2025-01-22
 * @version 1.0.0
 *
 * @fileoverview 文檔處理主頁面 - DocuParse 模組的核心功能頁面
 * @description 從 URL 讀取檔案路徑，或讓使用者直接選擇檔案，自動觸發 AI 解析，並提供結果展示與後續操作。
 *
 * @關聯檔案
 * - `src/components/features/docu-parse/actions/docu-parse-actions.ts`: 呼叫此檔案中的 Server Action `extractWorkItemsFromDocument` 來觸發後端處理流程。
 * - `src/components/features/docu-parse/tables/work-items-table.tsx`: 在成功解析後，使用此元件來顯示和編輯提取出的工料清單。
 * - `src/components/features/contracts/actions/contract-actions.ts`: 在使用者確認工料清單後，呼叫 `createProjectAndContractFromDocument` Action 來建立專案和合約。
 */

'use client';

import { firestore } from '@/lib/db/firebase-client/firebase-client';
import type { Partner } from '@/lib/types/types';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Key,
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from 'react';

import DocumentPreview from '@/components/layout/shared/document-preview';
import { extractWorkItemsFromDocument } from '@/features/automation-tools/docu-parse/actions/docu-parse-actions';
import { createProjectAndContractFromParsedData } from '@/features/automation-tools/docu-parse/actions/docu-parse-commit.actions';
import { FileSelector } from '@/features/automation-tools/docu-parse/components/file-selector';
import { WorkItemsTable } from '@/features/automation-tools/docu-parse/tables';
import type { DocDetails, WorkItem } from '@/features/automation-tools/docu-parse/types/docu-parse.types';
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
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Cpu, File, FileCog, Loader2, RefreshCcw } from 'lucide-react';

const initialState = {
  data: undefined,
  error: undefined,
};

export function DocuParseView() {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(
    extractWorkItemsFromDocument,
    initialState
  );
  const { toast } = useToast();
  const router = useRouter();

  const [docDetails, setDocDetails] = useState<DocDetails>({
    customId: '',
    name: '',
    client: '',
    clientRepresentative: '',
  });
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(() =>
    searchParams.get('filePath')
  );

  const extractedData = state.data;
  const serverError = state.error;

  useEffect(() => {
    // This effect runs only when a file path is selected (either from URL or file selector)
    if (selectedFilePath) {
      startTransition(() => {
        formAction({ filePath: selectedFilePath });
      });
    }
  }, [selectedFilePath, formAction]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const partnersCollection = collection(firestore, 'partners');
        const partnerSnapshot = await getDocs(partnersCollection);
        setPartners(
          partnerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Partner[]
        );
      } catch (error) {
        console.error('獲取合作夥伴時發生錯誤:', error);
        toast({
          variant: 'destructive',
          title: '錯誤',
          description: '無法載入合作夥伴列表。',
        });
      }
    };
    fetchPartners();
  }, [toast]);

  const selectedPartner = useMemo(() => {
    return partners.find((p) => p.id === selectedPartnerId);
  }, [partners, selectedPartnerId]);

  useEffect(() => {
    if (serverError) {
      toast({
        variant: 'destructive',
        title: '提取失敗',
        description: serverError,
      });
    }
    if (extractedData) {
      setWorkItems(extractedData.workItems || []);
      setDocDetails({
        customId: `DOC-${Date.now()}`,
        name: extractedData.fileName?.replace(/\.[^/.]+$/, '') || '',
        client: '',
        clientRepresentative: '',
      });
      setSelectedPartnerId('');
    }
  }, [serverError, extractedData, toast]);

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

  const handleCreateProjectAndContract = async () => {
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
      const result = await createProjectAndContractFromParsedData({
        docDetails,
        workItems,
      });
      if (result.error) {
        toast({
          variant: 'destructive',
          title: '建立失敗',
          description: result.error,
        });
      } else {
        toast({
          title: '成功！',
          description: `專案與合約 "${docDetails.name}" 已成功建立。`,
        });
        // 停留在本頁，讓使用者自行前往合約或專案
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : '發生未知錯誤';
      toast({ variant: 'destructive', title: '建立失敗', description: error });
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setSelectedFilePath(null);
    router.replace('/quick-actions/docu-parse'); // Clear URL params - 修正路由路径
    // Reset all local states
    setWorkItems([]);
    setDocDetails({
      customId: '',
      name: '',
      client: '',
      clientRepresentative: '',
    });
    setSelectedPartnerId('');
  };

  if (!selectedFilePath) {
    return <FileSelector onFileSelect={setSelectedFilePath} />;
  }

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center mt-8 text-center">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium text-foreground">
          正在提取資料，請稍候...
        </p>
        <p className="text-muted-foreground">AI 需要一點時間思考。</p>
      </div>
    );
  }

  if (state.error && !isPending) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center py-16 border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">解析失敗</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive/80">{state.error}</p>
          <Button onClick={handleReset} className="mt-6" variant="destructive">
            返回重試
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (extractedData) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Card
          className="shadow-2xl bg-card"
          key={extractedData.fileName as Key}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">提取的工作項目</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2">
                  <File className="w-4 h-4" />
                  {extractedData.fileName}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {extractedData.workItems.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4" />
                    <span>共提取 {extractedData.workItems.length} 個項目</span>
                  </Badge>
                )}
                {extractedData.totalTokens && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span>消耗 {extractedData.totalTokens} tokens</span>
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  選擇其他檔案
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedFilePath && (
              <div className="w-full h-[60vh] mb-6">
                <DocumentPreview
                  src={selectedFilePath}
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="customId">名稱</Label>
                <Input
                  id="customId"
                  placeholder="文件名稱"
                  value={docDetails.customId}
                  onChange={(e) =>
                    handleDetailChange('customId', e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">名稱</Label>
                <Input
                  id="name"
                  placeholder="文件名稱"
                  value={docDetails.name}
                  onChange={(e) => handleDetailChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">客戶</Label>
                <Select
                  value={selectedPartnerId}
                  onValueChange={handlePartnerChange}
                >
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
                  onValueChange={(value) =>
                    handleDetailChange('clientRepresentative', value)
                  }
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
            <WorkItemsTable
              key={state.data?.fileName}
              initialData={workItems}
              onDataChange={setWorkItems}
            />
          </CardContent>
          <CardContent>
            <Button
              onClick={handleCreateProjectAndContract}
              disabled={isCreating || isPending}
              className="w-full"
            >
              <FileCog className="mr-2 h-4 w-4" />
              {isCreating ? '建立中...' : '建立專案與合約'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
