import { Card, CardContent } from '@/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          服務條款
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          最後更新日期：{new Date().toLocaleDateString('zh-TW')}
        </p>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6 prose prose-lg dark:prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-bold">一、接受條款</h2>
            <p>
              歡迎使用 Beta-db。當您開始使用本服務時，即表示您已閱讀、瞭解並同意接受本服務條款之所有內容。如果您不同意本條款的內容，請您立即停止使用本服務。
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold">二、服務說明</h2>
            <p>
              本服務是一個專為營造產業設計的專案管理平台。您應對您透過本服務上傳、發布或傳輸的所有內容負全部責任。您同意不使用本服務從事任何非法或侵權的活動。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">三、智慧財產權</h2>
            <p>
              本服務所使用的軟體、程式、以及網站上所有內容，包括但不限於著作、圖片、檔案、資訊、資料、網站架構、網站畫面的安排、網頁設計，均由我們或其他權利人依法擁有其智慧財產權。
            </p>
          </section>
          
           <section>
            <h2 className="text-2xl font-bold">四、免責聲明</h2>
            <p>
              本服務以「現況」和「現有」的基礎提供。我們不保證服務將完全滿足您的需求，亦不保證服務不會中斷、安全可靠或完全無誤。您同意承擔使用本服務的所有風險。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold">五、條款修改</h2>
            <p>
             我們保留隨時修改本服務條款的權利，修改後的條款將公佈在本網站上，不另行個別通知。如果您在修改後繼續使用本服務，將視為您已接受該等修改。
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
