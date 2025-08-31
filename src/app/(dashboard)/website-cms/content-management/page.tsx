import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { FileText, BookOpen, Cloud } from 'lucide-react';
import Link from 'next/link';

export default function ContentManagementPage() {
  const contentModules = [
    {
      title: '部落格文章',
      description: '管理部落格文章，包括创建、编辑、发布和下架',
      icon: BookOpen,
      href: '/blog-management/posts',
      count: 12
    },
    {
      title: '頁面內容',
      description: '管理静态页面内容，如关于我们、服务条款等',
      icon: FileText,
      href: '/content-management/pages',
      count: 6
    },
    {
      title: '媒體檔案',
      description: '管理图片、文档等媒体资源',
      icon: Cloud,
      href: '/content-management/media',
      count: 48
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">內容管理</h1>
        <p className="text-muted-foreground">管理网站的所有内容，包括文章、页面和媒体文件</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contentModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                <module.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{module.count}</div>
                <p className="text-xs text-muted-foreground">{module.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
