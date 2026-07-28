import React from 'react';
import { NovaTunesLogo } from '../components/Icons';

export function LandingPage({ onGetStarted }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#050816] text-white select-none">
      {/* Background ambient decoration (Preserved) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute top-[10%] left-[5%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="animate-float absolute bottom-[10%] right-[5%] h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[130px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 p-0.5 shadow-md shadow-blue-500/10">
            <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center">
              <NovaTunesLogo className="w-7 h-7" />
            </div>
          </div>
          <span className="text-xl font-black tracking-widest uppercase text-white">
            NovaTunes
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="rounded-full bg-white/5 px-6 py-2 text-xs font-semibold border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center py-20">
        <div className="max-w-3xl">
          <span className="rounded-full bg-blue-600/10 border border-blue-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-400">
            AI-Driven Premium Audio Streaming
          </span>
          <h1 className="mt-8 text-4xl sm:text-7xl font-black tracking-tight leading-tight text-white">
            Your Music. <br />
            <span className="text-blue-400">
              Decoded by AI.
            </span>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Experience high-quality music streaming, curated playlists, albums, top artists, and an advanced AI Assistant that crafts custom audio queues based on your mood or facial expressions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="rounded-full bg-blue-600 hover:bg-blue-500 transition px-8 py-4 font-bold text-white shadow-lg shadow-blue-500/20 text-xs uppercase tracking-wider"
            >
              Start Listening Free
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
