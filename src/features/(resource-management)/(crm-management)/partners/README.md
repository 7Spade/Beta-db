# 合作夥伴核心元件 (Partner Core Components)

此目錄存放 `PartnerVerse` 模組中與合作夥伴實體本身最直接相關的核心元件，是整個模組的基礎。

## 子目錄結構

- **`list/`**: 包含 `PartnerList.tsx`，一個複雜的元件，用於以卡片形式顯示所有合作夥伴，並提供了搜尋和篩選功能。
- **`profile/`**: 包含 `PartnerProfile.tsx` 和 `ProfileHeader.tsx`，共同構成了單一合作夥伴的完整詳細資料視圖，並使用標籤頁 (Tabs) 來組織不同維度的資訊。
- **`forms/`**: 包含 `PartnerForm.tsx`，一個用於新增或編輯合作夥伴資料的對話方塊表單。

這種結構將合作夥伴的「列表 (`list`)」、「詳細資料 (`profile`)」和「資料操作 (`forms`)」這三個核心關注點清晰地分開，有助於管理和維護。
