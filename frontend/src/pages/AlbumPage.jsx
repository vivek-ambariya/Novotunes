import React from 'react';
import { TrackList } from '../components/TrackList';
import { PlayIcon, ShuffleIcon, ShareIcon, MusicIcon } from '../components/Icons';

export function AlbumPage({
  activeAlbum,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayList,
  onShufflePlay,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  navigateTo,
  onShare
}) {
  if (!activeAlbum) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-400 font-bold text-sm">Album details not found.</p>
      </div>
    );
  }

  const tracks = activeAlbum.tracks || [];
  const cover = activeAlbum.cover_image || tracks[0]?.cover_image;

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none">
      {/* HERO HEADER */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-xl backdrop-blur-xl">
        {cover ? (
          <img
            src={cover}
            alt={activeAlbum.name}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover border border-white/10 shadow-xl shrink-0"
          />
        ) : (
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-xl shrink-0">
            <MusicIcon className="w-16 h-16 text-blue-400" />
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-3.5 py-1 text-[10px] font-black tracking-widest uppercase">
            Album
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            {activeAlbum.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 font-medium">
            <button
              onClick={() => navigateTo({ tab: 'artist', id: activeAlbum.artist })}
              className="font-bold text-blue-400 hover:underline"
            >
              {activeAlbum.artist}
            </button>{' '}
            • {activeAlbum.release_year || 2026} • {tracks.length} songs
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => onPlayList(tracks)}
              className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-7 py-3 shadow-md shadow-blue-500/20 transition tracking-wider"
            >
              <PlayIcon className="w-4 h-4 text-white" filled /> Play All
            </button>
            <button
              onClick={() => onShufflePlay(tracks)}
              className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 border border-white/10 transition"
            >
              <ShuffleIcon className="w-4 h-4 text-white" /> Shuffle
            </button>
            <button
              onClick={() => onShare('album', activeAlbum.name)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Share Link"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TRACKLIST TABLE */}
      <TrackList
        tracks={tracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayTrack={(id) => onPlayTrack(id, tracks.map((t) => t.id))}
        likedIds={likedIds}
        onToggleLike={onToggleLike}
        onOpenAddPlaylist={onOpenAddPlaylist}
        navigateTo={navigateTo}
        showAlbum={false}
      />
    </div>
  );
}
