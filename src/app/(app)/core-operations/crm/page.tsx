import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function CRMManagementPage() {
    const crmModules = [
        {
            title: '合作夥伴',
            description: '管理合作夥伴資訊和關係維護',
            icon: Users,
            href: '/resource-management/crm/partners',
            count: 12,
            status: 'active'
        },
        {
            title: '工作流程',
            description: '管理客戶關係相關的工作流程',
            icon: DollarSign,
            href: '/resource-management/crm/workflows',
            count: 8,
            status: 'active'
        }
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">客戶關係管理</h1>
                <p className="text-muted-foreground">管理合作夥伴關係和工作流程</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {crmModules.map((module) => (
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
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${module.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {module.status === 'active' ? '活躍' : '監控中'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
