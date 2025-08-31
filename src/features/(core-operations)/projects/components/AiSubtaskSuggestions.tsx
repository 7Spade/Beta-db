'use client';

import { generateSubtasks } from '@/ai/flows/generate-subtasks-flow';
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';
import { Button } from '@/ui/button';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Loader, PlusCircle, X } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import type { Project } from '../types';

interface AiSubtaskSuggestionsProps {
  project: Project;
  taskTitle: string;
  parentTaskId: string;
  onAddSubtask: (
    parentTaskId: string,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ) => void;
  onClose: () => void;
}

export function AiSubtaskSuggestions({
  project,
  taskTitle,
  parentTaskId,
  onAddSubtask,
  onClose,
}: AiSubtaskSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateSubtasks({
          projectTitle: project.title,
          taskTitle,
        });
        setSuggestions(result.suggestions);
      } catch (err) {
        setError('生成 AI 建議失敗，請再試一次。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [project.title, taskTitle]);

  const handleAddSuggestion = (suggestion: string) => {
    startTransition(() => {
      // For suggestions, we add with default quantity 1 and unit price 0
      onAddSubtask(parentTaskId, suggestion, 1, 0);
      setSuggestions(suggestions.filter((s) => s !== suggestion));
      toast({
        title: '子任務已新增',
        description: `"${suggestion}" 已被加到您的任務清單中。`,
      });
    });
  };

  return (
    <div className="my-2 ml-14 mr-2">
      <Alert className="relative bg-secondary border-primary/20">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <AlertTitle className="flex items-center gap-2">
          AI 子任務建議
        </AlertTitle>
        <AlertDescription>
          {loading && (
            <div className="flex items-center gap-2 py-4">
              <Loader className="h-4 w-4 animate-spin" />
              <span>正在生成想法...</span>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {!loading && !error && (
            <ul className="space-y-2 pt-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{suggestion}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSuggestion(suggestion)}
                    disabled={isPending}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新增
                  </Button>
                </li>
              ))}
              {suggestions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  所有建議都已被新增，或沒有生成任何建議。
                </p>
              )}
            </ul>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
