'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Sun, 
  Moon, 
  Plus, 
  RotateCcw, 
  Download, 
  CheckCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { formatDateDisplay, shiftDate, getTodayDateString } from '@/utils/timeUtils';
import { HabitStreak } from '@/types/routine';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  streak: HabitStreak;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  onOpenExportModal: () => void;
  onResetDay: () => void;
  onMarkAllDone: () => void;
  totalCompleted: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  streak,
  theme,
  onToggleTheme,
  onOpenAddModal,
  onOpenExportModal,
  onResetDay,
  onMarkAllDone,
  totalCompleted,
  totalCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const todayStr = getTodayDateString();
  const isToday = selectedDate === todayStr;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20 flex-shrink-0 animate-pulse-subtle">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-indigo-300 bg-clip-text text-transparent">
                  R
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Routine<span className="text-rose-500">X</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 rounded-full border border-indigo-200/60 dark:border-indigo-800/50">
                  Daily Engine
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentTime || 'Syncing clock...'}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {totalCompleted}/{totalCount} Completed
                </span>
              </div>
            </div>
          </div>

          {/* Date Navigation Center */}
          <div className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl p-1 sm:p-1.5 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
            <button
              onClick={() => onDateChange(shiftDate(selectedDate, -1))}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="px-2 sm:px-3 text-center min-w-[110px] sm:min-w-[140px]">
              <span className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {formatDateDisplay(selectedDate)}
              </span>
              {!isToday && (
                <button
                  onClick={() => onDateChange(todayStr)}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider"
                >
                  Jump to Today
                </button>
              )}
            </div>

            <button
              onClick={() => onDateChange(shiftDate(selectedDate, 1))}
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 rounded-xl text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm shadow-sm"
              title={`Current Streak: ${streak.currentStreak} days | Longest: ${streak.longestStreak} days`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak.currentStreak}d</span>
            </div>

            {/* Quick Add Task Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Task</span>
            </button>

            {/* Mark All Done Quick Action */}
            <button
              onClick={onMarkAllDone}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all"
              title="Mark all items as completed"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>All Done</span>
            </button>

            {/* Reset Day */}
            <button
              onClick={onResetDay}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Reset today's checks"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Backup / Sync */}
            <button
              onClick={onOpenExportModal}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Backup, Sync & Transfer"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};

