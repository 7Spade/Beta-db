'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, Paperclip } from 'lucide-react';
import { useState } from 'react';
import type { CreateAttachmentInput } from '../../types/document.types';

interface AttachmentFormProps {
  attachment?: any; // 編輯時傳入現有附件
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export function AttachmentForm({ attachment, onSave, onCancel }: AttachmentFormProps) {
  const [formData, setFormData] = useState<CreateAttachmentInput>({
    name: attachment?.name || '',
    description: attachment?.description || '',
    fileUrl: attachment?.fileUrl || '',
    fileName: attachment?.fileName || '',
    fileSize: attachment?.fileSize || 0,
    mimeType: attachment?.mimeType || '',
    category: attachment?.category || '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof CreateAttachmentInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        name: file.name.split('.')[0], // 使用文件名（不含擴展名）作為名稱
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl: URL.createObjectURL(file), // 臨時 URL，實際應該上傳到服務器
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {attachment ? '編輯附件' : '新增附件'}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 文件上傳 */}
          <div className="space-y-2">
            <Label>文件上傳</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="attachment-upload"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              <label htmlFor="attachment-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  點擊上傳附件或拖拽文件到此處
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  支持所有文件格式
                </p>
              </label>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Paperclip className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 名稱 */}
            <div className="space-y-2">
              <Label htmlFor="name">附件名稱</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="輸入附件名稱"
                required
              />
            </div>

            {/* 分類 */}
            <div className="space-y-2">
              <Label htmlFor="category">分類</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="輸入附件分類"
              />
            </div>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="輸入附件描述"
              rows={3}
            />
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">
              {attachment ? '更新' : '創建'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
