'use client';

import React from 'react';
import { RoutineCategory, RoutineItem } from '@/types/routine';
import { 
  Layers, 
  Moon, 
  Bike, 
  Youtube, 
  BookOpen, 
  Laptop, 
  Sparkles 
} from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: RoutineCategory;
  onSelectCategory: (category: RoutineCategory) => void;
  items: RoutineItem[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
}) => {
  const categories: { id: RoutineCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'all', label: 'All Routines', icon: <Layers className="w-3.5 h-3.5" />, color: 'text-indigo-500' },
    { id: 'spiritual', label: 'Spiritual (Namaz & Quran)', icon: <Moon className="w-3.5 h-3.5" />, color: 'text-emerald-500' },
    { id: 'foodpanda', label: 'Foodpanda (6h)', icon: <Bike className="w-3.5 h-3.5" />, color: 'text-rose-500' },
    { id: 'youtube', label: 'YouTube Studio (4h)', icon: <Youtube className="w-3.5 h-3.5" />, color: 'text-red-500' },
    { id: 'agency', label: 'Web Dev & Clients', icon: <Laptop className="w-3.5 h-3.5" />, color: 'text-blue-500' },
    { id: 'growth', label: 'Growth & Fitness', icon: <BookOpen className="w-3.5 h-3.5" />, color: 'text-purple-500' },
    { id: 'custom', label: 'Custom Tasks', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-amber-500' },
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const matchingItems = cat.id === 'all' 
            ? items 
            : items.filter((i) => i.category === cat.id);

          const completedCount = matchingItems.filter((i) => i.completed).length;
          const totalCount = matchingItems.length;

          // Don't show custom tab if no custom items and not selected
          if (cat.id === 'custom' && totalCount === 0 && !isActive) {
            return null;
          }

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 border ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={isActive ? 'text-inherit' : cat.color}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {completedCount}/{totalCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

