
export type ApplicationStatus = '待審查' | '已審查' | '面試中' | '已錄取' | '未錄取';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  submittedAt: Date;
}
