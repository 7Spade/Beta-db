
'use client';

import { useState, useRef, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { Upload, Loader2 } from 'lucide-react';

interface UploadButtonProps {
    onUploadComplete: () => void;
}

export const UploadButton: FC<UploadButtonProps> = ({ onUploadComplete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            toast({ title: '成功', description: `檔案 "${file.name}" 已上傳。` });
            onUploadComplete();
        } catch (error) {
            console.error('上傳失敗:', error);
            toast({ variant: 'destructive', title: '錯誤', description: '檔案上傳失敗。' });
        } finally {
            setIsUploading(false);
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
