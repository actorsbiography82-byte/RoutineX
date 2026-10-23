'use client';

import React from 'react';
import { RoutineItem, HabitStreak } from '@/types/routine';
import { formatDuration } from '@/utils/timeUtils';
import { 
  Flame, 
  Award, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Sparkles,
  Bike,
  Youtube,
  Laptop,
  Moon,
  BookOpen
} from 'lucide-react';

interface StatsDrawerProps {
  items: RoutineItem[];
  streak: HabitStreak;
  dayNotes: string;
  onUpdateNotes: (notes: string) => void;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({
  items,
  streak,
  dayNotes,
  onUpdateNotes,
}) => {
  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calculate total minutes per category
  const getCategoryDuration = (cat: string) => {
    return items
      .filter((i) => i.category === cat)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
  };

  const getCategoryCompletedMinutes = (cat: string) => {
    return items
      .filter((i) => i.category === cat && i.completed)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
  };

  const categories = [
    { name: 'Foodpanda Rider', key: 'foodpanda', icon: <Bike className="w-4 h-4 text-rose-500" />, color: 'bg-rose-500' },
    { name: 'YouTube Creation', key: 'youtube', icon: <Youtube className="w-4 h-4 text-red-500" />, color: 'bg-red-500' },
    { name: 'Spiritual (Namaz & Quran)', key: 'spiritual', icon: <Moon className="w-4 h-4 text-emerald-500" />, color: 'bg-emerald-500' },
    { name: 'Web Dev & Clients', key: 'agency', icon: <Laptop className="w-4 h-4 text-blue-500" />, color: 'bg-blue-500' },
    { name: 'Growth & Fitness', key: 'growth', icon: <BookOpen className="w-4 h-4 text-purple-500" />, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* High-level stats cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Streak card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
              Streak
            </span>
            <span className="text-xl font-black text-amber-900 dark:text-amber-100">
              {streak.currentStreak} Days
            </span>
          </div>
        </div>

        {/* Longest streak */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block">
              Best Record
            </span>
            <span className="text-xl font-black text-emerald-900 dark:text-emerald-100">
              {streak.longestStreak} Days
            </span>
          </div>
        </div>
      </div>

      {/* Category Time Distribution */}
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Category Focus Breakdown</span>
        </h3>

        <div className="space-y-2.5">
          {categories.map((cat) => {
            const total = getCategoryDuration(cat.key);
            if (total === 0) return null;
            const completed = getCategoryCompletedMinutes(cat.key);
            const catPercent = Math.round((completed / total) * 100);

            return (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    {cat.icon}
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {formatDuration(completed)} / {formatDuration(total)} ({catPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Notes & Reflections */}
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-md">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Daily Journal & Ride/Work Notes</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Record Foodpanda orders/earnings, video analytics, client milestones, or evening reflections.
        </p>
        <textarea
          rows={4}
          value={dayNotes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="e.g. Foodpanda: 18 orders completed, PKR 4,200. YouTube: Released Episode 4 animation, great initial CTR! Web Dev: fixed client payment gateway..."
          className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
        />
      </div>
    </div>
  );
};

