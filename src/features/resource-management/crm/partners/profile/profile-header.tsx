
'use client';

import type { Partner } from '@/lib/types/types';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card, CardHeader, CardTitle } from '@/ui/card';
import { formatDate } from '@/utils';
import type { Role } from '@root/src/shared/constants/roles';
import { Calendar, Edit, Globe } from 'lucide-react';
import Image from 'next/image';
import type { FC } from 'react';

interface ProfileHeaderProps {
    partner: Partner;
    userRole: Role;
    onEdit: (partner: Partner) => void;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ partner, userRole, onEdit }) => {

    const statusBadgeVariant = (status: Partner['status']) => {
        switch (status) {
            case '啟用中': return 'default';
            case '停用中': return 'secondary';
            case '待審核': return 'outline';
            default: return 'default';
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-col md:flex-row gap-6 items-start">
                <Image src={partner.logoUrl} alt={`${partner.name} logo`} width={80} height={80} className="rounded-lg border" data-ai-hint="logo company" />
                <div className='flex-1'>
                    <div className='flex justify-between items-start'>
                        <CardTitle className="text-3xl font-bold">{partner.name}</CardTitle>
                        {userRole !== 'Viewer' && <Button variant="outline" onClick={() => onEdit(partner)}><Edit className="mr-2 h-4 w-4" /> 編輯合作夥伴</Button>}
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-muted-foreground text-sm">
                        <Badge variant={statusBadgeVariant(partner.status)} className="text-sm">{partner.status}</Badge>
                        <span className="hidden md:inline">|</span>
                        <span>{partner.category}</span>
                        <span className="hidden md:inline">|</span>
                        <a href={`https://${partner.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                            <Globe className="h-4 w-4" /> {partner.website}
                        </a>
                        <span className="hidden md:inline">|</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> 加入於 {formatDate(partner.joinDate)}
                        </span>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};
