export type TaskCategory = 
  | 'Spiritual' 
  | 'Work' 
  | 'YouTube' 
  | 'Growth' 
  | 'Dev' 
  | 'General';

export interface Task {
  id: string;
  title: string;
  time?: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: number;
  updatedAt?: number;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'local_only';

export interface SheetConfig {
  scriptUrl: string;
  lastSyncedAt: number | null;
  autoSync: boolean;
}
