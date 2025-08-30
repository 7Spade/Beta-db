/**
 * @fileoverview 合約狀態管理 Context
 */

'use client';

import { useContracts as useContractsHook } from '@/features/(core-operations)/contracts/hooks';
import type { Contract } from '@/features/(core-operations)/contracts/types';
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

interface ContractState {
  contracts: Contract[];
  selectedContract: Contract | null;
  loading: boolean;
  error: string | null;
}

type ContractAction =
  | { type: 'SET_CONTRACTS'; payload: Contract[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ContractState = {
  contracts: [],
  selectedContract: null,
  loading: true,
  error: null,
};

function contractReducer(
  state: ContractState,
  action: ContractAction
): ContractState {
  switch (action.type) {
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface ContractContextType {
  state: ContractState;
  dispatch: React.Dispatch<ContractAction>;
}

const ContractContext = createContext<ContractContextType | undefined>(
  undefined
);

interface ContractProviderProps {
  children: ReactNode;
}

export function ContractProvider({ children }: ContractProviderProps) {
  const [state, dispatch] = useReducer(contractReducer, initialState);
  const { contracts, loading, error } = useContractsHook();

  React.useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  React.useEffect(() => {
    if (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  }, [error]);

  React.useEffect(() => {
    if (!loading && !error) {
      dispatch({ type: 'SET_CONTRACTS', payload: contracts });
    }
  }, [contracts, loading, error]);

  return (
    <ContractContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContractContext() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error(
      'useContractContext must be used within a ContractProvider'
    );
  }
  return context;
}
