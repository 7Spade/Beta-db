import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { UserCheck, Mail, Calendar, Download, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function ApplicationsManagementPage() {
  const applications = [
    {
      id: '1',
      name: '王小明',
      email: 'wang@example.com',
      position: '前端工程師 (Next.js)',
      status: 'pending',
      appliedAt: '2024-01-15',
      experience: '3年',
      resume: 'resume-1.pdf'
    },
    {
      id: '2',
      name: '林美麗',
      email: 'lin@example.com',
      position: '後端工程師 (Firebase & Genkit)',
      status: 'reviewed',
      appliedAt: '2024-01-14',
      experience: '5年',
      resume: 'resume-2.pdf'
    },
    {
      id: '3',
      name: '張大衛',
      email: 'zhang@example.com',
      position: '產品經理',
      status: 'interviewed',
      appliedAt: '2024-01-13',
      experience: '7年',
      resume: 'resume-3.pdf'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">待審查</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">已審查</Badge>;
      case 'interviewed':
        return <Badge className="bg-orange-100 text-orange-800">面試中</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800">已錄取</Badge>;
      case 'rejected':
        return <Badge variant="destructive">已拒絕</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">應聘者管理</h1>
          <p className="text-muted-foreground">查看和管理收到的简历和应聘信息</p>
        </div>
        <Button>
          <UserCheck className="mr-2 h-4 w-4" />
          匯出資料
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{application.name}</CardTitle>
                    {getStatusBadge(application.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      應徵時間: {application.appliedAt}
                    </span>
                    <span>經驗: {application.experience}</span>
                  </div>
                  <CardDescription className="text-base">應徵職位: {application.position}</CardDescription>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    查看
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    下載履歷
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">履歷檔案: {application.resume}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    錄取
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    拒絕
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
