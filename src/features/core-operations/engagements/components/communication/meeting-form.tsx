'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@root/src/shared/utils';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useState } from 'react';
import type { CreateMeetingInput, MeetingType } from '../../types/communication.types';

interface MeetingFormProps {
    meeting?: any; // 編輯時傳入現有會議
    onSave: () => Promise<void>;
    onCancel: () => void;
}

export function MeetingForm({ meeting, onSave, onCancel }: MeetingFormProps) {
    const [formData, setFormData] = useState<CreateMeetingInput>({
        title: meeting?.title || '',
        type: meeting?.type || 'planning',
        description: meeting?.description || '',
        agenda: meeting?.agenda || [],
        participants: meeting?.participants || [],
        participantNames: meeting?.participantNames || [],
        scheduledDate: meeting?.scheduledDate ? (meeting.scheduledDate instanceof Date ? meeting.scheduledDate : meeting.scheduledDate.toDate()) : new Date(),
        duration: meeting?.duration || 60,
        location: meeting?.location || '',
        meetingLink: meeting?.meetingLink || '',
    });

    const [participantInput, setParticipantInput] = useState('');
    const [agendaInput, setAgendaInput] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field: keyof CreateMeetingInput, value: any) => {
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

    const handleAddAgendaItem = () => {
        if (agendaInput.trim()) {
            setFormData(prev => ({
                ...prev,
                agenda: [...(prev.agenda || []), agendaInput.trim()]
            }));
            setAgendaInput('');
        }
    };

    const handleRemoveAgendaItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            agenda: (prev.agenda || []).filter((_, i) => i !== index)
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
                    {meeting ? '編輯會議' : '新增會議'}
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 標題 */}
                        <div className="space-y-2">
                            <Label htmlFor="title">會議標題</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="輸入會議標題"
                                required
                            />
                        </div>

                        {/* 類型 */}
                        <div className="space-y-2">
                            <Label htmlFor="type">會議類型</Label>
                            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value as MeetingType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="選擇類型" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planning">規劃會議</SelectItem>
                                    <SelectItem value="review">審查會議</SelectItem>
                                    <SelectItem value="status">狀態會議</SelectItem>
                                    <SelectItem value="decision">決策會議</SelectItem>
                                    <SelectItem value="problem_solving">問題解決</SelectItem>
                                    <SelectItem value="other">其他</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 描述 */}
                    <div className="space-y-2">
                        <Label htmlFor="description">描述</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="輸入會議描述"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 日期 */}
                        <div className="space-y-2">
                            <Label>會議日期</Label>
                            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formData.scheduledDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formData.scheduledDate ? format(formData.scheduledDate, "PPP", { locale: zhTW }) : "選擇日期"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.scheduledDate}
                                        onSelect={(date) => {
                                            handleInputChange('scheduledDate', date);
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
                                value={formData.duration}
                                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                                placeholder="輸入持續時間"
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 地點 */}
                        <div className="space-y-2">
                            <Label htmlFor="location">地點</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="輸入會議地點"
                            />
                        </div>

                        {/* 會議連結 */}
                        <div className="space-y-2">
                            <Label htmlFor="meetingLink">會議連結</Label>
                            <Input
                                id="meetingLink"
                                value={formData.meetingLink}
                                onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                                placeholder="輸入線上會議連結"
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
                                <Plus className="h-4 w-4" />
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

                    {/* 議程 */}
                    <div className="space-y-2">
                        <Label>議程</Label>
                        <div className="flex gap-2">
                            <Input
                                value={agendaInput}
                                onChange={(e) => setAgendaInput(e.target.value)}
                                placeholder="輸入議程項目"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddAgendaItem();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddAgendaItem} variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {(formData.agenda || []).length > 0 && (
                            <div className="space-y-1">
                                {(formData.agenda || []).map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded text-sm">
                                        <span className="flex-1">{item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveAgendaItem(index)}
                                            className="h-6 w-6 p-0 hover:bg-gray-200"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            取消
                        </Button>
                        <Button type="submit">
                            {meeting ? '更新' : '創建'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
