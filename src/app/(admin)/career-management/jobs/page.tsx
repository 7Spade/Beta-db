import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { Briefcase, MapPin, DollarSign, Calendar, Edit, Trash2, Eye } from 'lucide-react';

export default function JobsManagementPage() {
  const jobs = [
    {
      id: '1',
      title: '前端工程師 (Next.js)',
      location: '遠端',
      type: '全職',
      salary: 'NTD 1,200,000 - 1,800,000 / 年',
      description: '負責開發和維護我們的 Next.js 應用程式，與 UI/UX 設計師和後端工程師緊密合作，打造一流的使用者體驗。',
      status: 'active',
      applications: 12,
      postedAt: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: '2',
      title: '後端工程師 (Firebase & Genkit)',
      location: '遠端',
      type: '全職',
      salary: 'NTD 1,300,000 - 2,000,000 / 年',
      description: '設計、開發和維護我們基於 Firebase 和 Genkit 的後端服務，確保系統的高效能、高可用性和安全性。',
      status: 'active',
      applications: 8,
      postedAt: '2024-01-12',
      deadline: '2024-02-12'
    },
    {
      id: '3',
      title: '產品經理',
      location: '遠端',
      type: '全職',
      salary: 'NTD 1,500,000 - 2,200,000 / 年',
      description: '負責產品路線圖規劃、使用者需求分析和專案管理，推動產品從概念到上線的全過程。',
      status: 'draft',
      applications: 0,
      postedAt: '2024-01-10',
      deadline: '2024-02-10'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">已發布</Badge>;
      case 'draft':
        return <Badge variant="secondary">草稿</Badge>;
      case 'closed':
        return <Badge variant="destructive">已關閉</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">職位管理</h1>
          <p className="text-muted-foreground">管理招聘职位，包括发布、编辑和下架</p>
        </div>
        <Button>
          <Briefcase className="mr-2 h-4 w-4" />
          新增職位
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </span>
                  </div>
                  <CardDescription className="text-base">{job.description}</CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    預覽
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    編輯
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    刪除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    發布: {job.postedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    截止: {job.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span>應聘者: {job.applications}</span>
                  <Button variant="outline" size="sm">
                    查看申請
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
