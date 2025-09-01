import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Cloud, FileText, Handshake, Users, Warehouse } from 'lucide-react';
import Link from 'next/link';

export default function ResourceManagementPage() {
    const resourceModules = [
        {
            title: '人力資源',
            description: '管理團隊成員、出勤和技能清單',
            icon: Users,
            href: '/resource-management/hr',
            count: 24,
            status: 'active'
        },
        {
            title: '庫存管理',
            description: '管理物料、倉庫和庫存追蹤',
            icon: Warehouse,
            href: '/resource-management/inventory',
            count: 156,
            status: 'monitoring'
        },
        {
            title: '客戶關係',
            description: '管理合作夥伴和工作流程',
            icon: Handshake,
            href: '/resource-management/crm',
            count: 8,
            status: 'active'
        },
        {
            title: '雲端硬碟',
            description: '文件存儲和雲端管理',
            icon: Cloud,
            href: '/resource-management/document/cloud-drive',
            count: 48,
            status: 'active'
        },
        {
            title: '文件解析',
            description: '智能文件處理和分析',
            icon: FileText,
            href: '/resource-management/document/docu-parse',
            count: 12,
            status: 'active'
        }
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">資源管理</h1>
                <p className="text-muted-foreground">管理人力、庫存、客戶關係和文件資源</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resourceModules.map((module) => (
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
