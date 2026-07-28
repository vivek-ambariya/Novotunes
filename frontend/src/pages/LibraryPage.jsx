import React, { useState } from 'react';
import { TrackList } from '../components/TrackList';
import { MusicCard } from '../components/MusicCard';
import { GridIcon, ListIcon, HeartIcon, PlaylistsIcon, DownloadIcon, StarIcon } from '../components/Icons';

export function LibraryPage({
  currentSubTab = 'liked',
  likedTracksList = [],
  customPlaylists = [],
  downloadedTracksList = [],
  favoritesTracksList = [],
  recentlyPlayedList = [],
  onPlayTrack,
  onPlayList,
  navigateTo,
  currentTrack,
  isPlaying,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  onCreatePlaylist
}) {
  const [viewMode, setViewMode] = useState('list');

  const subTabs = [
    { id: 'liked', label: 'Liked Songs', Icon: HeartIcon, count: likedTracksList.length },
    { id: 'playlists', label: 'Playlists', Icon: PlaylistsIcon, count: customPlaylists.length + 4 },
    { id: 'downloads', label: 'Downloads', Icon: DownloadIcon, count: downloadedTracksList.length },
    { id: 'favorites', label: 'Favorites', Icon: StarIcon, count: favoritesTracksList.length },
    { id: 'history', label: 'History', Icon: HeartIcon, count: recentlyPlayedList.length }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left pb-12 select-none">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        {/* Sub-tab Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {subTabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => navigateTo({ tab: 'library', id })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                currentSubTab === id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-blue-600/10 hover:text-white'
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                currentSubTab === id ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
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

      {/* ─── TAB: LIKED SONGS ─── */}
      {currentSubTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-xs">{likedTracksList.length} songs saved</p>
            {likedTracksList.length > 0 && (
              <button
                onClick={() => onPlayList(likedTracksList)}
                className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-2 shadow-md transition"
              >
                Play All
              </button>
            )}
          </div>

          {viewMode === 'list' ? (
            <TrackList
              tracks={likedTracksList}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={(id) => onPlayTrack(id, likedTracksList.map((t) => t.id))}
              likedIds={likedIds}
              onToggleLike={onToggleLike}
              onOpenAddPlaylist={onOpenAddPlaylist}
              navigateTo={navigateTo}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {likedTracksList.map((track) => (
                <MusicCard
                  key={track.id}
                  item={track}
                  type="track"
                  onPlay={() => onPlayTrack(track.id, likedTracksList.map((t) => t.id))}
                  isLiked={true}
                  onToggleLike={() => onToggleLike(track.id)}
                  onNavigate={() => track.album && navigateTo({ tab: 'album', id: track.album })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: PLAYLISTS ─── */}
      {currentSubTab === 'playlists' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-xs">Your custom and seed playlists</p>
            <button
              onClick={onCreatePlaylist}
              className="rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 font-bold text-xs px-4 py-2 transition"
            >
              + Create Playlist
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {[
              { id: 'pl-chill', name: 'Late Night Drift', count: 4, cover_image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300' },
              { id: 'pl-energy', name: 'Pulse Boost', count: 4, cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300' },
              { id: 'pl-stress', name: 'Stress Relief Lounge', count: 5, cover_image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300' },
              { id: 'pl-focus', name: 'Focus Flow State', count: 5, cover_image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300' }
            ].map((p) => (
              <MusicCard
                key={p.id}
                item={p}
                type="playlist"
                onNavigate={() => navigateTo({ tab: 'playlist', id: p.id })}
              />
            ))}

            {customPlaylists.map((p) => (
              <MusicCard
                key={p.playlist_id}
                item={p}
                type="playlist"
                onNavigate={() => navigateTo({ tab: 'playlist', id: p.playlist_id })}
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB: DOWNLOADS ─── */}
      {currentSubTab === 'downloads' && (
        <div className="space-y-4">
          <TrackList
            tracks={downloadedTracksList}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={(id) => onPlayTrack(id, downloadedTracksList.map((t) => t.id))}
            likedIds={likedIds}
            onToggleLike={onToggleLike}
            onOpenAddPlaylist={onOpenAddPlaylist}
            navigateTo={navigateTo}
          />
        </div>
      )}

      {/* ─── TAB: FAVORITES ─── */}
      {currentSubTab === 'favorites' && (
        <div className="space-y-4">
          <TrackList
            tracks={favoritesTracksList}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={(id) => onPlayTrack(id, favoritesTracksList.map((t) => t.id))}
            likedIds={likedIds}
            onToggleLike={onToggleLike}
            onOpenAddPlaylist={onOpenAddPlaylist}
            navigateTo={navigateTo}
          />
        </div>
      )}

      {/* ─── TAB: HISTORY ─── */}
      {currentSubTab === 'history' && (
        <div className="space-y-4">
          <TrackList
            tracks={recentlyPlayedList}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={(id) => onPlayTrack(id)}
            likedIds={likedIds}
            onToggleLike={onToggleLike}
            onOpenAddPlaylist={onOpenAddPlaylist}
            navigateTo={navigateTo}
          />
        </div>
      )}
    </div>
  );
}
