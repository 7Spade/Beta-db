# Utils 工具庫

## 日期選擇器工具 (date-picker.tsx)

### 概述
這個工具提供了多種日期選擇器組件，直接基於現有的 `@/components/ui/calendar` 組件，無需依賴 `@/components/shared/form-date-picker.tsx`。

### 組件列表

#### 1. DatePicker
基礎的單一日期選擇器組件。

```tsx
import { DatePicker } from '@/utils/date-picker';

<DatePicker 
  field={field} 
  placeholder="選擇日期"
  className="custom-class"
  disabled={false}
/>
```

#### 2. DateRangePicker
日期範圍選擇器，包含起始和結束日期。

```tsx
import { DateRangePicker } from '@/utils/date-picker';

<DateRangePicker
  startField={startDateField}
  endField={endDateField}
  startPlaceholder="起始日期"
  endPlaceholder="結束日期"
/>
```

#### 3. FormDateField
與 react-hook-form 整合的日期欄位組件。

```tsx
import { FormDateField } from '@/utils/date-picker';

<FormDateField
  field={field}
  label="日期"
  placeholder="選擇日期"
/>
```

#### 4. FormDateRangeField
與 react-hook-form 整合的日期範圍欄位組件。

```tsx
import { FormDateRangeField } from '@/utils/date-picker';

<FormDateField
  startField={startField}
  endField={endField}
  startLabel="起始日期"
  endLabel="結束日期"
/>
```

### 工具函數

#### dateUtils
提供常用的日期操作函數：

```tsx
import { dateUtils } from '@/utils/date-picker';

// 格式化日期
dateUtils.format(date, 'MM/dd/yyyy');
dateUtils.formatShort(date);
dateUtils.formatLong(date);

// 日期驗證
dateUtils.isValid(date);
dateUtils.isFuture(date);
dateUtils.isPast(date);
dateUtils.isToday(date);
```

### 優勢

1. **直接使用現有組件**：基於 `@/components/ui/calendar`，無需額外依賴
2. **更靈活的配置**：支援自定義樣式、佔位符、禁用狀態等
3. **更好的類型安全**：完整的 TypeScript 支援
4. **符合 DRY 原則**：避免重複的日期選擇器實現
5. **易於維護**：統一的日期選擇器邏輯

### 遷移指南

從舊的 `FormDatePicker` 遷移到新的工具：

```tsx
// 舊版本
import { FormDatePicker } from '@/components/shared/form-date-picker';
<FormDatePicker field={field} />

// 新版本
import { DatePicker } from '@/utils/date-picker';
<DatePicker field={field} placeholder="選擇日期" />
```

### 使用範例

#### 在合約表單中使用
```tsx
import { DatePicker } from '@/utils/date-picker';

<FormField
  control={form.control}
  name="startDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel>起始日期</FormLabel>
      <FormControl>
        <DatePicker field={field} placeholder="選擇起始日期" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### 在專案表單中使用
```tsx
import { FormDateRangeField } from '@/utils/date-picker';

<FormDateRangeField
  startField={startDateField}
  endField={endDateField}
  startLabel="專案開始"
  endLabel="專案結束"
/>
```
