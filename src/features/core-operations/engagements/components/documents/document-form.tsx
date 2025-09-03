'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Upload, FileText } from 'lucide-react';
import { useState } from 'react';
import type { DocumentType, CreateDocumentInput } from '../../types/document.types';

interface DocumentFormProps {
  document?: any; // 編輯時傳入現有文件
  onSave: () => Promise<void>;
  onCancel: () => void;
}

export function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState<CreateDocumentInput>({
    title: document?.title || '',
    type: document?.type || 'other',
    description: document?.description || '',
    fileUrl: document?.fileUrl || '',
    fileName: document?.fileName || '',
    fileSize: document?.fileSize || 0,
    mimeType: document?.mimeType || '',
    tags: document?.tags || [],
    category: document?.category || '',
    accessLevel: document?.accessLevel || 'internal',
  });

  const [tagInput, setTagInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: keyof CreateDocumentInput, value: any) => {
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
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileUrl: URL.createObjectURL(file), // 臨時 URL，實際應該上傳到服務器
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  const getTypeLabel = (type: DocumentType) => {
    switch (type) {
      case 'contract':
        return '合約';
      case 'proposal':
        return '提案';
      case 'report':
        return '報告';
      case 'specification':
        return '規格書';
      case 'manual':
        return '手冊';
      default:
        return '其他';
    }
  };

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'public':
        return '公開';
      case 'internal':
        return '內部';
      case 'confidential':
        return '機密';
      case 'restricted':
        return '限制';
      default:
        return level;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {document ? '編輯文件' : '新增文件'}
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
                id="file-upload"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  點擊上傳文件或拖拽文件到此處
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  支持 PDF, DOC, XLS, PPT, 圖片等格式
                </p>
              </label>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 標題 */}
            <div className="space-y-2">
              <Label htmlFor="title">文件標題</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="輸入文件標題"
                required
              />
            </div>

            {/* 類型 */}
            <div className="space-y-2">
              <Label htmlFor="type">文件類型</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as DocumentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">合約</SelectItem>
                  <SelectItem value="proposal">提案</SelectItem>
                  <SelectItem value="report">報告</SelectItem>
                  <SelectItem value="specification">規格書</SelectItem>
                  <SelectItem value="manual">手冊</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="輸入文件描述"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 分類 */}
            <div className="space-y-2">
              <Label htmlFor="category">分類</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="輸入文件分類"
              />
            </div>

            {/* 存取權限 */}
            <div className="space-y-2">
              <Label htmlFor="accessLevel">存取權限</Label>
              <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇存取權限" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">公開</SelectItem>
                  <SelectItem value="internal">內部</SelectItem>
                  <SelectItem value="confidential">機密</SelectItem>
                  <SelectItem value="restricted">限制</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 標籤 */}
          <div className="space-y-2">
            <Label>標籤</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="輸入標籤"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                添加
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(index)}
                      className="h-4 w-4 p-0 hover:bg-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit">
              {document ? '更新' : '創建'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
