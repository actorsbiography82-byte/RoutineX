'use client';

import React, { useState } from 'react';
import { RoutineItem } from '@/types/routine';
import { formatDuration } from '@/utils/timeUtils';
import { 
  Check, 
  Clock, 
  Play, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Calendar,
  Sparkles,
  Bike,
  Youtube,
  Laptop,
  Moon,
  Dumbbell,
  BookOpen
} from 'lucide-react';

interface TaskChecklistProps {
  items: RoutineItem[];
  onToggleItem: (itemId: string) => void;
  onToggleSubtask: (itemId: string, subtaskId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onStartTimer: (item: RoutineItem) => void;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({
  items,
  onToggleItem,
  onToggleSubtask,
  onDeleteItem,
  onStartTimer,
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'spiritual':
        return {
          icon: <Moon className="w-4 h-4 text-emerald-500" />,
          accent: 'border-l-emerald-500',
          badge: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          activeBg: 'hover:border-emerald-300 dark:hover:border-emerald-700',
        };
      case 'foodpanda':
        return {
          icon: <Bike className="w-4 h-4 text-rose-500" />,
          accent: 'border-l-rose-500',
          badge: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          activeBg: 'hover:border-rose-300 dark:hover:border-rose-700',
        };
      case 'youtube':
        return {
          icon: <Youtube className="w-4 h-4 text-red-500" />,
          accent: 'border-l-red-500',
          badge: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
          activeBg: 'hover:border-red-300 dark:hover:border-red-700',
        };
      case 'agency':
        return {
          icon: <Laptop className="w-4 h-4 text-blue-500" />,
          accent: 'border-l-blue-500',
          badge: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          activeBg: 'hover:border-blue-300 dark:hover:border-blue-700',
        };
      case 'growth':
        return {
          icon: <BookOpen className="w-4 h-4 text-purple-500" />,
          accent: 'border-l-purple-500',
          badge: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
          activeBg: 'hover:border-purple-300 dark:hover:border-purple-700',
        };
      default:
        return {
          icon: <Sparkles className="w-4 h-4 text-amber-500" />,
          accent: 'border-l-amber-500',
          badge: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          activeBg: 'hover:border-amber-300 dark:hover:border-amber-700',
        };
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800">
        <Sparkles className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
          No tasks match this filter
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Switch category filters or click &apos;Add Task&apos; to create a new routine block.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => {
        const theme = getCategoryTheme(item.category);
        const isExpanded = !!expandedItems[item.id];
        const subtasksTotal = item.subtasks.length;
        const subtasksDone = item.subtasks.filter((s) => s.completed).length;

        return (
          <div
            key={item.id}
            className={`rounded-2xl sm:rounded-3xl border border-l-4 transition-all duration-200 shadow-sm ${
              theme.accent
            } ${
              item.completed
                ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-md'
            } ${theme.activeBg}`}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                
                {/* Large Custom Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  aria-label={item.completed ? 'Mark uncompleted' : 'Mark completed'}
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 border-2 ${
                    item.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />}
                </button>

                {/* Main Content Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    {/* Category Icon & Name */}
                    <div className="flex items-center gap-1">
                      {theme.icon}
                      <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${theme.badge}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Time & Duration */}
                    <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatDuration(item.durationMinutes)}</span>
                      {item.suggestedTime && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{item.suggestedTime}</span>
                        </>
                      )}
                    </span>

                    {/* Completion Timestamp */}
                    {item.completed && item.completedAt && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Done at {item.completedAt}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onToggleItem(item.id)}
                    className={`text-sm sm:text-base font-bold cursor-pointer transition-all select-none ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Subtask summary pill if subtasks exist */}
                  {subtasksTotal > 0 && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-xl transition-all"
                      >
                        <span>
                          Checklist ({subtasksDone}/{subtasksTotal})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Mini progress dot row */}
                      <div className="flex items-center gap-1">
                        {item.subtasks.map((st) => (
                          <span
                            key={st.id}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              st.completed
                                ? 'bg-emerald-500 scale-125'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Start Focus Timer */}
                  <button
                    type="button"
                    onClick={() => onStartTimer(item)}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-600 dark:hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
                    title="Launch Focus Block Timer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Timer</span>
                  </button>

                  {/* Delete custom item button */}
                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                      title="Delete custom task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>

              {/* Expandable Subtask Checklist */}
              {isExpanded && subtasksTotal > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 pl-2 sm:pl-11">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                    Action Steps:
                  </span>
                  {item.subtasks.map((subtask) => (
                    <label
                      key={subtask.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(item.id, subtask.id)}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 transition-all cursor-pointer"
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium transition-all ${
                          subtask.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
};

