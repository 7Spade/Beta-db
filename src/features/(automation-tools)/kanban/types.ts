export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  createdAt: Date;
}

export const NOTE_COLORS = [
  '#ffffff', '#f28b82', '#fbbd04', '#fff475', '#ccff90',
  '#a7ffeb', '#aecbfa', '#d7aefb', '#fdcfe8', '#e6c9a8'
] as const;

// Re-export canonical Kanban types for consumers using "@/kanban/types"
export type { Column, Task, Id } from './types/index';
