import React from 'react';
import { XIcon, HeartIcon, MusicIcon } from './Icons';

export function NowPlayingPanel({ currentTrack, isPlaying, onClose, isLiked, onToggleLike, navigateTo }) {
  if (!currentTrack) return null;

  const cover = currentTrack.cover_image || currentTrack.coverImage;

  return (
    <aside className="w-80 bg-slate-950/95 border-l border-white/10 flex flex-col p-5 gap-5 backdrop-blur-2xl shrink-0 overflow-y-auto text-left animate-slide-up relative z-30 select-none shadow-2xl no-scrollbar">
      <div className="flex justify-between items-center shrink-0">
        <h3 className="font-black text-xs tracking-widest uppercase text-slate-400">Now Playing View</h3>
        <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition">
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Artwork */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {cover ? (
          <img src={cover} alt={currentTrack.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <MusicIcon className="w-16 h-16 text-blue-400" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex items-center justify-between">
        <div className="truncate">
          <h2 className="font-black text-base text-white truncate">{currentTrack.title}</h2>
          <p
            onClick={() => currentTrack.artist && navigateTo({ tab: 'artist', id: currentTrack.artist })}
            className="text-xs text-blue-400 truncate hover:underline cursor-pointer mt-0.5"
          >
            {currentTrack.artist}
          </p>
        </div>
        <button
          onClick={() => onToggleLike(currentTrack.id || currentTrack.track_id)}
          className={`p-2 rounded-full border transition ${
            isLiked ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <HeartIcon className="w-4 h-4" filled={isLiked} />
        </button>
      </div>

      {/* Lyrics Box */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-2">
        <h4 className="font-bold text-xs text-white">Lyrics</h4>
        <p className="text-xs text-slate-400 italic leading-relaxed">
          ♪ {currentTrack.title} by {currentTrack.artist} ♪<br />
          (Lyrics synced automatically via audio engine)
        </p>
      </div>
    </aside>
  );
}
