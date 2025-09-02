/**
 * @fileoverview 文件解析創建 Engagement 頁面
 * @description 整合文件解析功能到 engagements 模組中
 */
'use client';

import { DocumentParseForm } from '@/features/core-operations/engagements/components';
import { extractWorkItemsFromDocument } from '@/features/automation-tools/docu-parse/actions/docu-parse-actions';
import { FileSelector } from '@/features/automation-tools/docu-parse/components/file-selector';
import type { DocDetails, WorkItem } from '@/features/automation-tools/docu-parse/types/docu-parse.types';
import { firestore } from '@/features/integrations/database/firebase-client/firebase-client';
import type { Partner } from '@/shared/types/types';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useActionState, startTransition } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState = {
  data: undefined,
  error: undefined,
};

function ParseDocumentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    extractWorkItemsFromDocument,
    initialState
  );
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(() =>
    searchParams.get('path')
  );

  const extractedData = state.data;
  const serverError = state.error;

  // 自動解析文件
  useEffect(() => {
    if (selectedFilePath) {
      startTransition(() => {
        formAction({ filePath: selectedFilePath });
      });
    }
  }, [selectedFilePath, formAction]);

  // 獲取合作夥伴列表
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

  // 處理錯誤
  useEffect(() => {
    if (serverError) {
      toast({
        variant: 'destructive',
        title: '提取失敗',
        description: serverError,
      });
    }
  }, [serverError, toast]);

  const handleSuccess = (engagementId: string) => {
    router.push(`/core-operations/engagements/${engagementId}`);
  };

  const handleCancel = () => {
    router.push('/core-operations/engagements');
  };

  const handleReset = () => {
    setSelectedFilePath(null);
  };

  // 如果沒有選擇文件，顯示文件選擇器
  if (!selectedFilePath) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">文件解析創建專案合約</h1>
          <p className="text-muted-foreground">
            選擇文件進行 AI 解析，自動創建專案合約
          </p>
        </div>
        <FileSelector onFileSelect={setSelectedFilePath} />
      </div>
    );
  }

  // 如果正在解析，顯示載入狀態
  if (isPending) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center mt-8 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium text-foreground">
            正在提取資料，請稍候...
          </p>
          <p className="text-muted-foreground">AI 需要一點時間思考。</p>
        </div>
      </div>
    );
  }

  // 如果解析失敗，顯示錯誤
  if (state.error && !isPending) {
    return (
      <div className="container mx-auto py-6">
        <div className="w-full max-w-2xl mx-auto text-center py-16 border border-destructive rounded-lg">
          <h2 className="text-2xl font-bold text-destructive mb-4">解析失敗</h2>
          <p className="text-destructive/80 mb-6">{state.error}</p>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          >
            返回重試
          </button>
        </div>
      </div>
    );
  }

  // 如果解析成功，顯示創建表單
  if (extractedData) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">創建專案合約</h1>
          <p className="text-muted-foreground">
            從文件 "{extractedData.fileName}" 解析的資料
          </p>
        </div>
        <DocumentParseForm
          extractedData={extractedData}
          partners={partners.map(p => ({
            id: p.id || '',
            name: p.name || '',
            contacts: p.contacts?.map(c => ({
              id: c.id || '',
              name: c.name || '',
              role: c.role || '',
            }))
          }))}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return null;
}

export default function ParseDocumentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParseDocumentPageContent />
    </Suspense>
  );
}
