
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Briefcase, MapPin, DollarSign, Mail } from 'lucide-react';

const jobOpenings = [
  {
    title: '前端工程師 (Next.js)',
    location: '遠端',
    type: '全職',
    salary: 'NTD 1,200,000 - 1,800,000 / 年',
    description: '負責開發和維護我們的 Next.js 應用程式，與 UI/UX 設計師和後端工程師緊密合作，打造一流的使用者體驗。'
  },
  {
    title: '後端工程師 (Firebase & Genkit)',
    location: '遠端',
    type: '全職',
    salary: 'NTD 1,300,000 - 2,000,000 / 年',
    description: '設計、開發和維護我們基於 Firebase 和 Genkit 的後端服務，確保系統的高效能、高可用性和安全性。'
  },
  {
    title: '產品經理',
    location: '遠端',
    type: '全職',
    salary: 'NTD 1,500,000 - 2,200,000 / 年',
    description: '負責產品路線圖規劃、使用者需求分析和專案管理，推動產品從概念到上線的全過程。'
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          加入我們的行列
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          我們正在尋找充滿熱情、才華洋溢的夥伴，一同為營造產業帶來變革。
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">目前的職位空缺</h2>
        
        <div className="space-y-6">
          {jobOpenings.map((job) => (
            <Card key={job.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 md:mt-0">
                        <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.type}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    </div>
                </div>
                 <div className="flex items-center gap-2 text-sm text-primary pt-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{job.description}</p>
                <Button asChild>
                  <a href="mailto:careers@example.com?subject=應徵職位：{job.title}">
                     立即應徵 <Mail className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
