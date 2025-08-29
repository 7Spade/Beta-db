import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Briefcase, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function CareerManagementPage() {
  const careerModules = [
    {
      title: '職位管理',
      description: '发布、编辑和管理招聘职位信息',
      icon: Briefcase,
      href: '/career-management/jobs',
      count: 8,
      status: 'active'
    },
    {
      title: '應聘者管理',
      description: '查看和管理收到的简历和应聘信息',
      icon: UserCheck,
      href: '/career-management/applications',
      count: 24,
      status: 'new'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">招聘管理</h1>
        <p className="text-muted-foreground">管理招聘职位和应聘者信息</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                <module.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{module.count}</div>
                <p className="text-xs text-muted-foreground">{module.description}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    module.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {module.status === 'active' ? '活躍' : '新申請'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>招聘統計</CardTitle>
            <CardDescription>最近的招聘活动概览</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-muted-foreground">開放職位</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">應聘者</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-sm text-muted-foreground">面試中</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
