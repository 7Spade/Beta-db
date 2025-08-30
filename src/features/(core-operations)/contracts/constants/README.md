# Contracts Constants

This directory contains constant values and configuration used throughout the contracts feature.

## Constants

- `contract.constants.ts` - Core contract-related constants (statuses, types, etc.)
- `ui.constants.ts` - UI-specific constants for contract components
- `index.ts` - Central export file for all constants

## Usage

Import constants as needed throughout the contracts feature:

```tsx
import {
  CONTRACT_STATUSES,
  CONTRACT_TYPES,
} from '@/features/(core-operations)/contracts/constants';
import { UI_CONSTANTS } from '@/features/(core-operations)/contracts/constants';
```

## Structure

Constants are organized by domain and exported through the main index file for easy access and maintenance.
