'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Eye,
  FileText,
  Trash2,
  Calendar,
  User,
  Tag,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import type { Document, DocumentType, DocumentStatus } from '../../types/document.types';

interface DocumentCardProps {
  document: Document;
  onUpdate: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function DocumentCard({ document, onUpdate, onDelete }: DocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public':
        return 'bg-green-100 text-green-800';
      case 'internal':
        return 'bg-blue-100 text-blue-800';
      case 'confidential':
        return 'bg-yellow-100 text-yellow-800';
      case 'restricted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = () => {
    // TODO: 實現文件下載功能
    window.open(document.fileUrl, '_blank');
  };

  const handlePreview = () => {
    // TODO: 實現文件預覽功能
    window.open(document.fileUrl, '_blank');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-sm truncate">{document.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(document.type)}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(document.status)}`}>
                  {getStatusLabel(document.status)}
                </Badge>
                <Badge className={`text-xs ${getAccessLevelColor(document.accessLevel)}`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {getAccessLevelLabel(document.accessLevel)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(document.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {document.createdBy}
                </div>
                <div className="text-xs">
                  版本: {document.version}
                </div>
                <div className="text-xs">
                  {formatFileSize(document.fileSize)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                className="h-8 w-8 p-0"
                title="預覽"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
                title="下載"
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUpdate}
                className="h-8 w-8 p-0"
                title="編輯"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                title="刪除"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* 描述 */}
              {document.description && (
                <div>
                  <h5 className="text-sm font-medium mb-2">描述</h5>
                  <p className="text-sm text-gray-700">{document.description}</p>
                </div>
              )}

              {/* 文件信息 */}
              <div>
                <h5 className="text-sm font-medium mb-2">文件信息</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">文件名:</span>
                    <span className="ml-2">{document.fileName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">文件大小:</span>
                    <span className="ml-2">{formatFileSize(document.fileSize)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">MIME 類型:</span>
                    <span className="ml-2">{document.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">版本:</span>
                    <span className="ml-2">{document.version}</span>
                  </div>
                </div>
              </div>

              {/* 標籤 */}
              {document.tags && document.tags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">標籤</h5>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 分類 */}
              {document.category && (
                <div>
                  <h5 className="text-sm font-medium mb-2">分類</h5>
                  <Badge variant="outline" className="text-xs">
                    {document.category}
                  </Badge>
                </div>
              )}

              {/* 發布信息 */}
              {document.publishedDate && (
                <div>
                  <h5 className="text-sm font-medium mb-2">發布信息</h5>
                  <div className="text-sm text-gray-700">
                    發布日期: {formatDate(document.publishedDate)}
                  </div>
                </div>
              )}

              {/* 封存信息 */}
              {document.archivedDate && (
                <div>
                  <h5 className="text-sm font-medium mb-2">封存信息</h5>
                  <div className="text-sm text-gray-700">
                    封存日期: {formatDate(document.archivedDate)}
                  </div>
                </div>
              )}

              {/* 更新信息 */}
              <div>
                <h5 className="text-sm font-medium mb-2">更新信息</h5>
                <div className="text-sm text-gray-700">
                  最後更新: {formatDate(document.updatedAt)} by {document.updatedBy}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
