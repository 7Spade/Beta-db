/**
 * @fileoverview Upload Button Component
 * @description 處理檔案上傳的按鈕元件。
 */
'use client';

import { uploadFile } from '@/cloud-drive/actions/storage-actions';
import { Button } from '@/ui/button';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { useRef, useState, type FC } from 'react';

interface UploadButtonProps {
  currentPath: string;
  onUploadComplete: () => void;
}

export const UploadButton: FC<UploadButtonProps> = ({ currentPath, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('currentPath', currentPath);

    const result = await uploadFile(formData);
    if (result.success) {
      toast({ title: '成功', description: `檔案 "${file.name}" 已成功上傳。` });
      onUploadComplete();
    } else {
      toast({ variant: 'destructive', title: '錯誤', description: result.error || '檔案上傳失敗。' });
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {isUploading ? '上傳中...' : '上傳檔案'}
      </Button>
    </>
  );
};
