
'use client';

import { useState, useRef, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';
import { uploadFileAction } from '../actions/storage.actions';

interface UploadButtonProps {
    onUploadComplete: () => void;
    currentPath: string;
}

export const UploadButton: FC<UploadButtonProps> = ({ onUploadComplete, currentPath }) => {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('currentPath', currentPath);

        const result = await uploadFileAction(formData);
        
        if (result.success) {
             toast({ title: '成功', description: `檔案 "${file.name}" 已上傳。` });
             onUploadComplete();
        } else {
            console.error('上傳失敗:', result.error);
            toast({ variant: 'destructive', title: '錯誤', description: result.error || '檔案上傳失敗。' });
        }
       
        setIsUploading(false);
        // Reset file input
        if(fileInputRef.current) {
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
                {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Upload className="mr-2 h-4 w-4" />
                )}
                {isUploading ? '上傳中...' : '上傳檔案'}
            </Button>
        </>
    );
};
