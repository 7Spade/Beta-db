import { Card, CardContent } from '@/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          隱私權政策
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          最後更新日期：{new Date().toLocaleDateString('zh-TW')}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6 prose prose-lg dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-bold">一、前言</h2>
            <p>
              歡迎您使用 Beta-db（以下稱「本服務」）。我們非常重視您的隱私權，因此制訂了本隱私權政策。請您在使用本服務前，詳細閱讀並了解本政策的內容。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold">二、我們收集的資訊</h2>
            <p>
              當您註冊或使用本服務時，我們可能會收集您的個人資訊，包括但不限於：姓名、電子郵件地址、聯絡電話、公司名稱等。我們也可能收集您在使用本服務過程中產生的數據，例如專案資料、上傳的文件、以及 AI 服務的使用紀錄。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">三、資訊的使用</h2>
            <p>
              我們收集的資訊將用於以下目的：
            </p>
            <ul>
              <li>提供、維護及改善本服務的功能。</li>
              <li>與您聯繫，回覆您的詢問或提供客戶支援。</li>
              <li>進行數據分析與研究，以提升服務品質。</li>
              <li>在取得您同意的情況下，向您發送行銷資訊。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold">四、資訊的分享與揭露</h2>
            <p>
              除非有以下情況，否則我們不會向任何第三方分享您的個人資訊：
            </p>
            <ul>
              <li>已取得您的明確同意。</li>
              <li>根據法律、法規、法律程序或政府機關的強制性要求。</li>
              <li>為執行本服務條款，或為保護本服務、使用者或公眾的權利、財產或安全。</li>
            </ul>
          </section>
          
           <section>
            <h2 className="text-2xl font-bold">五、政策的修訂</h2>
            <p>
              我們可能會不時修訂本隱私權政策。當我們作出重大變更時，會在網站上張貼公告，或以其他方式通知您。建議您定期查看本政策，以了解我們如何保護您的資訊。
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
