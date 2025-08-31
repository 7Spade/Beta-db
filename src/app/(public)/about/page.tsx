import { Card, CardContent, CardTitle } from '@/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';
import { Goal, Handshake } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          關於 Beta-db
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          我們致力於透過創新的技術，為營造產業帶來革命性的改變。
        </p>
      </div>

      <div className="space-y-16">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="團隊合作"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                  data-ai-hint="team collaboration"
                />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                 <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Goal className="h-8 w-8 text-primary" />
                 </div>
                 <h2 className="text-2xl font-bold">我們的使命</h2>
              </div>
              <p className="text-muted-foreground">
                我們的使命是將複雜的營造專案管理流程簡化、數據化、智能化，讓每一個專案都能更高效、更透明地完成。我們相信，科技是推動產業進步的核心動力。
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="overflow-hidden">
          <div className="md:flex md:flex-row-reverse">
             <div className="md:w-1/2">
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="我們的價值觀"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                  data-ai-hint="values integrity"
                />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                    <Handshake className="h-8 w-8 text-primary" />
                 </div>
                <h2 className="text-2xl font-bold">我們的價值觀</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li><span className="font-semibold text-foreground">客戶至上：</span> 您的成功，就是我們的成功。</li>
                <li><span className="font-semibold text-foreground">追求卓越：</span> 我們從不滿足於現狀，永遠追求更好的產品與服務。</li>
                <li><span className="font-semibold text-foreground">誠信正直：</span> 以最真誠的態度對待每一位客戶與合作夥伴。</li>
              </ul>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-3xl font-bold text-center mb-8">認識我們的團隊</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: '陳小明', role: '執行長 & 創辦人', avatar: 'https://placehold.co/128x128.png' },
              { name: '林美麗', role: '產品總監', avatar: 'https://placehold.co/128x128.png' },
              { name: '王大衛', role: '技術長', avatar: 'https://placehold.co/128x128.png' },
            ].map((member) => (
              <Card key={member.name} className="text-center p-6">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background ring-2 ring-primary">
                  <AvatarImage src={member.avatar} data-ai-hint="person face" />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardContent className="p-0">
                  <p className="text-primary font-semibold">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
