
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

export default function CareerManagementPage() {
  const careerModules = [
    {
      title: '職位管理',
      description: '發布、編輯和管理招聘職位資訊',
      icon: Briefcase,
      href: '/website-cms/career/jobs',
      count: 3,
      status: 'active'
    },
    {
      title: '應徵者管理',
      description: '查看和管理收到的履歷和應徵資訊',
      icon: Users,
      href: '/website-cms/career/applications',
      count: 15,
      status: 'new'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">招聘管理</h1>
        <p className="text-muted-foreground">管理招聘職位和應徵者資訊</p>
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
