'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, Upload } from 'lucide-react';
import { useState } from 'react';
import type { Document, DocumentStatus, DocumentType } from '../../types/document.types';
import { convertTimestamp } from '../../utils';
import { DocumentCard } from './document-card';
import { DocumentForm } from './document-form';

interface DocumentListProps {
  documents: Document[];
  onDocumentCreate: () => Promise<void>;
  onDocumentUpdate: () => Promise<void>;
  onDocumentDelete: () => Promise<void>;
  isLoading?: boolean;
}

export function DocumentList({
  documents,
  onDocumentCreate,
  onDocumentUpdate,
  onDocumentDelete,
  isLoading = false,
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'type' | 'status' | 'createdAt'>('createdAt');
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

  const filteredDocuments = (documents || [])
    .filter(document => {
      const matchesSearch = document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (document.description && document.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || document.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = a.createdAt instanceof Date ? a.createdAt.getTime() :
            a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() :
              convertTimestamp(a.createdAt).getTime();
          bValue = b.createdAt instanceof Date ? b.createdAt.getTime() :
            b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() :
              convertTimestamp(b.createdAt).getTime();
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
    await onDocumentCreate();
    setShowForm(false);
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

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'review':
        return '審查中';
      case 'approved':
        return '已核准';
      case 'published':
        return '已發布';
      case 'archived':
        return '已封存';
      default:
        return status;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* 標題和操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">文件管理</h3>
          <Badge variant="secondary">{filteredDocuments.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新增文件
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            上傳文件
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
                  placeholder="搜索文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DocumentType | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="類型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有類型</SelectItem>
                <SelectItem value="contract">合約</SelectItem>
                <SelectItem value="proposal">提案</SelectItem>
                <SelectItem value="report">報告</SelectItem>
                <SelectItem value="specification">規格書</SelectItem>
                <SelectItem value="manual">手冊</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DocumentStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="狀態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有狀態</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="review">審查中</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="published">已發布</SelectItem>
                <SelectItem value="archived">已封存</SelectItem>
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field as 'title' | 'type' | 'status' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">日期 (新到舊)</SelectItem>
                <SelectItem value="createdAt-asc">日期 (舊到新)</SelectItem>
                <SelectItem value="title-asc">標題 (A-Z)</SelectItem>
                <SelectItem value="title-desc">標題 (Z-A)</SelectItem>
                <SelectItem value="type-asc">類型 (A-Z)</SelectItem>
                <SelectItem value="type-desc">類型 (Z-A)</SelectItem>
                <SelectItem value="status-asc">狀態 (A-Z)</SelectItem>
                <SelectItem value="status-desc">狀態 (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 文件列表 */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">載入中...</div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>沒有找到文件</p>
              <p className="text-sm">點擊上方按鈕新增第一個文件</p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onUpdate={onDocumentUpdate}
              onDelete={onDocumentDelete}
            />
          ))
        )}
      </div>

      {/* 新增表單 */}
      {showForm && (
        <DocumentForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
