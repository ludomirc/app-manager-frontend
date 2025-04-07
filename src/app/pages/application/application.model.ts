export interface Application {
  applicationId?: number;
  enterpriseId: number | null;
  enterpriseName?: string;
  creationDate?: string;
  notes: string;
  name: string;
  currentStatus?: string;
}
