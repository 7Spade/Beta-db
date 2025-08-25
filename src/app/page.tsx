import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wrench, ShieldCheck, Activity } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            領先的精密設備整合服務專家
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            從前期評估、客製化設計到無塵室整合與持續維護，我們提供一站式的解決方案，最大化您的生產效益。
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/contact">諮詢方案</Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">核心服務</h2>
              <p className="text-muted-foreground mt-2">一個平台，滿足您所有的整合需求</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">客製化解決方案</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  深入了解您的製程需求，我們設計並打造完全符合您生產線的精密自動化設備與系統。
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">無塵室環境整合</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  具備豐富的無塵室設備安裝與整合經驗，確保您的生產環境符合最嚴格的潔淨度標準。
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">持續性維護與優化</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  提供即時的技術支援與定期的設備維護服務，並持續為您提出製程優化建議，確保系統穩定運行。
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
