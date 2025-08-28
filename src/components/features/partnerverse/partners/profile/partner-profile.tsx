
'use client';

import { useState, type FC, useEffect } from 'react';
import Image from 'next/image';
import type { Partner, Contact, Contract } from '@/lib/types/types';
import type { Role } from '@/lib/roles';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Globe, Edit, Users, DollarSign, Calendar, Star, FileText, ShieldCheck, FileWarning, FileX, Briefcase, Plus, Trash2, ArrowLeft, ExternalLink, Loader2, ArrowLeftRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/ui/alert-dialog';
import { firestore } from '@/firebase-client/firebase-client';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { formatDate } from '@/utils/utils';
import Link from 'next/link';
import { OverviewTab } from '@/partnerverse/overview/overview-tab';
import { ContactsTab } from '@/partnerverse/contacts/contacts-tab';
import { FinancialsTab } from '@/partnerverse/financials/financials-tab';
import { PerformanceTab } from '@/partnerverse/performance/performance-tab';
import { ComplianceTab } from '@/partnerverse/compliance/compliance-tab';
import { ContractsTab } from '@/partnerverse/contracts/contracts-tab';
import { TransactionsTab } from '@/partnerverse/transactions/transactions-tab';
import { ProfileHeader } from './profile-header';


interface PartnerProfileProps {
  partner: Partner;
  onBack: () => void;
  userRole: Role;
  onEdit: (partner: Partner) => void;
  onOpenContactForm: (contact: Contact | null) => void;
  onDeleteContact: (partnerId: string, contactId: string) => Promise<void>;
}

export const PartnerProfile: FC<PartnerProfileProps> = ({ partner, userRole, onBack, onEdit, onOpenContactForm, onDeleteContact }) => {
    
  return (
    <div className="space-y-6">
       <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回夥伴列表
        </Button>
      
      <ProfileHeader partner={partner} onEdit={onEdit} userRole={userRole} />
      
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="overview">概覽</TabsTrigger>
          <TabsTrigger value="contacts"><Users className="mr-2 h-4 w-4" />聯絡人</TabsTrigger>
          <TabsTrigger value="financials"><ArrowLeftRight className="mr-2 h-4 w-4" />財務流程</TabsTrigger>
          <TabsTrigger value="performance"><Star className="mr-2 h-4 w-4" />績效</TabsTrigger>
          <TabsTrigger value="compliance"><ShieldCheck className="mr-2 h-4 w-4" />合規性</TabsTrigger>
          <TabsTrigger value="contracts"><Briefcase className="mr-2 h-4 w-4" />合約</TabsTrigger>
          <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4" />交易紀錄</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab partner={partner} />
        </TabsContent>
        <TabsContent value="contacts">
            <ContactsTab 
                partner={partner} 
                onOpenContactForm={onOpenContactForm}
                onDeleteContact={onDeleteContact}
            />
        </TabsContent>
        <TabsContent value="financials">
            <FinancialsTab partner={partner} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceTab partner={partner} />
        </TabsContent>
        <TabsContent value="compliance">
          <ComplianceTab partner={partner} />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractsTab partner={partner} />
        </TabsContent>
        <TabsContent value="transactions">
           <TransactionsTab partner={partner} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
