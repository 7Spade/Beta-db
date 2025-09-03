'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Paperclip, Plus, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import type { Attachment } from '../../types/document.types';
import { AttachmentCard } from './attachment-card';
import { AttachmentForm } from './attachment-form';

interface AttachmentListProps {
  attachments: Attachment[];
  onAttachmentCreate: () => Promise<void>;
  onAttachmentDelete: () => Promise<void>;
  isLoading?: boolean;
}

export function AttachmentList({
  attachments,
  onAttachmentCreate,
  onAttachmentDelete,
  isLoading = false,
}: AttachmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'uploadedAt' | 'fileSize'>('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showForm, setShowForm] = useState(false);

  const formatDate = (date: Date | any) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('zh-TW');
    } else if (date && date.toDate) {
      return date.toDate().toLocaleDateString('zh-TW');
    } else if (date) {
      return new Date(date).toLocaleDateString('zh-TW');
    }
    return '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAttachments = (attachments || [])
    .filter(attachment => {
      const matchesSearch = attachment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (attachment.description && attachment.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'uploadedAt':
          aValue = a.uploadedAt instanceof Date ? a.uploadedAt.getTime() : 
                  a.uploadedAt && a.uploadedAt.toMillis ? a.uploadedAt.toMillis() : 
                  new Date(a.uploadedAt).getTime();
          bValue = b.uploadedAt instanceof Date ? b.uploadedAt.getTime() : 
                  b.uploadedAt && b.uploadedAt.toMillis ? b.uploadedAt.toMillis() : 
                  new Date(b.uploadedAt).getTime();
          break;
        case 'fileSize':
          aValue = a.fileSize;
          bValue = b.fileSize;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleCreate = async () => {
    await onAttachmentCreate();
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* 標題和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">附件管理</h3>
          <Badge variant="secondary">{filteredAttachments.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新增附件
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            批量上傳
          </Button>
        </div>
      </div>

      {/* 搜索和篩選 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索附件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 附件列表 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">載入中...</div>
        ) : filteredAttachments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Paperclip className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>沒有找到附件</p>
              <p className="text-sm">點擊上方按鈕新增第一個附件</p>
            </CardContent>
          </Card>
        ) : (
          filteredAttachments.map((attachment) => (
            <AttachmentCard
              key={attachment.id}
              attachment={attachment}
              onDelete={onAttachmentDelete}
            />
          ))
        )}
      </div>

      {/* 新增表單 */}
      {showForm && (
        <AttachmentForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
