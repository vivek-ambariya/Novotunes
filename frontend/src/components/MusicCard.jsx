import React from 'react';
import { PlayIcon, HeartIcon, MusicIcon } from './Icons';

export function MusicCard({
  item,
  type = 'track',
  onPlay,
  onNavigate,
  isLiked,
  onToggleLike
}) {
  const title = item.title || item.name || 'Untitled';
  const subtitle =
    type === 'artist'
      ? `${item.monthly_listeners ? Math.round(item.monthly_listeners / 1000) + 'K Listeners' : 'Artist'}`
      : type === 'album'
      ? `${item.artist || 'Album'} • ${item.release_year || ''}`
      : type === 'playlist'
      ? `${item.tracks?.length || item.count || 0} songs`
      : item.artist || 'Track';

  const cover = item.cover_image || item.coverImage || item.profile_pic;

  return (
    <div
      onClick={onNavigate}
      className="group relative flex flex-col p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer shadow-md hover:shadow-blue-500/10 hover:-translate-y-1 select-none"
    >
      {/* Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 border border-white/5">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              type === 'artist' ? 'rounded-full' : 'rounded-xl'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-white/5">
            <MusicIcon className="w-10 h-10 text-slate-500" />
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Play Button (Primary Blue #3B82F6) */}
        {onPlay && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="absolute right-3 bottom-3 w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 hover:bg-blue-500 transition-all duration-300 font-bold"
            title="Play"
          >
            <PlayIcon className="w-5 h-5 text-white ml-0.5" filled />
          </button>
        )}

        {/* Quick Like Heart Indicator */}
        {onToggleLike && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-200 ${
              isLiked
                ? 'bg-blue-600/40 border-blue-500/50 text-blue-400 opacity-100'
                : 'bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60'
            }`}
            title={isLiked ? "Unlike" : "Like"}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={isLiked} />
          </button>
        )}
      </div>

      {/* Info Container */}
      <div className="mt-3 flex flex-col text-left">
        <p className="font-bold text-xs text-white truncate group-hover:text-blue-400 transition-colors">
          {title}
        </p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
