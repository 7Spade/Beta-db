
'use client';

import { ComplianceTab } from '@/features/resource-management/crm/compliance/compliance-tab';
import { ContactsTab } from '@/features/resource-management/crm/contacts/contacts-tab';
import { ContractsTab } from '@/features/resource-management/crm/contracts/contracts-tab';
import { FinancialsTab } from '@/features/resource-management/crm/financials/financials-tab';
import { OverviewTab } from '@/features/resource-management/crm/overview/overview-tab';
import { PerformanceTab } from '@/features/resource-management/crm/performance/performance-tab';
import { TransactionsTab } from '@/features/resource-management/crm/transactions/transactions-tab';
import { Button } from '@/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import type { Role } from '@root/src/shared/constants/roles';
import type { Contact, Partner } from '@root/src/shared/types/types';
import { ArrowLeft, ArrowLeftRight, Briefcase, DollarSign, ShieldCheck, Star, Users } from 'lucide-react';
import { type FC } from 'react';
import { ProfileHeader } from './profile/profile-header';


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
