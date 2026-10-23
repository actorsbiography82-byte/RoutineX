'use client';

import React, { useState } from 'react';
import { useRoutineStorage } from '@/hooks/useRoutineStorage';
import { RoutineCategory, RoutineItem } from '@/types/routine';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TimeBlockTimeline } from '@/components/TimeBlockTimeline';
import { TaskChecklist } from '@/components/TaskChecklist';
import { ActiveTimerModal } from '@/components/ActiveTimerModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import { ExportImportModal } from '@/components/ExportImportModal';
import { StatsDrawer } from '@/components/StatsDrawer';
import { 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function RoutineXPage() {
  const {
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
  } = useRoutineStorage();

  const [selectedCategory, setSelectedCategory] = useState<RoutineCategory>('all');
  const [activeTabMobile, setActiveTabMobile] = useState<'checklist' | 'timeline' | 'stats'>('checklist');

  // Modals state
  const [activeTimerItem, setActiveTimerItem] = useState<RoutineItem | null>(null);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter items according to selected category
  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  const completedCount = items.filter((i) => i.completed).length;

  const handleStartTimer = (item: RoutineItem) => {
    setActiveTimerItem(item);
    setIsTimerOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-emerald-400 p-[2px] animate-spin">
            <div className="w-full h-full bg-slate-950 rounded-[14px]" />
          </div>
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">
            Loading RoutineX Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 pb-24 md:pb-12 transition-colors">
      
      {/* Top Header Bar */}
      <Header
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        streak={streak}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetDay={resetCurrentDay}
        onMarkAllDone={markAllCompleted}
        totalCompleted={completedCount}
        totalCount={items.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 space-y-6">
        
        {/* Progress Bar & Milestone Banner */}
        <ProgressBar items={items} />

        {/* Desktop 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Left/Center Column (7 cols on Desktop) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* View Mode Switcher on Mobile/Tablet */}
            <div className="flex md:hidden bg-slate-200/80 dark:bg-slate-900 rounded-2xl p-1 border border-slate-300/80 dark:border-slate-800">
              <button
                onClick={() => setActiveTabMobile('checklist')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTabMobile === 'checklist'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Checklist</span>
              </button>

              <button
                onClick={() => setActiveTabMobile('timeline')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTabMobile === 'timeline'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>24h Timeline</span>
              </button>

              <button
                onClick={() => setActiveTabMobile('stats')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTabMobile === 'stats'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Insights</span>
              </button>
            </div>

            {/* Checklist Mode */}
            <div className={`space-y-4 ${activeTabMobile !== 'checklist' ? 'hidden md:block' : ''}`}>
              {/* Category Filter Pills */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                items={items}
              />

              {/* Task Checklist Items */}
              <TaskChecklist
                items={filteredItems}
                onToggleItem={toggleItemCompletion}
                onToggleSubtask={toggleSubtask}
                onDeleteItem={deleteItem}
                onStartTimer={handleStartTimer}
              />
            </div>

            {/* Mobile Timeline Tab View */}
            <div className={`md:hidden ${activeTabMobile === 'timeline' ? 'block' : 'hidden'}`}>
              <TimeBlockTimeline
                items={items}
                onStartTimer={handleStartTimer}
                onToggleItem={toggleItemCompletion}
              />
            </div>

            {/* Mobile Stats & Journal Tab View */}
            <div className={`md:hidden ${activeTabMobile === 'stats' ? 'block' : 'hidden'}`}>
              <StatsDrawer
                items={items}
                streak={streak}
                dayNotes={dayNotes}
                onUpdateNotes={updateDayNotes}
              />
            </div>

          </div>

          {/* Right Sidebar Column (4 cols on Desktop) - Visible on lg+ screens */}
          <div className="hidden lg:block lg:col-span-4 space-y-6 sticky top-28">
            {/* Visual 24H Timeline on Desktop */}
            <TimeBlockTimeline
              items={items}
              onStartTimer={handleStartTimer}
              onToggleItem={toggleItemCompletion}
            />

            {/* Stats, Breakdown & Daily Notes */}
            <StatsDrawer
              items={items}
              streak={streak}
              dayNotes={dayNotes}
              onUpdateNotes={updateDayNotes}
            />
          </div>

        </div>

      </main>

      {/* Floating Bottom Bar for Mobile Viewports */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-4 py-2.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTabMobile('checklist')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTabMobile === 'checklist'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px]">Tasks</span>
        </button>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-90 transition-all"
          title="Add New Routine Task"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTabMobile('timeline')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTabMobile === 'timeline'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Timeline</span>
        </button>

        <button
          onClick={() => setActiveTabMobile('stats')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTabMobile === 'stats'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px]">Stats</span>
        </button>
      </nav>

      {/* Modals */}
      <ActiveTimerModal
        item={activeTimerItem}
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        onCompleteItem={toggleItemCompletion}
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={addItem}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={exportAllData}
        onImport={importAllData}
      />

    </div>
  );
}

