'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { Skill } from '@root/src/shared/types/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { generateSkillSuggestion } from '@/features/integrations/ai/flows/generate-skill-flow';
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { useToast } from '@root/src/shared/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';

const skillSchema = z.object({
  name: z.string().min(2, '技能名稱至少需要 2 個字元。'),
  description: z.string().optional(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

interface SkillFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (data: Omit<Skill, 'id'>, skillId?: string) => Promise<boolean>;
  skill: Skill | null;
}

export function SkillFormDialog({ isOpen, onOpenChange, onSave, skill }: SkillFormDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<{ name: string, description: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (skill) {
        form.reset(skill);
      } else {
        form.reset({ name: '', description: '' });
      }
      setAiSuggestions([]);
      setAiTopic('');
    }
  }, [skill, isOpen, form]);

  const handleOpenChange = (open: boolean) => {
    if (isSaving || isGenerating) return;
    onOpenChange(open);
  }

  async function onSubmit(values: SkillFormValues) {
    setIsSaving(true);
    const success = await onSave(values, skill?.id);
    setIsSaving(false);
    if (success) {
      onOpenChange(false);
    }
  }

  async function handleAiGenerate() {
    if (!aiTopic) {
      toast({ title: "缺少主題", description: "請先輸入一個主題或職位。", variant: "destructive" });
      return;
    }
    setIsGenerating(true);
    setAiSuggestions([]);
    try {
      const result = await generateSkillSuggestion({ topic: aiTopic });
      setAiSuggestions(result.skills);
      toast({ title: "AI 建議已生成！", description: "點擊建議以填入表單。" });
    } catch (err) {
      console.error(err);
      toast({ title: "AI 生成失敗", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleApplySuggestion = (suggestion: { name: string, description: string }) => {
    form.setValue('name', suggestion.name);
    form.setValue('description', suggestion.description);
    setAiSuggestions(prev => prev.filter(s => s.name !== suggestion.name));
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{skill ? '編輯技能' : '新增技能'}</DialogTitle>
          <DialogDescription>
            {skill ? '更新此技能的詳細資訊。' : '為您的團隊資料庫建立一個新技能。'}
          </DialogDescription>
        </DialogHeader>

        {!skill && (
          <div className="space-y-4 rounded-lg border p-4">
            <Label>使用 AI 建議</Label>
            <div className="flex gap-2">
              <Input
                placeholder="輸入主題，例如：水電工"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                disabled={isGenerating}
              />
              <Button onClick={handleAiGenerate} disabled={isGenerating} variant="outline">
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              </Button>
            </div>
            {aiSuggestions.length > 0 && (
              <Alert>
                <AlertTitle>點擊一項建議以填入</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2 pt-2">
                    {aiSuggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleApplySuggestion(s)}
                        className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </button>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>技能名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：水電工程" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述 (可選)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="簡要描述此技能的內容..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isSaving}>取消</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? '儲存中...' : '儲存技能'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
