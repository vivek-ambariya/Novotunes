import React from 'react';
import { TrackList } from '../components/TrackList';
import { PlayIcon, ShuffleIcon, ShareIcon, TrashIcon, MusicIcon } from '../components/Icons';

export function PlaylistPage({
  activePlaylist,
  allTracks,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayList,
  onShufflePlay,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  navigateTo,
  onRenamePlaylist,
  onDeletePlaylist,
  onRemoveTrackFromPlaylist,
  onReorderPlaylistTracks,
  onShare,
  currentUser
}) {
  if (!activePlaylist) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-400 font-bold text-sm">Playlist not found.</p>
      </div>
    );
  }

  const resolvedTracks = React.useMemo(() => {
    return (activePlaylist.tracks || [])
      .map((id) => allTracks.find((t) => t.id === id || t.track_id === id))
      .filter(Boolean);
  }, [activePlaylist, allTracks]);

  const isOwner = activePlaylist.playlist_id.startsWith('pl-user-');
  const cover = activePlaylist.cover_image || resolvedTracks[0]?.cover_image;

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none">
      {/* PLAYLIST HEADER */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-xl backdrop-blur-xl">
        {cover ? (
          <img
            src={cover}
            alt={activePlaylist.name}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover border border-white/10 shadow-xl shrink-0"
          />
        ) : (
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-xl shrink-0">
            <MusicIcon className="w-16 h-16 text-blue-400" />
          </div>
        )}

        <div className="flex-1 text-center sm:text-left">
          <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-3.5 py-1 text-[10px] font-black tracking-widest uppercase">
            Playlist
          </span>

          <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {activePlaylist.name}
            </h1>
            {isOwner && (
              <button
                onClick={() => onRenamePlaylist(activePlaylist.playlist_id)}
                className="text-xs text-blue-400 hover:underline font-semibold ml-2"
              >
                Edit
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300 mt-2 italic max-w-xl">
            {activePlaylist.description}
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Created by <span className="font-bold text-white">{activePlaylist.owner_id || 'NovaTunes'}</span> • {resolvedTracks.length} songs
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {resolvedTracks.length > 0 && (
              <>
                <button
                  onClick={() => onPlayList(resolvedTracks)}
                  className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-7 py-3 shadow-md shadow-blue-500/20 transition tracking-wider"
                >
                  <PlayIcon className="w-4 h-4 text-white" filled /> Play All
                </button>
                <button
                  onClick={() => onShufflePlay(resolvedTracks)}
                  className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 border border-white/10 transition"
                >
                  <ShuffleIcon className="w-4 h-4 text-white" /> Shuffle
                </button>
              </>
            )}

            <button
              onClick={() => onShare('playlist', activePlaylist.playlist_id)}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Share Link"
            >
              <ShareIcon className="w-4 h-4" />
            </button>

            {isOwner && (
              <button
                onClick={() => onDeletePlaylist(activePlaylist.playlist_id)}
                className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition"
                title="Delete Playlist"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TRACKLIST */}
      {resolvedTracks.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
          <p className="text-white font-bold text-sm">This playlist is empty</p>
          <p className="text-slate-400 text-xs mt-1">Search for tracks and add them using the "+" icon.</p>
        </div>
      ) : (
        <TrackList
          tracks={resolvedTracks}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={(id) => onPlayTrack(id, resolvedTracks.map((t) => t.id))}
          likedIds={likedIds}
          onToggleLike={onToggleLike}
          onOpenAddPlaylist={onOpenAddPlaylist}
          onRemoveTrack={isOwner ? (id) => onRemoveTrackFromPlaylist(activePlaylist.playlist_id, id) : null}
          navigateTo={navigateTo}
        />
      )}
    </div>
  );
}
