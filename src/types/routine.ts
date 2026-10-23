export type RoutineCategory = 
  | 'all'
  | 'spiritual'
  | 'foodpanda'
  | 'youtube'
  | 'growth'
  | 'agency'
  | 'custom';

export type Priority = 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  category: RoutineCategory;
  durationMinutes: number;
  suggestedTime?: string; // Display string, e.g. "05:00 AM - 06:00 AM"
  startTime?: string;     // 24hr format "05:00"
  endTime?: string;       // 24hr format "06:00"
  subtasks: SubTask[];
  completed: boolean;
  completedAt?: string;
  priority: Priority;
  notes?: string;
  iconName?: string;
  isCustom?: boolean;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  items: RoutineItem[];
  notes?: string;
  lastUpdated: string;
}

export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalCompletedDays: number;
}

