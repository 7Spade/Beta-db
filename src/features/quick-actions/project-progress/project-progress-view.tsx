'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Activity } from 'lucide-react'

export function ProjectProgressView() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="h-6 w-6" />
        <h1 className="text-2xl font-bold">施工進度</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>進度追蹤</CardTitle>
          <CardDescription>
            追蹤和管理施工項目進度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            施工進度功能開發中...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

