import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Wrench, ShieldCheck, Activity, CheckCircle, Users, Award } from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '精密設備系統整合服務 | 專業製程設備整合解決方案',
  description: '提供精密設備系統整合、無塵室設備安裝、製程自動化解決方案。50年經驗，服務半導體、光電、生技產業。專業團隊提供設計、安裝、維護一站式服務。',
  keywords: '精密設備整合, 系統整合服務, 無塵室設備, 製程自動化, 設備安裝維護, 半導體設備, 光電設備整合',
  openGraph: {
    title: '精密設備系統整合服務 | 專業製程設備整合解決方案',
    description: '提供精密設備系統整合、無塵室設備安裝、製程自動化解決方案。50年經驗，服務半導體、光電、生技產業。',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          精密設備系統整合服務
        </h1>
        <p className="max-w-4xl mx-auto text-xl text-muted-foreground leading-relaxed mb-8">
          專精於精密設備系統整合，提供從規劃評估、系統設計到設備安裝與維護的完整服務。
          服務涵蓋半導體、光電、生技等產業，協助客戶提升生產效率與產品品質。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">諮詢服務</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">服務項目</Link>
          </Button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">50年專業經驗</h3>
              <p className="text-muted-foreground">深耕精密設備整合領域</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">豐富專案實績</h3>
              <p className="text-muted-foreground">成功整合各類精密設備系統</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">品質認證</h3>
              <p className="text-muted-foreground">符合國際品質管理標準</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">專業服務項目</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              提供全方位的精密設備系統整合服務，滿足不同產業的專業需求
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="h-full">
              <CardHeader className="items-center pb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 text-center">系統設計與整合</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>根據客戶製程需求，進行系統分析與設計，整合各式精密設備，
                確保系統間的相容性與最佳化運行效率。</p>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• 製程分析與評估</li>
                  <li>• 系統架構設計</li>
                  <li>• 設備選型與配置</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="items-center pb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 text-center">廠務系統整合</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>專業的廠務系統規劃與整合服務，包含空調、給排水、廢氣處理等系統，
                 確保廠房環境符合生產需求與環保規範。</p>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• 廠務系統規劃設計</li>
                  <li>• 空調與環控系統</li>
                  <li>• 廢氣處理系統</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="items-center pb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 text-center">機電整合</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>專業的機電系統整合服務，包含電力、控制、自動化等系統，
                 確保設備穩定運行與生產效率提升。</p>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• 電力系統整合</li>
                  <li>• 控制系統設計</li>
                  <li>• 自動化整合</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="h-full">
              <CardHeader className="items-center pb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4 text-center">維護與技術支援</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>提供專業的設備維護服務與即時技術支援，定期系統檢測與優化，
                 確保設備穩定運行與生產連續性。</p>
                <ul className="mt-4 text-sm space-y-2">
                  <li>• 預防性維護</li>
                  <li>• 技術支援服務</li>
                  <li>• 系統效能優化</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">服務產業</h2>
            <p className="text-muted-foreground">
              深度了解各產業特性，提供符合規範的專業整合服務
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">半導體產業</h3>
              <p className="text-muted-foreground text-sm">
                晶圓製程設備、測試設備、封裝設備整合
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">產業園區</h3>
              <p className="text-muted-foreground text-sm">
                園區公共設施整合、能源與環控、智慧管理系統
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">製造業</h3>
              <p className="text-muted-foreground text-sm">
                傳統製造設備整合、智慧製造系統、生產線自動化
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">選擇我們的理由</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">專業認證</h3>
              <p className="text-sm text-muted-foreground">具備相關專業認證與豐富實務經驗</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">專業團隊</h3>
              <p className="text-sm text-muted-foreground">經驗豐富的工程團隊提供專業服務</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">品質保證</h3>
              <p className="text-sm text-muted-foreground">嚴格的品質控制與完善的售後服務</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">持續支援</h3>
              <p className="text-sm text-muted-foreground">長期的技術支援與系統優化服務</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">開始您的精密設備整合專案</h2>
          <p className="text-xl mb-8 opacity-90">
            與我們的專業團隊討論您的需求，取得客製化的解決方案
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">聯絡我們</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/portfolio">查看案例</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}