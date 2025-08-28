import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Upload, Search, FileText, Video } from 'lucide-react';
import NextImage from 'next/image';

export default function MediaManagementPage() {
  const mediaFiles = [
    {
      id: '1',
      name: 'team-photo.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      url: 'https://placehold.co/300x200.png',
      category: '團隊照片'
    },
    {
      id: '2',
      name: 'company-logo.png',
      type: 'image',
      size: '156 KB',
      uploadedAt: '2024-01-10',
      url: 'https://placehold.co/200x100.png',
      category: '品牌資產'
    },
    {
      id: '3',
      name: 'service-brochure.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadedAt: '2024-01-08',
      url: '#',
      category: '文檔'
    },
    {
      id: '4',
      name: 'product-demo.mp4',
      type: 'video',
      size: '15.7 MB',
      uploadedAt: '2024-01-05',
      url: '#',
      category: '影片'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'document':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">媒體檔案管理</h1>
          <p className="text-muted-foreground">管理网站的图片、文档和视频等媒体资源</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          上傳檔案
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜尋檔案..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mediaFiles.map((file) => (
          <Card key={file.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {file.type === 'image' ? (
                <NextImage 
                  src={file.url} 
                  alt={file.name} 
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              ) : (
                getFileIcon(file.type)
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm truncate">{file.name}</CardTitle>
              <CardDescription className="text-xs">{file.category}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{file.size}</span>
                <span>{file.uploadedAt}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  下載
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  編輯
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
