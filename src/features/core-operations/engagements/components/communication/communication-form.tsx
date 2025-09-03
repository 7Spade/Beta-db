'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';
import type { CommunicationDirection, CommunicationType, CreateCommunicationInput } from '../../types/communication.types';

interface CommunicationFormProps {
    communication?: any; // 編輯時傳入現有溝通記錄
    onSave: () => Promise<void>;
    onCancel: () => void;
}

export function CommunicationForm({ communication, onSave, onCancel }: CommunicationFormProps) {
    const [formData, setFormData] = useState<CreateCommunicationInput>({
        type: communication?.type || 'email',
        direction: communication?.direction || 'outbound',
        subject: communication?.subject || '',
        content: communication?.content || '',
        participants: communication?.participants || [],
        date: communication?.date ? (communication.date instanceof Date ? communication.date : communication.date.toDate()) : new Date(),
        duration: communication?.duration || undefined,
        attachments: communication?.attachments || [],
        followUpRequired: communication?.followUpRequired || false,
        followUpDate: communication?.followUpDate ? (communication.followUpDate instanceof Date ? communication.followUpDate : communication.followUpDate.toDate()) : undefined,
        followUpNotes: communication?.followUpNotes || '',
    });

    const [participantInput, setParticipantInput] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showFollowUpDatePicker, setShowFollowUpDatePicker] = useState(false);

    const handleInputChange = (field: keyof CreateCommunicationInput, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddParticipant = () => {
        if (participantInput.trim()) {
            setFormData(prev => ({
                ...prev,
                participants: [...prev.participants, participantInput.trim()]
            }));
            setParticipantInput('');
        }
    };

    const handleRemoveParticipant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {communication ? '編輯溝通記錄' : '新增溝通記錄'}
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 類型 */}
                        <div className="space-y-2">
                            <Label htmlFor="type">類型</Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as CommunicationType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="選擇類型" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">郵件</SelectItem>
                                    <SelectItem value="phone">電話</SelectItem>
                                    <SelectItem value="meeting">會議</SelectItem>
                                    <SelectItem value="message">訊息</SelectItem>
                                    <SelectItem value="document">文件</SelectItem>
                                    <SelectItem value="other">其他</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 方向 */}
                        <div className="space-y-2">
                            <Label htmlFor="direction">方向</Label>
                            <Select value={formData.direction} onValueChange={(value) => handleInputChange('direction', value as CommunicationDirection)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="選擇方向" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inbound">接收</SelectItem>
                                    <SelectItem value="outbound">發送</SelectItem>
                                    <SelectItem value="internal">內部</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 標題 */}
                    <div className="space-y-2">
                        <Label htmlFor="subject">標題</Label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="輸入溝通標題"
                            required
                        />
                    </div>

                    {/* 內容 */}
                    <div className="space-y-2">
                        <Label htmlFor="content">內容</Label>
                        <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="輸入溝通內容"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 日期 */}
                        <div className="space-y-2">
                            <Label>日期</Label>
                            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.date ? format(formData.date, "PPP", { locale: zhTW }) : "選擇日期"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(date) => {
                                            handleInputChange('date', date);
                                            setShowDatePicker(false);
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* 持續時間 */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">持續時間 (分鐘)</Label>
                            <Input
                                id="duration"
                                type="number"
                                value={formData.duration || ''}
                                onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="輸入持續時間"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* 參與者 */}
                    <div className="space-y-2">
                        <Label>參與者</Label>
                        <div className="flex gap-2">
                            <Input
                                value={participantInput}
                                onChange={(e) => setParticipantInput(e.target.value)}
                                placeholder="輸入參與者姓名"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddParticipant();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddParticipant} variant="outline">
                                添加
                            </Button>
                        </div>
                        {formData.participants.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.participants.map((participant, index) => (
                                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm">
                                        {participant}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveParticipant(index)}
                                            className="h-4 w-4 p-0 hover:bg-gray-200"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 後續行動 */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="followUpRequired"
                                checked={formData.followUpRequired}
                                onCheckedChange={(checked) => handleInputChange('followUpRequired', checked)}
                            />
                            <Label htmlFor="followUpRequired">需要後續行動</Label>
                        </div>

                        {formData.followUpRequired && (
                            <div className="space-y-4 pl-6">
                                <div className="space-y-2">
                                    <Label>後續日期</Label>
                                    <Popover open={showFollowUpDatePicker} onOpenChange={setShowFollowUpDatePicker}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !formData.followUpDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.followUpDate ? format(formData.followUpDate, "PPP", { locale: zhTW }) : "選擇後續日期"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={formData.followUpDate}
                                                onSelect={(date) => {
                                                    handleInputChange('followUpDate', date);
                                                    setShowFollowUpDatePicker(false);
                                                }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="followUpNotes">後續備註</Label>
                                    <Textarea
                                        id="followUpNotes"
                                        value={formData.followUpNotes}
                                        onChange={(e) => handleInputChange('followUpNotes', e.target.value)}
                                        placeholder="輸入後續行動備註"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                        <Button type="submit">
                            {communication ? '更新' : '創建'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
