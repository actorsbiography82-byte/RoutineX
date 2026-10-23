'use client';

import React, { useEffect, useRef } from 'react';
import { RoutineItem, RoutineCategory } from '@/types/routine';
import { Award, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgressBarProps {
  items: RoutineItem[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ items }) => {
  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const prevPercentageRef = useRef<number>(percentage);

  // Trigger celebration confetti when reaching 100%
  useEffect(() => {
    if (percentage === 100 && prevPercentageRef.current < 100 && totalCount > 0) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#d70f64', '#ef4444', '#a855f7', '#3b82f6'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
    prevPercentageRef.current = percentage;
  }, [percentage, totalCount]);

  const getMotivationalMessage = () => {
    if (percentage === 0) return 'Bismillah! Begin with focus and purpose.';
    if (percentage < 30) return 'Great start! Maintain momentum.';
    if (percentage < 70) return 'Halfway through today’s powerhouse routine!';
    if (percentage < 100) return 'Almost there! Finish the day strong.';
    return 'Alhamdulillah! 100% Daily Routine Conquered! 🏆';
  };

  // Group stats by major category
  const categories: { label: string; key: RoutineCategory; color: string; border: string }[] = [
    { label: 'Spiritual (5 Prayers + Quran)', key: 'spiritual', color: 'bg-emerald-500', border: 'border-emerald-500/30' },
    { label: 'Foodpanda (6h)', key: 'foodpanda', color: 'bg-rose-500', border: 'border-rose-500/30' },
    { label: 'YouTube Studio (4h)', key: 'youtube', color: 'bg-red-500', border: 'border-red-500/30' },
    { label: 'Agency & Projects', key: 'agency', color: 'bg-blue-500', border: 'border-blue-500/30' },
    { label: 'Growth & Fitness', key: 'growth', color: 'bg-purple-500', border: 'border-purple-500/30' },
  ];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-md relative overflow-hidden transition-all">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-500/10 via-emerald-500/10 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                Daily Discipline Progress
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
              {percentage === 100 ? (
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              ) : null}
              {getMotivationalMessage()}
            </p>
          </div>

          <div className="flex items-baseline gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 bg-clip-text text-transparent">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              ({completedCount} / {totalCount} Done)
            </span>
          </div>
        </div>

        {/* Main Progress Bar track */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-3.5 sm:h-4 p-0.5 border border-slate-200/60 dark:border-slate-700/60 shadow-inner overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-indigo-500 to-rose-500 transition-all duration-700 ease-out shadow-sm relative"
            style={{ width: `${Math.max(percentage, 2)}%` }}
          >
            {percentage > 10 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse-subtle rounded-full" />
            )}
          </div>
        </div>

        {/* Category micro breakdown tags */}
        <div className="pt-1 flex flex-wrap gap-2 text-[11px] sm:text-xs">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat.key);
            if (catItems.length === 0) return null;
            const catCompleted = catItems.filter((i) => i.completed).length;
            const isCatDone = catCompleted === catItems.length;

            return (
              <div
                key={cat.key}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all ${
                  isCatDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                <span>{cat.label}</span>
                <span className="font-bold opacity-80">
                  {catCompleted}/{catItems.length}
                </span>
                {isCatDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

