
'use client' 

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在這裡記錄錯誤到一個報告服務
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>糟糕，發生了一些錯誤！</CardTitle>
          <CardDescription>
            我們遇到了一個非預期的問題。您可以嘗試重新整理頁面。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded-md text-destructive text-sm">
            <p className="font-semibold">錯誤訊息:</p>
            <p>{error.message || "未知的錯誤"}</p>
          </div>
          <Button
            onClick={() => reset()}
            className="w-full"
          >
            再試一次
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
