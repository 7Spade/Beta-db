import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { UserCheck, Users, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function HRManagementPage() {
    const hrModules = [
        {
            title: '團隊成員',
            description: '管理內部團隊成員資料和資訊',
            icon: Users,
            href: '/resource-management/hr/members',
            count: 24,
            status: 'active'
        },
        {
            title: '出勤管理',
            description: '追蹤員工出勤和工時記錄',
            icon: UserCheck,
            href: '/resource-management/hr/attendance',
            count: 156,
            status: 'monitoring'
        },
        {
            title: '技能清單',
            description: '管理團隊成員技能和專長',
            icon: Wrench,
            href: '/resource-management/hr/skills',
            count: 8,
            status: 'active'
        }
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">人力資源管理</h1>
                <p className="text-muted-foreground">管理團隊成員、出勤和技能發展</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hrModules.map((module) => (
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
