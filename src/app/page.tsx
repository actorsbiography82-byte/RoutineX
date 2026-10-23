'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Sun, 
  Moon, 
  Sparkles,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { Task, TaskCategory } from '@/types/routine';
import { INITIAL_TASKS } from '@/data/defaultRoutine';

const STORAGE_KEY = 'routinex_tasks_v2';
const THEME_KEY = 'routinex_theme';

export default function RoutineXPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState<TaskCategory>('General');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize theme and load tasks from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Theme initialization
    const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Tasks initialization
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      } else {
        setTasks(INITIAL_TASKS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      }
    } catch {
      setTasks(INITIAL_TASKS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save tasks to LocalStorage on update
  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_KEY, next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Check / Uncheck task
  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTasks(updated);
  };

  // Delete task
  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  // Add new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime.trim() || undefined,
      category: newCategory,
      completed: false,
      createdAt: Date.now(),
    };

    saveTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewTime('');
    setNewCategory('General');
    setIsFormOpen(false);
  };

  // Uncheck all tasks (for starting a new day)
  const resetChecks = () => {
    const reset = tasks.map((t) => ({ ...t, completed: false }));
    saveTasks(reset);
  };

  // Restore initial default tasks
  const restoreDefaults = () => {
    if (confirm('Restore default daily routine schedule? This will reset your task list.')) {
      saveTasks(INITIAL_TASKS);
    }
  };

  // Progress metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered task view
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const getCategoryBadgeClass = (category: TaskCategory) => {
    switch (category) {
      case 'Spiritual':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
      case 'Work':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60';
      case 'YouTube':
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-800/60';
      case 'Dev':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800/60';
      case 'Growth':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800/60';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  // Formatted date string (e.g., "Friday, Oct 23")
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-800 dark:border-t-zinc-200 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 antialiased py-8 sm:py-16 px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-7">

        {/* Minimalist Top Header */}
        <header className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Routine<span className="text-rose-500">X</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
              {todayFormatted}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={resetChecks}
              title="Uncheck all tasks for a new day"
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-xs flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Day</span>
            </button>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600" />
              )}
            </button>
          </div>
        </header>

        {/* Progress & Counter */}
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-semibold text-zinc-600 dark:text-zinc-300">
              Completed {completedCount} of {totalCount} tasks
            </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {percentage}%
            </span>
          </div>

          {/* Slim 4px Progress Bar */}
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filter Tabs & Add Button Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Minimalist Filter Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            {(['all', 'pending', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                  filter === tab
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toggle Add Form Button */}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Close' : 'Add Task'}</span>
          </button>
        </div>

        {/* Inline Add Task Form (Expandable) */}
        {isFormOpen && (
          <form
            onSubmit={handleAddTask}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 animate-in fade-in duration-150"
          >
            <div>
              <input
                type="text"
                autoFocus
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task description (e.g. Asar Prayer, Client revision...)"
                className="w-full px-3 py-2 text-sm rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="Duration (e.g. 30m, 1h)"
                className="px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              />

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                className="px-2.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="General">General</option>
                <option value="Spiritual">Spiritual (Prayers/Quran)</option>
                <option value="Work">Foodpanda Work</option>
                <option value="YouTube">YouTube Studio</option>
                <option value="Dev">Web Dev / Client</option>
                <option value="Growth">Personal Growth</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-all"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        {/* Task List (Minimalist Cards) */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
              <ListTodo className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No tasks in this view.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-150 ${
                  task.completed
                    ? 'bg-zinc-100/60 dark:bg-zinc-900/40 border-transparent opacity-60'
                    : 'bg-white dark:bg-zinc-900/90 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Left: Checkbox & Task Title */}
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                      task.completed
                        ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-900'
                        : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500 bg-transparent'
                    }`}
                    aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      onClick={() => toggleTask(task.id)}
                      className={`text-sm cursor-pointer select-none transition-all truncate ${
                        task.completed
                          ? 'line-through text-zinc-400 dark:text-zinc-500'
                          : 'text-zinc-800 dark:text-zinc-200 font-medium'
                      }`}
                    >
                      {task.title}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          task.category
                        )}`}
                      >
                        {task.category}
                      </span>

                      {task.time && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                          • {task.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Delete Action Button */}
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  title="Delete task"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Minimal Footer */}
        <footer className="pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 gap-2">
          <span>100% Offline • Saved in Browser LocalStorage</span>
          
          <button
            onClick={restoreDefaults}
            className="hover:underline text-zinc-500 dark:text-zinc-400 transition-all"
          >
            Restore Default Routine Schedule
          </button>
        </footer>

      </div>
    </div>
  );
}
