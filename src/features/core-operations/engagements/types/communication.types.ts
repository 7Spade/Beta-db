/**
 * @fileoverview 溝通管理相關類型定義
 */
import type { Timestamp } from 'firebase/firestore';

// 溝通記錄相關類型
export type CommunicationType = 'email' | 'meeting' | 'phone' | 'message' | 'document' | 'other';
export type CommunicationDirection = 'inbound' | 'outbound' | 'internal';

export interface Communication {
  id: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string;
  content: string;
  participants: string[];
  participantNames: string[];
  date: Date | Timestamp;
  duration?: number; // in minutes
  attachments?: Array<{ name: string; url: string }>;
  followUpRequired?: boolean;
  followUpDate?: Date | Timestamp;
  followUpNotes?: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

// 會議相關類型
export type MeetingType = 'planning' | 'review' | 'status' | 'decision' | 'problem_solving' | 'other';
export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  description?: string;
  agenda?: string[];
  participants: string[];
  participantNames: string[];
  scheduledDate: Date | Timestamp;
  actualStartDate?: Date | Timestamp;
  actualEndDate?: Date | Timestamp;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  minutes?: string;
  actionItems?: ActionItem[];
  decisions?: Decision[];
  attachments?: Array<{ name: string; url: string }>;
  createdBy: string;
  createdAt: Date | Timestamp;
  updatedBy: string;
  updatedAt: Date | Timestamp;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: Date | Timestamp;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  completedDate?: Date | Timestamp;
  notes?: string;
}

export interface Decision {
  id: string;
  description: string;
  rationale?: string;
  impact?: string;
  responsible: string;
  responsibleName: string;
  implementationDate?: Date | Timestamp;
  status: 'pending' | 'implemented' | 'cancelled';
}

// 溝通摘要
export interface CommunicationSummary {
  totalCommunications: number;
  totalMeetings: number;
  upcomingMeetingsCount: number;
  pendingActionItems: number;
  overdueActionItems: number;
  recentCommunications: Communication[];
  upcomingMeetings: Meeting[];
}

// 創建輸入類型
export interface CreateCommunicationInput {
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string;
  content: string;
  participants: string[];
  date: Date;
  duration?: number;
  attachments?: Array<{ name: string; url: string }>;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
}

export interface UpdateCommunicationInput {
  type?: CommunicationType;
  direction?: CommunicationDirection;
  subject?: string;
  content?: string;
  participants?: string[];
  date?: Date;
  duration?: number;
  attachments?: Array<{ name: string; url: string }>;
  followUpRequired?: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
}

export interface CreateMeetingInput {
  title: string;
  type: MeetingType;
  description?: string;
  agenda?: string[];
  participants: string[];
  scheduledDate: Date;
  duration: number;
  location?: string;
  meetingLink?: string;
}

export interface UpdateMeetingInput {
  title?: string;
  type?: MeetingType;
  status?: MeetingStatus;
  description?: string;
  agenda?: string[];
  participants?: string[];
  scheduledDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  duration?: number;
  location?: string;
  meetingLink?: string;
  minutes?: string;
  actionItems?: Omit<ActionItem, 'id'>[];
  decisions?: Omit<Decision, 'id'>[];
  attachments?: Array<{ name: string; url: string }>;
}