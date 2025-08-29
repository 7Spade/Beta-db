import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';

export function AdminDashboardView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">管理後台</h1>
        <p className="text-muted-foreground">這裡是您的系統管理總覽。</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>歡迎回來！</CardTitle>
          <CardDescription>
            從這裡開始管理您的網站內容。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>儀表板內容正在建置中...</p>
        </CardContent>
      </Card>
    </div>
  );
}
