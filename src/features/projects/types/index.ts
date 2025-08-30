export type TaskStatus = '待處理' | '進行中' | '已完成';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  lastUpdated: string;
  subTasks: Task[];
  value: number; // This will now be calculated as quantity * unitPrice
  quantity: number;
  unitPrice: number;
}

export interface Project {
  id: string;
  customId?: string;
  title: string;
  description: string;
  client?: string;
  clientRepresentative?: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  value: number;
}
