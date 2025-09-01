
'use client';

import type { Contract, FinancialDocument, Partner, ReceivablePayableType, Transaction } from '@/lib/types/types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { Briefcase, DollarSign, FileText, PlusCircle } from 'lucide-react';
import { useCallback, useEffect, useState, type FC } from 'react';

import { Skeleton } from '@/ui/skeleton';
import { formatDate } from '@/utils';
import { firestore } from '@root/src/features/integrations/database/firebase-client/firebase-client';
import { useToast } from '@root/src/lib/hooks/use-toast';
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import Link from 'next/link';

// Component for managing financial documents
const FinancialDocumentsManager: FC<{ partners: Partner[], isLoading: boolean }> = ({ partners, isLoading }) => {
    const [documents, setDocuments] = useState<FinancialDocument[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isDocsLoading, setIsDocsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const { toast } = useToast();

    const [newDocument, setNewDocument] = useState({
        partnerId: '', type: 'receivable' as ReceivablePayableType, amount: '', description: '', dueDate: '', contractId: '',
    });

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(firestore, 'financial_documents')), (snapshot) => {
            const docsList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id, ...data, createDate: (data.createDate as Timestamp)?.toDate(), dueDate: (data.dueDate as Timestamp)?.toDate(),
                } as FinancialDocument;
            });
            setDocuments(docsList);
            setIsDocsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchContractsForPartner = useCallback(async (partnerName: string) => {
        if (!partnerName) { setContracts([]); return; }
        const q = query(collection(firestore, "contracts"), where("client", "==", partnerName));
        const querySnapshot = await getDocs(q);
        setContracts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Contract));
    }, []);

    useEffect(() => {
        const selectedPartner = partners.find(p => p.id === newDocument.partnerId);
        fetchContractsForPartner(selectedPartner?.name || '');
    }, [newDocument.partnerId, partners, fetchContractsForPartner]);

    const handleCreateDocument = async () => {
        if (!newDocument.partnerId || !newDocument.amount || !newDocument.dueDate || !newDocument.contractId) {
            toast({ variant: 'destructive', title: '錯誤', description: '請填寫所有必要欄位。' }); return;
        }
        const partner = partners.find(p => p.id === newDocument.partnerId);
        const contract = contracts.find(c => c.id === newDocument.contractId);
        if (!partner || !contract) { toast({ variant: 'destructive', title: '錯誤', description: '找不到選定的合作夥伴或合約。' }); return; }

        const workflow = newDocument.type === 'receivable' ? partner.receivableWorkflow : partner.payableWorkflow;
        if (!workflow || workflow.length === 0) {
            toast({ variant: 'destructive', title: '錯誤', description: `此夥伴尚未配置${newDocument.type === 'receivable' ? '應收款' : '應付款'}流程。` }); return;
        }

        setIsCreating(true);
        try {
            await addDoc(collection(firestore, 'financial_documents'), {
                partnerId: newDocument.partnerId, partnerName: partner.name, contractId: newDocument.contractId,
                contractName: contract.name, type: newDocument.type, amount: parseFloat(newDocument.amount),
                description: newDocument.description, currentStep: workflow[0], createDate: Timestamp.now(),
                dueDate: Timestamp.fromDate(new Date(newDocument.dueDate)), history: [{ step: workflow[0], date: Timestamp.now(), user: "system" }]
            });
            toast({ title: '成功', description: '單據已成功建立。' });
            setShowCreateDialog(false);
            setNewDocument({ partnerId: '', type: 'receivable', amount: '', description: '', dueDate: '', contractId: '' });
        } finally {
            setIsCreating(false);
        }
    };

    const handleNextStep = async (docId: string) => {
        const docData = documents.find(d => d.id === docId);
        const partner = partners.find(p => p.id === docData?.partnerId);
        if (!docData || !partner || !partner.id) return;

        const workflow = docData.type === 'receivable' ? partner.receivableWorkflow : partner.payableWorkflow;
        const currentStepIndex = workflow.indexOf(docData.currentStep);

        if (currentStepIndex >= workflow.length - 1) {
            toast({ title: '流程完成', description: `單據已在最終步驟。` }); return;
        }

        const nextStep = workflow[currentStepIndex + 1];
        const docRef = doc(firestore, 'financial_documents', docId);
        const newHistoryEntry = { step: nextStep, date: Timestamp.now(), user: "system" };
        const updatedHistory = [...(docData.history || []), newHistoryEntry];

        try {
            if (currentStepIndex + 1 === workflow.length - 1) {
                const partnerRef = doc(firestore, 'partners', partner.id);
                const partnerSnap = await getDoc(partnerRef);
                const currentPartnerData = partnerSnap.data() as Partner;
                const newTransaction: Transaction = {
                    id: `txn-${Date.now()}`, date: new Date().toISOString(), amount: docData.amount, status: '已完成',
                    description: `${docData.type === 'receivable' ? '應收款' : '應付款'} - ${docData.description}`
                };
                await updateDoc(partnerRef, { transactions: [...(currentPartnerData.transactions || []), newTransaction] });
                toast({ title: "交易已記錄" });
            }
            await updateDoc(docRef, { currentStep: nextStep, history: updatedHistory });
            if (currentStepIndex + 1 < workflow.length - 1) {
                toast({ title: "流程更新", description: `單據已移至下一步驟: ${nextStep}` });
            }
        } catch {
            toast({ variant: 'destructive', title: '錯誤', description: '更新流程失敗。' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <CardTitle>財務單據管理</CardTitle>
                <Button onClick={() => setShowCreateDialog(true)} disabled={isLoading}><PlusCircle className="mr-2 h-4 w-4" />新增單據</Button>
            </div>
            {isDocsLoading ? <Skeleton className="h-48 w-full" /> : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map(doc => {
                        const partner = partners.find(p => p.id === doc.partnerId);
                        const isFinalStep = partner && (doc.type === 'receivable' ? partner.receivableWorkflow : partner.payableWorkflow).slice(-1)[0] === doc.currentStep;
                        return (
                            <Card key={doc.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{doc.partnerName}</CardTitle>
                                        <Badge variant={doc.type === 'receivable' ? 'default' : 'secondary'}>{doc.type === 'receivable' ? '應收' : '應付'}</Badge>
                                    </div>
                                    <div className="flex items-center text-2xl font-bold pt-2"><DollarSign className="h-6 w-6 mr-2 text-muted-foreground" />{doc.amount.toLocaleString()}</div>
                                    <Link href={`/contracts`} className="text-sm text-primary hover:underline flex items-center gap-1"><Briefcase className="h-4 w-4" /> {doc.contractName}</Link>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-xs text-muted-foreground">到期日: {formatDate(doc.dueDate)}</p>
                                </CardContent>
                                <CardContent><Button className="w-full" onClick={() => handleNextStep(doc.id)} disabled={isFinalStep}>{isFinalStep ? '流程已完成' : '推進至下一步'}</Button></CardContent>
                            </Card>
                        )
                    })}
                    {documents.length === 0 && (
                        <div className="col-span-full text-center py-16 border-2 border-dashed rounded-lg">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" /><h3 className="mt-4 text-lg font-semibold">尚無單據</h3>
                        </div>
                    )}
                </div>
            )}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader><DialogTitle>建立新單據</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <Select value={newDocument.partnerId} onValueChange={(v) => setNewDocument({ ...newDocument, partnerId: v, contractId: '' })}><SelectTrigger><SelectValue placeholder="選擇合作夥伴" /></SelectTrigger><SelectContent>{partners.map(p => <SelectItem key={p.id} value={p.id!}>{p.name}</SelectItem>)}</SelectContent></Select>
                        <Select value={newDocument.contractId} onValueChange={(v) => setNewDocument({ ...newDocument, contractId: v })} disabled={!newDocument.partnerId || contracts.length === 0}><SelectTrigger><SelectValue placeholder={!newDocument.partnerId ? "請先選擇合作夥伴" : "選擇關聯合約"} /></SelectTrigger><SelectContent>{contracts.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                        <Select value={newDocument.type} onValueChange={(v) => setNewDocument({ ...newDocument, type: v as ReceivablePayableType })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="receivable">應收款</SelectItem><SelectItem value="payable">應付款</SelectItem></SelectContent></Select>
                        <Input type="number" placeholder="金額" value={newDocument.amount} onChange={(e) => setNewDocument({ ...newDocument, amount: e.target.value })} />
                        <Input type="date" value={newDocument.dueDate} onChange={(e) => setNewDocument({ ...newDocument, dueDate: e.target.value })} />
                        <Textarea placeholder="備註 (可選)" value={newDocument.description} onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })} />
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setShowCreateDialog(false)}>取消</Button><Button onClick={handleCreateDocument} disabled={isCreating}>建立</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};


export const WorkflowBuilder: FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'partners'), (snapshot) => {
            setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Partner));
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">收支流程</h2>
                <p className="text-muted-foreground">管理您的財務單據。</p>
            </div>
            <FinancialDocumentsManager partners={partners} isLoading={isLoading} />
        </div>
    );
};
