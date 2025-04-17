export interface TaskStatusChange {
  id?: number;
  taskId: number;
  status: string;
  changedAt?: string;
  changedByUserId?: number;
}
