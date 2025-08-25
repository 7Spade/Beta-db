
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface RenameDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onRename: (newName: string) => Promise<void>;
    currentName: string;
}

export const RenameDialog = ({ isOpen, onOpenChange, onRename, currentName }: RenameDialogProps) => {
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            setNewName(currentName);
        }
    }, [isOpen, currentName]);


    const handleRename = async () => {
        if (!newName.trim() || newName.trim() === currentName) return;
        setIsLoading(true);
        await onRename(newName.trim());
        setIsLoading(false);
        onOpenChange(false);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>重新命名</DialogTitle>
                    <DialogDescription>
                        為您的檔案或資料夾輸入一個新名稱。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="new-name" className="text-right">
                            新名稱
                        </Label>
                        <Input
                            id="new-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="col-span-3"
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>取消</Button>
                    <Button onClick={handleRename} disabled={isLoading || !newName.trim() || newName.trim() === currentName}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        儲存
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
