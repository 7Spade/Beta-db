import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { ArrowLeftRight, Package, Truck, Warehouse } from 'lucide-react';
import Link from 'next/link';

export default function InventoryManagementPage() {
    const inventoryModules = [
        {
            title: '物料主檔',
            description: '管理所有物料的基礎資訊和規格',
            icon: Package,
            href: '/resource-management/inventory/items',
            count: 156,
            status: 'active'
        },
        {
            title: '出入庫紀錄',
            description: '追蹤物料的進出庫記錄和庫存變動',
            icon: ArrowLeftRight,
            href: '/resource-management/inventory/movements',
            count: 48,
            status: 'monitoring'
        },
        {
            title: '跨倉調撥',
            description: '管理不同倉庫間的物料調撥',
            icon: Truck,
            href: '/resource-management/inventory/transfers',
            count: 12,
            status: 'active'
        },
        {
            title: '倉庫管理',
            description: '管理倉庫基本資訊和庫位配置',
            icon: Warehouse,
            href: '/resource-management/inventory/warehouses',
            count: 8,
            status: 'active'
        }
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">庫存管理</h1>
                <p className="text-muted-foreground">管理物料、倉庫和庫存追蹤系統</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inventoryModules.map((module) => (
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
