# 團隊成員元件 (Team Members Components)

此目錄包含所有與「同伴列表」功能 (`/team/members`) 相關的 React 元件。

## 元件

- **`create-member-dialog.tsx`**: 一個功能完整的對話方塊元件，包含了新增團隊成員的表單和 Zod 驗證邏輯。
- **`page.tsx` (`TeamMembersPage`)**: 頁面主元件，負責從 Firestore 獲取團隊成員列表，並以卡片形式展示每個成員的資訊。它也處理載入狀態和空狀態的顯示。

請將任何用於 `/team/members` 頁面的新元件放置於此。
