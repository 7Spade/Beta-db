import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';
import { Label } from '@/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          聯絡我們
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          有任何問題或合作提案嗎？我們很樂意聽見您的聲音。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">聯絡資訊</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:contact@example.com" className="hover:text-primary">contact@example.com</a>
              </p>
              <p className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-primary" />
                <span>(02) 1234-5678</span>
              </p>
              <p className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span>台灣台北市信義區信義路五段7號</span>
              </p>
            </div>
          </div>
          <div>
            {/* Placeholder for a map */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">地圖位置</p>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>傳送訊息給我們</CardTitle>
            <CardDescription>請填寫下方的表單，我們會盡快回覆您。</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">您的姓名</Label>
                <Input id="name" placeholder="王大明" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">主旨</Label>
                <Input id="subject" placeholder="合作提案" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">訊息內容</Label>
                <Textarea id="message" placeholder="請在此輸入您的訊息..." rows={5} />
              </div>
              <Button type="submit" className="w-full">送出訊息</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
