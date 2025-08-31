import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { FileText, Edit, Eye } from 'lucide-react';

export default function PagesManagementPage() {
  const pages = [
    {
      id: 'about',
      title: '關於我們',
      description: '公司介紹、團隊資訊、使命願景',
      status: 'published',
      lastModified: '2024-01-15',
      path: '/about'
    },
    {
      id: 'privacy-policy',
      title: '隱私權政策',
      description: '使用者隱私保護政策和使用條款',
      status: 'published',
      lastModified: '2024-01-10',
      path: '/privacy-policy'
    },
    {
      id: 'terms-of-service',
      title: '服務條款',
      description: '服務使用條款和條件',
      status: 'published',
      lastModified: '2024-01-10',
      path: '/terms-of-service'
    },
    {
      id: 'careers',
      title: '企業徵才',
      description: '徵才資訊和職位列表',
      status: 'published',
      lastModified: '2024-01-12',
      path: '/careers'
    },
    {
      id: 'contact',
      title: '聯絡我們',
      description: '聯絡方式和聯絡表單',
      status: 'published',
      lastModified: '2024-01-08',
      path: '/contact'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">頁面內容管理</h1>
          <p className="text-muted-foreground">管理網站的靜態頁面內容</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          新增頁面
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{page.title}</CardTitle>
                  <CardDescription className="mt-2">{page.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    預覽
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    編輯
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>路徑: {page.path}</span>
                <span>最後修改: {page.lastModified}</span>
                <span className="capitalize">狀態: {page.status}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
