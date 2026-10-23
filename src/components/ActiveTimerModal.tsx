'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RoutineItem } from '@/types/routine';
import { formatSecondsToTimer } from '@/utils/timeUtils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Plus, 
  Volume2, 
  VolumeX,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveTimerModalProps {
  item: RoutineItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteItem: (itemId: string) => void;
}

export const ActiveTimerModal: React.FC<ActiveTimerModalProps> = ({
  item,
  isOpen,
  onClose,
  onCompleteItem,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Initialize timer whenever item changes or modal opens
  useEffect(() => {
    if (item && isOpen) {
      const initial = item.durationMinutes * 60;
      setTotalSeconds(initial);
      setSecondsLeft(initial);
      setIsRunning(true);
    }
  }, [item, isOpen]);

  // Audio tone generator using Web Audio API
  const playBeep = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio might be blocked by user gesture policy
    }
  };

  // Timer tick effect
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          playBeep();
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.5 },
            });
          } catch {
            // ignore
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen || !item) return null;

  const percentageElapsed = totalSeconds > 0 
    ? Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100))
    : 0;

  const handleAddFiveMinutes = () => {
    setSecondsLeft((prev) => prev + 300);
    setTotalSeconds((prev) => prev + 300);
  };

  const handleReset = () => {
    const initial = item.durationMinutes * 60;
    setTotalSeconds(initial);
    setSecondsLeft(initial);
    setIsRunning(false);
  };

  const handleCompleteAndClose = () => {
    onCompleteItem(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Controls */}
        <div className="flex items-center justify-between relative z-10 mb-6">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Focus Time Block
          </span>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Title */}
        <div className="relative z-10 mb-6 space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {item.suggestedTime || `${item.durationMinutes} Minutes Session`}
          </p>
        </div>

        {/* Circular / Big Timer Display */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="96"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="96"
                stroke="currentColor"
                strokeWidth="10"
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-500"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 96}
                strokeDashoffset={2 * Math.PI * 96 * (1 - (secondsLeft / Math.max(totalSeconds, 1)))}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Digital Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {formatSecondsToTimer(secondsLeft)}
              </span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                {percentageElapsed}% Elapsed
              </span>
            </div>
          </div>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="relative z-10 flex items-center justify-center gap-3 mb-6">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Reset Countdown"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all text-sm"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            onClick={handleAddFiveMinutes}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center gap-1"
            title="Add 5 Minutes"
          >
            <Plus className="w-4 h-4" />
            <span>5m</span>
          </button>
        </div>

        {/* Complete and Mark Done */}
        <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleCompleteAndClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & Check Off Block</span>
          </button>
        </div>

      </div>
    </div>
  );
};

