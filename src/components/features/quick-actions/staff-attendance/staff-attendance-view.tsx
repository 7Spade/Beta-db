'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck } from 'lucide-react'

export function StaffAttendanceView() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <UserCheck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">人員出勤</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>出勤管理</CardTitle>
          <CardDescription>
            管理施工人員出勤記錄和統計
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            人員出勤功能開發中...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
