'use client';

import { uploadImageAction } from '@/features/system-administration/website-cms/blog/actions/media.actions';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState, useTransition } from 'react';

interface MediaUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string | null;
}

export function MediaUploader({ onUploadSuccess, currentImageUrl }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show a preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Start the upload
    startTransition(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        onUploadSuccess(result.url);
        toast({ title: '上傳成功', description: '圖片已成功上傳並更新。' });
      } else {
        toast({ variant: 'destructive', title: '上傳失敗', description: result.error });
        setPreview(currentImageUrl || null); // Revert to original on failure
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden">
        {preview ? (
          <Image src={preview} alt="文章主圖預覽" width={400} height={225} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <UploadCloud className="mx-auto h-12 w-12" />
            <p className="mt-2">點擊按鈕或拖曳檔案至此處上傳</p>
            <p className="text-xs">建議尺寸 1200x630px</p>
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
        {isUploading ? '上傳中...' : '選擇圖片'}
      </Button>
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        disabled={isUploading}
      />
    </div>
  );
}
