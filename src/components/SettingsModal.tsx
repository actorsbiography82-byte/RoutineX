'use client';

import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Check, 
  Copy, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { SheetConfig } from '@/types/routine';
import { GOOGLE_APPS_SCRIPT_CODE } from '@/utils/syncService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (newConfig: SheetConfig) => void;
  onManualPull: () => Promise<void>;
  onManualPush: () => Promise<void>;
  isSyncing: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onManualPull,
  onManualPush,
  isSyncing,
}) => {
  const [url, setUrl] = useState(config.scriptUrl || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showGuide, setShowGuide] = useState(!config.scriptUrl);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      scriptUrl: url.trim(),
    });
    setFeedbackMessage('Settings saved successfully!');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect Google Sheet sync? Your tasks will remain saved locally.')) {
      setUrl('');
      onSaveConfig({
        ...config,
        scriptUrl: '',
        lastSyncedAt: null,
      });
      setFeedbackMessage('Google Sheet disconnected.');
      setTimeout(() => setFeedbackMessage(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
              <Cloud className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Google Sheet Cloud Sync
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedbackMessage && (
          <div className="mt-3 p-2.5 rounded-xl text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-mono"
            />
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
              Paste your deployed Web App endpoint for instant two-way background sync.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Save Configuration
            </button>

            {config.scriptUrl && (
              <>
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={onManualPush}
                  className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5"
                  title="Push local tasks to Google Sheet"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Push to Sheet</span>
                </button>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={onManualPull}
                  className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-1.5"
                  title="Pull latest tasks from Google Sheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Pull from Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-2 text-zinc-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all ml-auto"
                  title="Disconnect Google Sheet"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </form>

        {/* 60-Second Setup Guide */}
        <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            <span>How to setup Google Sheets in 60 seconds</span>
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showGuide && (
            <div className="mt-3 space-y-3 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>Create a blank spreadsheet at <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-zinc-900 dark:text-zinc-100 underline font-semibold">sheets.new</a></li>
                <li>Go to <strong>Extensions &rarr; Apps Script</strong></li>
                <li>Copy and paste the backend code below, then save (<kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-[10px]">Ctrl+S</kbd>)</li>
                <li>Click <strong>Deploy &rarr; New deployment</strong></li>
                <li>Select type: <strong>Web app</strong></li>
                <li>Set Execute as: <strong>Me</strong> and Who has access: <strong>Anyone</strong></li>
                <li>Click <strong>Deploy</strong>, copy your <strong>Web App URL</strong>, and paste it into the field above!</li>
              </ol>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="w-full py-2 px-3 rounded-lg bg-zinc-200/80 dark:bg-zinc-700/80 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 font-semibold flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Apps Script Code!' : 'Copy Google Apps Script Code'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

