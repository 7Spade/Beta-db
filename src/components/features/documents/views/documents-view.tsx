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
 * @description 提供文檔上傳、AI 解析、數據提取和結果展示功能。整合了 Google Genkit AI 
 * 服務進行智能文檔分析，支援多種文檔格式的處理和工作項目提取。使用 Next.js 15 的 
 * Server Actions และ useActionState 實現現代化的表單處理和狀態管理。
 * 
 * @關聯檔案
 * - `src/components/features/documents/actions/document-actions.ts`: 呼叫此檔案中的 Server Action `extractWorkItemsFromDocument` 來觸發後端處理流程。
 * - `src/components/features/documents/tables/work-items-table.tsx`: 在成功解析後，使用此元件來顯示和編輯提取出的工料清單。
 * - `src/components/features/contracts/actions/contract-actions.ts`: 在使用者確認工料清單後，呼叫 `createProjectAndContractFromDocument` Action 來建立專案和合約。
 */

"use client";

import { useActionState, useState, useMemo, useEffect, startTransition } from "react";
import { File, Loader2, Cpu, FileCog, FolderSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";
import type { Partner } from "@/lib/types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { extractWorkItemsFromDocument, WorkItem, DocDetails } from "@/components/features/documents";
import { createProjectAndContractFromDocument } from "@/components/features/contracts";
import { WorkItemsTable } from "../tables";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StorageFileSelectorDialog } from "../components/storage-file-selector";


const initialState = {
  data: undefined,
  error: undefined,
};

export function DocumentsView() {
  const [state, formAction, isPending] = useActionState(extractWorkItemsFromDocument, initialState);
  const { toast } = useToast();
  const router = useRouter();

  // This state is for user-editable fields after AI has provided initial data
  const [docDetails, setDocDetails] = useState<DocDetails>({
      customId: '',
      name: '',
      client: '',
      clientRepresentative: '',
  });
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  
  // State for UI control
  const [isCreating, setIsCreating] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  
  // State for fetching partners
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  // Memoized values from the server action state
  const extractedData = useMemo(() => state.data, [state.data]);
  const serverError = useMemo(() => state.error, [state.error]);

  // Fetch partners from Firestore
  useEffect(() => {
    const fetchPartners = async () => {
        try {
            const partnersCollection = collection(firestore, 'partners');
            const partnerSnapshot = await getDocs(partnersCollection);
            const partnerList = partnerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Partner[];
            setPartners(partnerList);
        } catch (error) {
            console.error("獲取合作夥伴時發生錯誤:", error);
            toast({ variant: 'destructive', title: '錯誤', description: '無法載入合作夥伴列表。' });
        }
    }
    fetchPartners();
  }, [toast]);
  
  // Find the selected partner object
  const selectedPartner = useMemo(() => {
    return partners.find(p => p.id === selectedPartnerId);
  }, [partners, selectedPartnerId]);


  // Effect to handle the result of the server action
  useEffect(() => {
    if (serverError) {
      toast({
        variant: "destructive",
        title: "提取失敗",
        description: serverError,
      });
    }
    if (extractedData) {
        setWorkItems(extractedData.workItems || []);
        // When AI data comes back, it becomes the source of truth for the doc details
        setDocDetails({
            customId: `DOC-${Date.now()}`,
            name: extractedData.fileName?.replace(/\.[^/.]+$/, "") || "",
            client: '',
            clientRepresentative: '',
        });
        setSelectedPartnerId('');
    }
  }, [serverError, extractedData, toast]);

  // Handle changes to the document detail input fields
  const handleDetailChange = (key: keyof DocDetails, value: string) => {
      setDocDetails(prev => ({...prev, [key]: value}));
  }
  
  // Handle partner selection and auto-fill client details
  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    const partner = partners.find(p => p.id === partnerId);
    setDocDetails(prev => ({
        ...prev,
        client: partner?.name || '',
        clientRepresentative: partner?.contacts?.[0]?.name || '',
    }));
  };

  const handleCreateProjectAndContract = async () => {
    if (!docDetails.name || !docDetails.client || workItems.length === 0) {
        toast({
            variant: "destructive",
            title: "缺少必要資訊",
            description: "請填寫「名稱」、「客戶」，並確保至少有一個工作項目。"
        });
        return;
    }
    setIsCreating(true);
    try {
        const result = await createProjectAndContractFromDocument({
            docDetails,
            workItems
        });
        if (result.error) {
             toast({ variant: "destructive", title: "建立失敗", description: result.error });
        } else {
             toast({ title: "成功！", description: `專案與合約 "${docDetails.name}" 已成功建立。` });
             router.push(`/contracts/${result.contractId}`);
        }
    } catch (e) {
        const error = e instanceof Error ? e.message : "發生未知錯誤";
        toast({ variant: "destructive", title: "建立失敗", description: error });
    } finally {
        setIsCreating(false);
    }
  }

  const handleFileSelect = (filePath: string, fileName: string) => {
    // Immediately reset details for better UX while AI is processing
    setDocDetails({
        customId: '', name: fileName.replace(/\.[^/.]+$/, ""), client: '', clientRepresentative: ''
    });
    setWorkItems([]);
    
    startTransition(() => {
        formAction({ filePath, fileName });
    });
    setIsSelectorOpen(false);
  }


  return (
    <>
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <Card className="w-full shadow-2xl bg-card">
        <CardHeader>
          <CardTitle>文件解析</CardTitle>
          <CardDescription>從您雲端儲存的檔案中提取結構化數據，並快速建立合約。</CardDescription>
        </CardHeader>
        <CardContent>
            <div
              className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-border"
            >
              <FolderSearch className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                點擊按鈕以從您的雲端儲存中選擇檔案。
              </p>
              <Button onClick={() => setIsSelectorOpen(true)} className="mt-4">
                從雲端儲存選擇檔案
              </Button>
            </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="flex flex-col items-center justify-center mt-8 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-foreground">正在提取資料，請稍候...</p>
          <p className="text-muted-foreground">這可能需要一些時間。</p>
        </div>
      )}

      {extractedData && !isPending && (
        <div className="mt-8">
          <Card className="shadow-2xl bg-card" key={extractedData.fileName}>
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
                      <Badge variant="secondary" className="flex items-center gap-2">
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
                  </div>
                </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="customId">編號</Label>
                    <Input id="customId" placeholder="文件 ID" value={docDetails.customId} onChange={(e) => handleDetailChange('customId', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">名稱</Label>
                    <Input id="name" placeholder="文件名稱" value={docDetails.name} onChange={(e) => handleDetailChange('name', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">客戶</Label>
                    <Select value={selectedPartnerId} onValueChange={handlePartnerChange}>
                        <SelectTrigger id="client">
                            <SelectValue placeholder="選擇一個合作夥伴" />
                        </SelectTrigger>
                        <SelectContent>
                            {partners.map(partner => (
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
                        disabled={!selectedPartner || !selectedPartner.contacts || selectedPartner.contacts.length === 0}
                    >
                        <SelectTrigger id="clientRepresentative">
                            <SelectValue placeholder={!selectedPartner ? "請先選擇客戶" : "選擇一位聯絡人"} />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedPartner?.contacts?.map(contact => (
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
                 <Button onClick={handleCreateProjectAndContract} disabled={isCreating || isPending} className="w-full">
                     <FileCog className="mr-2 h-4 w-4" />
                     {isCreating ? "建立中..." : "建立專案與合約"}
                 </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    <StorageFileSelectorDialog
      isOpen={isSelectorOpen}
      onOpenChange={setIsSelectorOpen}
      onFileSelect={handleFileSelect}
    />
    </>
  );
}
