export class Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}
