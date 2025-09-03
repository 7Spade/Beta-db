'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/shared/hooks/use-toast';
import { useState } from 'react';
import { addSubtaskAction } from '../../actions/subtask.actions';
import type { Task } from '../../types';

interface AddSubtaskFormProps {
    engagementId: string;
    parentTaskId: string;
    tasks: Task[];
    onSuccess?: () => void;
}

export function AddSubtaskForm({
    engagementId,
    parentTaskId,
    tasks,
    onSuccess,
}: AddSubtaskFormProps) {
    const [title, setTitle] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast({
                title: '錯誤',
                description: '請為您的子任務輸入一個標題。',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const result = await addSubtaskAction(
                engagementId,
                tasks,
                parentTaskId,
                title.trim(),
                quantity,
                unitPrice
            );

            if (result.success) {
                toast({
                    title: '成功',
                    description: '子任務已新增。',
                });
                setTitle('');
                setQuantity(1);
                setUnitPrice(0);
                onSuccess?.();
            } else {
                toast({
                    title: '錯誤',
                    description: result.error || '新增子任務失敗。',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: '錯誤',
                description: '新增子任務時發生錯誤。',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>新增子任務</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">任務標題</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="輸入新子任務標題..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="quantity">數量</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="unitPrice">單價</Label>
                            <Input
                                id="unitPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '新增中...' : '新增子任務'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
