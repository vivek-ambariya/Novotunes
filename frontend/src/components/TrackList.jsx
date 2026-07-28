import React from 'react';
import { PlayIcon, HeartIcon, PlusIcon, TrashIcon, MusicIcon } from './Icons';

function fmtTime(s) {
  if (isNaN(s) || s === null) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export function TrackList({
  tracks = [],
  currentTrack,
  isPlaying,
  onPlayTrack,
  likedIds = [],
  onToggleLike,
  downloadedIds = [],
  onToggleDownload,
  onOpenAddPlaylist,
  onRemoveTrack,
  showAlbum = true,
  navigateTo
}) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-white/10 rounded-3xl">
        <MusicIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <p className="text-slate-400 text-xs font-semibold">No tracks found</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-md divide-y divide-white/5 select-none">
      {/* Table Header */}
      <div className="grid grid-cols-12 items-center px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/[0.02]">
        <span className="col-span-1 text-center">#</span>
        <span className={`${showAlbum ? 'col-span-6 sm:col-span-5' : 'col-span-8 sm:col-span-7'} text-left`}>Title</span>
        {showAlbum && <span className="hidden sm:block col-span-3 text-left">Album</span>}
        <span className="col-span-5 sm:col-span-3 text-right pr-2">Duration</span>
      </div>

      {/* Rows */}
      {tracks.map((track, index) => {
        const id = track.id || track.track_id;
        const isCurrent = currentTrack?.id === id || currentTrack?.track_id === id;
        const isLiked = likedIds.includes(id);

        return (
          <div
            key={`${id}-${index}`}
            className={`grid grid-cols-12 items-center px-4 py-2.5 text-xs hover:bg-blue-600/10 transition-all duration-150 group ${
              isCurrent ? 'bg-blue-600/10 text-blue-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {/* Number / Play Button / Equalizer */}
            <div className="col-span-1 flex items-center justify-center">
              {isCurrent && isPlaying ? (
                <span className="inline-flex items-end gap-[2px] h-3">
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                </span>
              ) : (
                <button
                  onClick={() => onPlayTrack(id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition hover:scale-110"
                >
                  <span className="group-hover:hidden text-slate-400 font-medium">{index + 1}</span>
                  <PlayIcon className="hidden group-hover:block w-4 h-4 text-blue-400" filled />
                </button>
              )}
            </div>

            {/* Title & Artist */}
            <div className={`${showAlbum ? 'col-span-6 sm:col-span-5' : 'col-span-8 sm:col-span-7'} flex items-center gap-3 text-left truncate`}>
              {track.cover_image && (
                <img
                  src={track.cover_image}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover border border-white/5 shrink-0"
                />
              )}
              <div className="truncate">
                <p className={`font-bold truncate ${isCurrent ? 'text-blue-400' : 'text-white'}`}>
                  {track.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      track.artist && navigateTo({ tab: 'artist', id: track.artist });
                    }}
                    className="hover:underline hover:text-white"
                  >
                    {track.artist}
                  </button>
                </p>
              </div>
            </div>

            {/* Album */}
            {showAlbum && (
              <div className="hidden sm:block col-span-3 text-left truncate text-slate-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    track.album && navigateTo({ tab: 'album', id: track.album });
                  }}
                  className="hover:underline hover:text-white truncate"
                >
                  {track.album || 'Single'}
                </button>
              </div>
            )}

            {/* Actions & Duration */}
            <div className="col-span-5 sm:col-span-3 flex items-center justify-end gap-2 text-right pr-2">
              {onToggleLike && (
                <button
                  onClick={() => onToggleLike(id)}
                  className={`p-1.5 rounded-full hover:bg-white/10 transition opacity-0 group-hover:opacity-100 ${
                    isLiked ? 'text-blue-400 opacity-100' : 'text-slate-400'
                  }`}
                  title="Like"
                >
                  <HeartIcon className="w-3.5 h-3.5" filled={isLiked} />
                </button>
              )}

              {onOpenAddPlaylist && (
                <button
                  onClick={() => onOpenAddPlaylist(id)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                  title="Add to Playlist"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </button>
              )}

              {onRemoveTrack && (
                <button
                  onClick={() => onRemoveTrack(id, index)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                  title="Remove"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              )}

              <span className="text-slate-400 font-mono text-[11px] ml-1">{fmtTime(track.duration)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
