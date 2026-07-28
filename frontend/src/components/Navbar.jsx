import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  CameraIcon,
  SettingsIcon
} from './Icons';

export function Navbar({
  currentView,
  goBack,
  goForward,
  historyIndex,
  historyLength,
  aiInput,
  setAiInput,
  onAiSubmit,
  aiLoading,
  onOpenWebcam,
  user,
  onLogout,
  navigateTo
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTitle = () => {
    if (currentView.tab === 'home') return 'Home';
    if (currentView.tab === 'search') return 'Search Catalog';
    if (currentView.tab === 'library') return 'Your Library';
    if (currentView.tab === 'ai-assistant') return 'AI Mood Assistant';
    if (currentView.tab === 'settings') return 'Settings';
    if (currentView.tab === 'artist') return `Artist • ${currentView.id || ''}`;
    if (currentView.tab === 'album') return `Album • ${currentView.id || ''}`;
    if (currentView.tab === 'playlist') return `Playlist`;
    return 'NovaTunes';
  };

  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-2xl shrink-0 select-none">
      {/* History Controls & Page Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Go Back"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= historyLength - 1}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Go Forward"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-base font-black tracking-wide text-white truncate max-w-[200px] sm:max-w-xs">
          {getTitle()}
        </h2>
      </div>

      {/* AI Assistant Search Bar */}
      <form
        onSubmit={onAiSubmit}
        className="hidden md:flex items-center gap-2 max-w-sm w-full bg-white/5 rounded-full border border-white/10 px-4 py-1.5 focus-within:border-blue-500 focus-within:bg-white/10 transition-all duration-200"
      >
        <SparklesIcon className="w-4 h-4 text-blue-400 shrink-0" />
        <input
          type="text"
          placeholder="How do you feel today? (e.g. Chill synthwave)"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-400 w-full"
        />
        <button
          type="submit"
          disabled={aiLoading || !aiInput.trim()}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 disabled:opacity-40 transition shrink-0"
        >
          {aiLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {/* Primary CTA & Profile Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenWebcam}
          className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-md shadow-blue-500/20 px-4 py-2 font-bold text-white text-xs uppercase tracking-wider"
        >
          <CameraIcon className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Vibe Matcher</span>
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-xs font-black text-white shadow-sm">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white max-w-[100px] truncate">
              {user?.username || 'User'}
            </span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 z-50 animate-slide-up text-left">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigateTo({ tab: 'settings' });
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-blue-600/10 rounded-xl transition mt-1"
              >
                <SettingsIcon className="w-4 h-4 text-slate-400" />
                Settings
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition mt-1 font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
