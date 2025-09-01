'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Label } from '@/ui/label';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { Skeleton } from '@/ui/skeleton';
import { BarChart3, Bell, Database, Palette, Settings, Shield, Users } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SystemManagementPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  const systemModules = [
    {
      title: '用戶管理',
      description: '管理後台使用者、權限和角色',
      icon: Users,
      href: '/website-cms/user',
      count: 24,
      status: 'active'
    },
    {
      title: '數據統計',
      description: '查看網站訪問統計和分析',
      icon: BarChart3,
      href: '/system/analytics',
      count: 156,
      status: 'monitoring'
    }
  ];

  const systemStatus = {
    uptime: '99.9%',
    lastBackup: '2024-01-15 02:00',
    activeUsers: 12,
    systemLoad: '45%'
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">系統管理</h1>
        <p className="text-muted-foreground">管理系統設定、使用者權限和系統監控</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {systemModules.map((module) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              系統狀態
            </CardTitle>
            <CardDescription>當前系統運行狀態</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">系統運行時間</span>
                <span className="text-sm text-green-600 font-bold">{systemStatus.uptime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">最後備份</span>
                <span className="text-sm text-muted-foreground">{systemStatus.lastBackup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">活躍用戶</span>
                <span className="text-sm text-blue-600 font-bold">{systemStatus.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">系統負載</span>
                <span className="text-sm text-orange-600 font-bold">{systemStatus.systemLoad}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              外觀設定
            </CardTitle>
            <CardDescription>自訂您應用程式的外觀與感覺</CardDescription>
          </CardHeader>
          <CardContent>
            {!mounted ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            ) : (
              <RadioGroup
                value={theme}
                onValueChange={setTheme}
                aria-label="主題選擇"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">淺色</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">深色</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">系統</Label>
                </div>
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              快速操作
            </CardTitle>
            <CardDescription>常用系统操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                新增用戶
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 h-4 w-4" />
                系統備份
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                通知設定
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                進階設定
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              關於系統
            </CardTitle>
            <CardDescription>查看應用程式的版本資訊</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">版本</p>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              <div>
                <p className="text-sm font-medium">最後更新</p>
                <p className="text-sm text-muted-foreground">2024-01-22</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
