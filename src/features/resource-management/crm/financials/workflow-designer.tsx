
'use client';

import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/shared/hooks/use-toast';
import type { Partner } from '@root/src/shared/types/types';
import { doc, setDoc } from 'firebase/firestore';
import { GripVertical, PlusCircle, Save, Trash2 } from 'lucide-react';
import { useEffect, useState, type FC } from 'react';


const WorkflowEditor: FC<{ title: string; steps: string[]; setSteps: (steps: string[]) => void; }> = ({ title, steps, setSteps }) => {
    const handleStepChange = (index: number, value: string) => setSteps(steps.map((s, i) => i === index ? value : s));
    const handleAddStep = () => setSteps([...steps, '新步驟']);
    const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

    return (
        <Card>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <Input value={step} onChange={(e) => handleStepChange(index, e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveStep(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddStep}><PlusCircle className="mr-2 h-4 w-4" />新增步驟</Button>
            </CardContent>
        </Card>
    );
};


interface WorkflowDesignerProps {
    partner: Partner;
}

export const WorkflowDesigner: FC<WorkflowDesignerProps> = ({ partner }) => {
    const [receivableWorkflow, setReceivableWorkflow] = useState<string[]>([]);
    const [payableWorkflow, setPayableWorkflow] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setReceivableWorkflow(partner.receivableWorkflow || []);
        setPayableWorkflow(partner.payableWorkflow || []);
    }, [partner]);

    const handleSave = async () => {
        if (!partner || !partner.id) return;
        setIsSaving(true);
        try {
            await setDoc(doc(firestore, 'partners', partner.id), { receivableWorkflow, payableWorkflow }, { merge: true });
            toast({ title: "成功", description: "收支流程已儲存。" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>合作夥伴收支流程設計</CardTitle>
                    <CardDescription>為 {partner.name} 定義應收與應付流程的步驟。</CardDescription>
                </CardHeader>
            </Card>
            <div className="space-y-4">
                {(partner.flowType === '純收款' || partner.flowType === '收付款') && <WorkflowEditor title="應收款流程" steps={receivableWorkflow} setSteps={setReceivableWorkflow} />}
                {(partner.flowType === '純付款' || partner.flowType === '收付款') && <WorkflowEditor title="應付款流程" steps={payableWorkflow} setSteps={setPayableWorkflow} />}
                <div className="flex justify-end"><Button onClick={handleSave} disabled={isSaving}><Save className="mr-2 h-4 w-4" />儲存流程</Button></div>
            </div>
        </div>
    );
};

