import React, { useState } from 'react';
import { SettingsIcon } from '../components/Icons';

export function SettingsPage({ user, onLogout }) {
  const [audioQuality, setAudioQuality] = useState('high');
  const [crossfade, setCrossfade] = useState(4);
  const [autoplay, setAutoplay] = useState(true);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('dark');

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <SettingsIcon className="w-6 h-6 text-blue-400" />
        <div>
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-xs text-slate-400">Manage audio quality, themes, and playback preferences.</p>
        </div>
      </div>

      {/* AUDIO PREFERENCES */}
      <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">
          Audio Playback
        </h3>

        {/* Audio Quality */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
          <div>
            <p className="font-bold text-sm text-white">Audio Quality</p>
            <p className="text-xs text-slate-400">Higher quality uses more bandwidth.</p>
          </div>
          <select
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="normal">Normal (160 kbps)</option>
            <option value="high">High (320 kbps)</option>
            <option value="lossless">Lossless Hi-Fi (24-bit/96kHz)</option>
          </select>
        </div>

        {/* Crossfade */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
          <div>
            <p className="font-bold text-sm text-white">Crossfade Songs</p>
            <p className="text-xs text-slate-400">Overlap tracks seamlessly during playback transitions ({crossfade}s).</p>
          </div>
          <div className="flex items-center gap-3 w-48">
            <span className="text-xs text-slate-400 font-mono">0s</span>
            <input
              type="range"
              min="0"
              max="12"
              value={crossfade}
              onChange={(e) => setCrossfade(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none accent-blue-500 cursor-pointer"
            />
            <span className="text-xs text-blue-400 font-mono font-bold">{crossfade}s</span>
          </div>
        </div>

        {/* Autoplay */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-sm text-white">Autoplay</p>
            <p className="text-xs text-slate-400">Keep listening to similar songs when your queue finishes.</p>
          </div>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
              autoplay ? 'bg-blue-600' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                autoplay ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* APPEARANCE & REGIONAL */}
      <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 space-y-6">
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">
          Appearance & Language
        </h3>

        {/* Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-5">
          <div>
            <p className="font-bold text-sm text-white">Theme Palette</p>
            <p className="text-xs text-slate-400">Choose your preferred visual aesthetic.</p>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="dark">Spotify Dark (Default)</option>
            <option value="space">Deep Slate Space</option>
          </select>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-sm text-white">Display Language</p>
            <p className="text-xs text-slate-400">Language used across navigation and UI.</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="English">English (US)</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>

      {/* ACCOUNT */}
      <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
          Account Information
        </h3>

        <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-black text-white shadow-md">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="font-bold text-sm text-white">{user?.username}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 font-bold text-xs px-5 py-2.5 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
