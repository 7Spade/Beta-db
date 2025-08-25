
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CreateFolderDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCreate: (folderName: string) => Promise<void>;
}

export const CreateFolderDialog = ({ isOpen, onOpenChange, onCreate }: CreateFolderDialogProps) => {
    const [folderName, setFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!folderName.trim()) return;
        setIsLoading(true);
        await onCreate(folderName.trim());
        setIsLoading(false);
        onOpenChange(false);
        setFolderName('');
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>建立新資料夾</DialogTitle>
                    <DialogDescription>
                        輸入新資料夾的名稱。
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="folder-name" className="text-right">
                            名稱
                        </Label>
                        <Input
                            id="folder-name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="col-span-3"
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>取消</Button>
                    <Button onClick={handleCreate} disabled={isLoading || !folderName.trim()}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        建立
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
