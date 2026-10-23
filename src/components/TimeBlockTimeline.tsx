'use client';

import React, { useState, useEffect } from 'react';
import { RoutineItem } from '@/types/routine';
import { isTimeBlockActive, formatDuration } from '@/utils/timeUtils';
import { Clock, Play, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface TimeBlockTimelineProps {
  items: RoutineItem[];
  onStartTimer: (item: RoutineItem) => void;
  onToggleItem: (itemId: string) => void;
}

export const TimeBlockTimeline: React.FC<TimeBlockTimelineProps> = ({
  items,
  onStartTimer,
  onToggleItem,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentTimeKey, setCurrentTimeKey] = useState<number>(Date.now());

  // Periodically refresh active status check
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeKey(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Filter items that have defined time slots and sort chronologically
  const scheduledItems = [...items]
    .filter((item) => item.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  // Calculate total scheduled hours
  const totalMinutes = scheduledItems.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'spiritual':
        return {
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          border: 'border-emerald-500/40',
        };
      case 'foodpanda':
        return {
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          border: 'border-rose-500/40',
        };
      case 'youtube':
        return {
          badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
          dot: 'bg-red-500',
          border: 'border-red-500/40',
        };
      case 'agency':
        return {
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
          dot: 'bg-blue-500',
          border: 'border-blue-500/40',
        };
      case 'growth':
        return {
          badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
          dot: 'bg-purple-500',
          border: 'border-purple-500/40',
        };
      default:
        return {
          badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-500',
          border: 'border-indigo-500/40',
        };
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              24-Hour Time Blocking Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {formatDuration(totalMinutes)} total targeted focused hours today
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Visual Timeline Bar Cards */}
      {isExpanded && (
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scheduledItems.map((item) => {
              const active = isTimeBlockActive(item.startTime, item.endTime);
              const styles = getCategoryStyles(item.category);

              return (
                <div
                  key={item.id}
                  className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/70 dark:from-indigo-950/40 dark:to-slate-900/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : item.completed
                      ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80'
                      : 'bg-white dark:bg-slate-800/70 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {/* Active Live Pill */}
                  {active && (
                    <div className="absolute -top-2.5 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live Slot Now</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {item.suggestedTime || `${item.startTime} - ${item.endTime}`}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {formatDuration(item.durationMinutes)}
                        </span>
                      </div>
                      
                      <h4 className={`text-xs sm:text-sm font-bold ${
                        item.completed 
                          ? 'line-through text-slate-400 dark:text-slate-500' 
                          : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {item.title}
                      </h4>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onStartTimer(item)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all"
                        title="Start Timer for this block"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => onToggleItem(item.id)}
                        className={`p-1.5 rounded-xl transition-all ${
                          item.completed
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-700/80 text-slate-400 hover:text-emerald-500'
                        }`}
                        title={item.completed ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

