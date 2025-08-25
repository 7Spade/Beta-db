
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FolderKanban, Users, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto h-20 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Constructo</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">登入</Link>
          </Button>
          <Button asChild>
            <Link href="/register">立即開始</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            為營造業打造的次世代管理平台
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            從專案規劃、合約管理到團隊協作，Constructo 將所有流程整合在一個強大且直觀的平台中。
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/register">免費試用</Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">核心功能</h2>
              <p className="text-muted-foreground mt-2">一個平台，滿足您所有的營運需求</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FolderKanban className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">專案管理</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  視覺化的任務板、進度追蹤和價值計算，讓專案狀態一目了然。
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">合約與文件</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  AI 智能解析文件，自動生成工料清單並快速建立合約。
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">夥伴與團隊</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  管理您的合作夥伴、內部團隊、技能庫和工法，實現高效協作。
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Constructo. All rights reserved.</p>
      </footer>
    </div>
  )
}
