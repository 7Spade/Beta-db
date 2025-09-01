
export type JobStatus = '開放中' | '已關閉' | '草稿';

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  location: string;
  type: '全職' | '兼職' | '實習';
  salaryRange?: string;
  description: string;
  requirements: string;
  createdAt: Date;
  updatedAt: Date;
}
