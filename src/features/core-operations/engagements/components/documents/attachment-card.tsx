'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Paperclip,
  Trash2,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { useState } from 'react';
import type { Attachment } from '../../types/document.types';

interface AttachmentCardProps {
  attachment: Attachment;
  onDelete: () => Promise<void>;
}

export function AttachmentCard({ attachment, onDelete }: AttachmentCardProps) {
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

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType.startsWith('video/')) {
      return '🎥';
    } else if (mimeType.startsWith('audio/')) {
      return '🎵';
    } else if (mimeType.includes('pdf')) {
      return '📄';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return '📝';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return '📊';
    } else if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return '📈';
    } else {
      return '📎';
    }
  };

  const handleDownload = () => {
    // TODO: 實現附件下載功能
    window.open(attachment.fileUrl, '_blank');
  };

  const handlePreview = () => {
    // TODO: 實現附件預覽功能
    window.open(attachment.fileUrl, '_blank');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getFileIcon(attachment.mimeType)}</span>
                <h4 className="font-medium text-sm truncate">{attachment.name}</h4>
                {attachment.category && (
                  <Badge variant="outline" className="text-xs">
                    {attachment.category}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(attachment.uploadedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {attachment.uploadedBy}
                </div>
                <div className="text-xs">
                  {formatFileSize(attachment.fileSize)}
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
              {attachment.description && (
                <div>
                  <h5 className="text-sm font-medium mb-2">描述</h5>
                  <p className="text-sm text-gray-700">{attachment.description}</p>
                </div>
              )}

              {/* 文件信息 */}
              <div>
                <h5 className="text-sm font-medium mb-2">文件信息</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">文件名:</span>
                    <span className="ml-2">{attachment.fileName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">文件大小:</span>
                    <span className="ml-2">{formatFileSize(attachment.fileSize)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">MIME 類型:</span>
                    <span className="ml-2">{attachment.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">上傳者:</span>
                    <span className="ml-2">{attachment.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {/* 分類 */}
              {attachment.category && (
                <div>
                  <h5 className="text-sm font-medium mb-2">分類</h5>
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {attachment.category}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
