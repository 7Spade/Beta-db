
export type InterviewStatus = '已排程' | '已完成' | '已取消';

export interface Interview {
  id: string;
  applicationId: string;
  scheduledAt: Date;
  status: InterviewStatus;
  notes?: string;
  interviewerIds: string[];
}
