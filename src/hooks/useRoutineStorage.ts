'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoutineItem, DailyRecord, HabitStreak } from '@/types/routine';
import { DEFAULT_ROUTINE_ITEMS } from '@/data/defaultRoutine';
import { getTodayDateString } from '@/utils/timeUtils';

const STORAGE_PREFIX = 'routinex_record_';
const STREAK_KEY = 'routinex_streaks';
const THEME_KEY = 'routinex_theme';

export function useRoutineStorage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [items, setItems] = useState<RoutineItem[]>(DEFAULT_ROUTINE_ITEMS);
  const [dayNotes, setDayNotes] = useState<string>('');
  const [streak, setStreak] = useState<HabitStreak>({
    currentStreak: 1,
    longestStreak: 1,
    lastCompletedDate: null,
    totalCompletedDays: 0,
  });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Load streak from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedStreak = localStorage.getItem(STREAK_KEY);
      if (storedStreak) {
        setStreak(JSON.parse(storedStreak));
      }
    } catch (e) {
      console.error('Failed to parse streak data', e);
    }
  }, []);

  // Load items for the selected date
  const loadDateData = useCallback((date: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${date}`);
      if (stored) {
        const parsed: DailyRecord = JSON.parse(stored);
        setItems(parsed.items || DEFAULT_ROUTINE_ITEMS);
        setDayNotes(parsed.notes || '');
      } else {
        // If no record exists for this date, instantiate default routines with empty checks
        const freshItems = DEFAULT_ROUTINE_ITEMS.map((item) => ({
          ...item,
          completed: false,
          completedAt: undefined,
          subtasks: item.subtasks.map((st) => ({ ...st, completed: false })),
        }));
        setItems(freshItems);
        setDayNotes('');
      }
    } catch (e) {
      console.error('Error loading data for date', e);
      setItems(DEFAULT_ROUTINE_ITEMS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadDateData(selectedDate);
  }, [selectedDate, loadDateData]);

  // Save items to localStorage whenever they change
  const saveRecord = useCallback(
    (newItems: RoutineItem[], newNotes?: string) => {
      if (typeof window === 'undefined') return;
      const notesToSave = newNotes !== undefined ? newNotes : dayNotes;
      const record: DailyRecord = {
        date: selectedDate,
        items: newItems,
        notes: notesToSave,
        lastUpdated: new Date().toISOString(),
      };
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${selectedDate}`, JSON.stringify(record));
      } catch (e) {
        console.error('Error saving routine record', e);
      }

      // Check for streak calculation if today
      const today = getTodayDateString();
      if (selectedDate === today) {
        const completedCount = newItems.filter((i) => i.completed).length;
        const totalCount = newItems.length;
        const isDayDone = totalCount > 0 && completedCount === totalCount;

        setStreak((prev) => {
          let updated = { ...prev };
          if (isDayDone && prev.lastCompletedDate !== today) {
            const nextCurrent = prev.currentStreak + 1;
            updated = {
              currentStreak: nextCurrent,
              longestStreak: Math.max(prev.longestStreak, nextCurrent),
              lastCompletedDate: today,
              totalCompletedDays: prev.totalCompletedDays + 1,
            };
            localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
          }
          return updated;
        });
      }
    },
    [selectedDate, dayNotes]
  );

  // Toggle whole item
  const toggleItemCompletion = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const nextCompleted = !item.completed;
          return {
            ...item,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            subtasks: item.subtasks.map((st) => ({
              ...st,
              completed: nextCompleted,
            })),
          };
        }
        return item;
      });
      saveRecord(updated);
      return updated;
    });
  };

  // Toggle individual subtask
  const toggleSubtask = (itemId: string, subtaskId: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === itemId) {
          const updatedSubtasks = item.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allCompleted = updatedSubtasks.every((st) => st.completed);
          return {
            ...item,
            subtasks: updatedSubtasks,
            completed: allCompleted,
            completedAt: allCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return item;
      });
      saveRecord(updated);
      return updated;
    });
  };

  // Add custom task
  const addItem = (newItem: Omit<RoutineItem, 'id' | 'completed'>) => {
    const id = `custom-${Date.now()}`;
    const fullItem: RoutineItem = {
      ...newItem,
      id,
      completed: false,
      isCustom: true,
    };
    setItems((prev) => {
      const updated = [...prev, fullItem];
      saveRecord(updated);
      return updated;
    });
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveRecord(updated);
      return updated;
    });
  };

  // Reset current day's routine to uncompleted
  const resetCurrentDay = () => {
    setItems((prev) => {
      const reset = prev.map((item) => ({
        ...item,
        completed: false,
        completedAt: undefined,
        subtasks: item.subtasks.map((st) => ({ ...st, completed: false })),
      }));
      saveRecord(reset);
      return reset;
    });
  };

  // Mark all tasks completed for today
  const markAllCompleted = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setItems((prev) => {
      const completed = prev.map((item) => ({
        ...item,
        completed: true,
        completedAt: item.completedAt || nowTime,
        subtasks: item.subtasks.map((st) => ({ ...st, completed: true })),
      }));
      saveRecord(completed);
      return completed;
    });
  };

  // Update notes
  const updateDayNotes = (notes: string) => {
    setDayNotes(notes);
    saveRecord(items, notes);
  };

  // Export all data as JSON
  const exportAllData = (): string => {
    if (typeof window === 'undefined') return '{}';
    const exportObj: Record<string, any> = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      streak,
      records: {},
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          exportObj.records[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          // ignore
        }
      }
    }
    return JSON.stringify(exportObj, null, 2);
  };

  // Import data from JSON
  const importAllData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.streak) {
        localStorage.setItem(STREAK_KEY, JSON.stringify(parsed.streak));
        setStreak(parsed.streak);
      }
      if (parsed.records) {
        Object.entries(parsed.records).forEach(([k, v]) => {
          localStorage.setItem(k, JSON.stringify(v));
        });
      }
      loadDateData(selectedDate);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    items,
    dayNotes,
    streak,
    theme,
    toggleTheme,
    isLoaded,
    toggleItemCompletion,
    toggleSubtask,
    addItem,
    deleteItem,
    resetCurrentDay,
    markAllCompleted,
    updateDayNotes,
    exportAllData,
    importAllData,
  };
}

