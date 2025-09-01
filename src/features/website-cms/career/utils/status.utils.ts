
import type { JobStatus } from '../types/job.types';
import type { ApplicationStatus } from '../types/application.types';

export function getJobStatusVariant(status: JobStatus) {
  switch (status) {
    case '開放中':
      return 'default';
    case '已關閉':
      return 'destructive';
    case '草稿':
      return 'secondary';
  }
}

export function getApplicationStatusVariant(status: ApplicationStatus) {
  switch (status) {
    case '已錄取':
      return 'default';
    case '未錄取':
      return 'destructive';
    case '待審查':
      return 'secondary';
    case '面試中':
    case '已審查':
      return 'outline';
  }
}
