import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Handshake } from 'lucide-react';
import Link from 'next/link';

export default function ContactManagementPage() {
  const contactModules = [
    {
      title: '諮詢管理',
      description: '查看和管理收到的联系表单和客户咨询',
      icon: MessageSquare,
      href: '/contact-management/inquiries',
      count: 18,
      status: 'new'
    },
    {
      title: '合作夥伴',
      description: '管理合作伙伴信息和关系',
      icon: Handshake,
      href: '/contact-management/partners',
      count: 12,
      status: 'active'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">聯絡管理</h1>
        <p className="text-muted-foreground">管理客户咨询和合作伙伴关系</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contactModules.map((module) => (
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
                    {module.status === 'active' ? '活躍' : '新諮詢'}
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
            <CardTitle>聯絡統計</CardTitle>
            <CardDescription>最近的客户联系活动概览</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">18</div>
                <div className="text-sm text-muted-foreground">新諮詢</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">合作夥伴</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-muted-foreground">回覆率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
