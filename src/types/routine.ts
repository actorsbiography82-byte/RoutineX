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
}
