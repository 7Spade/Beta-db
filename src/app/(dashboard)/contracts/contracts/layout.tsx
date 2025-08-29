/**
 * @fileoverview 合約頁面佈局
 */

import { ContractProvider } from '@/features/contracts/providers';

interface ContractsLayoutProps {
  children: React.ReactNode;
}

export default function ContractsLayout({ children }: ContractsLayoutProps) {
  return (
    <ContractProvider>
      {children}
    </ContractProvider>
  );
}
