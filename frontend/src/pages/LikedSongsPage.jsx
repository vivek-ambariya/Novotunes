import React, { useState, useMemo } from 'react';
import { TrackList } from '../components/TrackList';
import { MusicCard } from '../components/MusicCard';
import { PlayIcon, ShuffleIcon, HeartIcon, GridIcon, ListIcon } from '../components/Icons';

export function LikedSongsPage({
  likedTracksList = [],
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayList,
  onShufflePlay,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  navigateTo
}) {
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('recent');

  const sortedTracks = useMemo(() => {
    const copy = [...likedTracksList];
    if (sortBy === 'title') {
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'artist') {
      return copy.sort((a, b) => a.artist.localeCompare(b.artist));
    }
    if (sortBy === 'duration') {
      return copy.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    }
    return copy;
  }, [likedTracksList, sortBy]);

  const totalSeconds = useMemo(() => {
    return likedTracksList.reduce((acc, t) => acc + (t.duration || 0), 0);
  }, [likedTracksList]);

  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none">
      {/* HERO BANNER */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-blue-500/20 shadow-xl backdrop-blur-xl">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-xl shrink-0">
          <HeartIcon className="w-20 h-20 text-blue-400 fill-current" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-3.5 py-1 text-[10px] font-black tracking-widest uppercase">
            Playlist
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
            Liked Songs
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
            Your collection of saved favorite music • <span className="font-bold text-white">{likedTracksList.length} songs</span> (~{totalMinutes} min)
          </p>

          {/* Play & Shuffle buttons */}
          {likedTracksList.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => onPlayList(sortedTracks)}
                className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-7 py-3 shadow-md shadow-blue-500/20 transition tracking-wider"
              >
                <PlayIcon className="w-4 h-4 text-white" filled /> Play All
              </button>

              <button
                onClick={() => onShufflePlay(sortedTracks)}
                className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 border border-white/10 transition"
              >
                <ShuffleIcon className="w-4 h-4 text-white" /> Shuffle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS BAR (SORT & VIEW SWITCHER) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist (A-Z)</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border transition ${
              viewMode === 'grid'
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 border-white/5 hover:text-white'
            }`}
            title="Grid View"
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl border transition ${
              viewMode === 'list'
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-white/[0.04] text-slate-400 border-white/5 hover:text-white'
            }`}
            title="List View"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TRACKS */}
      {sortedTracks.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
          <HeartIcon className="w-12 h-12 text-blue-400/40 mx-auto mb-3" />
          <p className="text-white font-bold text-sm">No liked songs yet</p>
          <p className="text-slate-400 text-xs mt-1">Click the heart icon on any song to save it here.</p>
        </div>
      ) : viewMode === 'list' ? (
        <TrackList
          tracks={sortedTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={(id) => onPlayTrack(id, sortedTracks.map((t) => t.id))}
          likedIds={likedIds}
          onToggleLike={onToggleLike}
          onOpenAddPlaylist={onOpenAddPlaylist}
          navigateTo={navigateTo}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {sortedTracks.map((track) => (
            <MusicCard
              key={track.id}
              item={track}
              type="track"
              onPlay={() => onPlayTrack(track.id, sortedTracks.map((t) => t.id))}
              isLiked={true}
              onToggleLike={() => onToggleLike(track.id)}
              onNavigate={() => track.album && navigateTo({ tab: 'album', id: track.album })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
