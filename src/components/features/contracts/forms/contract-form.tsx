/**
 * @fileoverview 合約表單基礎組件
 */
'use client';

import { useFormContext } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/utils/date-picker';
import { CONTRACT_STATUSES } from '../constants';
import type { ContractFormValues } from './form-schemas';

export function ContractForm() {
  const form = useFormContext<ContractFormValues>();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>合約名稱</FormLabel>
                  <FormControl>
                      <Input placeholder="例如：市中心辦公大樓 A 棟" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>狀態</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="選擇合約狀態" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem value={CONTRACT_STATUSES.ACTIVE}>{CONTRACT_STATUSES.ACTIVE}</SelectItem>
                              <SelectItem value={CONTRACT_STATUSES.COMPLETED}>{CONTRACT_STATUSES.COMPLETED}</SelectItem>
                              <SelectItem value={CONTRACT_STATUSES.PAUSED}>{CONTRACT_STATUSES.PAUSED}</SelectItem>
                              <SelectItem value={CONTRACT_STATUSES.TERMINATED}>{CONTRACT_STATUSES.TERMINATED}</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="contractor"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>承包商</FormLabel>
                  <FormControl>
                      <Input placeholder="您的公司名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>客戶</FormLabel>
                  <FormControl>
                      <Input placeholder="客戶的公司名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="clientRepresentative"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>客戶代表 (可選)</FormLabel>
                  <FormControl>
                      <Input placeholder="客戶方的聯絡人" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="totalValue"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>合約總價值</FormLabel>
                  <FormControl>
                      <Input type="number" placeholder="例如：5000000" {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
          />
      </div>
        <FormField
          control={form.control}
          name="scope"
          render={({ field }) => (
              <FormItem>
              <FormLabel>工作範疇</FormLabel>
              <FormControl>
                  <Textarea
                  placeholder="簡要描述合約包含的工作範疇與交付項目。"
                  {...field}
                  />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
      />
      <div className="grid grid-cols-2 gap-4">
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
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>結束日期</FormLabel>
              <FormControl>
                <DatePicker field={field} placeholder="選擇結束日期" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
