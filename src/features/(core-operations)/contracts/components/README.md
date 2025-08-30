# Contracts Components

This directory contains reusable UI components specific to contract management functionality.

## Components

- `change-order-item.tsx` - Component for displaying and managing change order items
- `contract-status-badge.tsx` - Badge component for displaying contract status
- `contract-summary-card.tsx` - Card component for displaying contract summary information
- `payment-progress.tsx` - Progress indicator for payment tracking
- `receipt-progress.tsx` - Progress indicator for receipt processing
- `version-timeline.tsx` - Timeline component for contract version history

## Usage

These components are designed to be used within the contracts feature views and can be imported as needed:

```tsx
import { ContractStatusBadge } from '@/features/(core-operations)/contracts/components/contract-status-badge';
import { ContractSummaryCard } from '@/features/(core-operations)/contracts/components/contract-summary-card';
```

## Dependencies

- React
- Tailwind CSS
- shadcn/ui components
- Contract types and utilities
