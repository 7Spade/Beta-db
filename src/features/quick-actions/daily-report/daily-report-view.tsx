'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Calendar } from 'lucide-react'

export function DailyReportView() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-6 w-6" />
        <h1 className="text-2xl font-bold">日報表</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>日報表管理</CardTitle>
          <CardDescription>
            管理日常施工報告和進度記錄
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            日報表功能開發中...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

