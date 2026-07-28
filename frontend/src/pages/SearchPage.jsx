import React, { useState } from 'react';
import { SearchIcon, XIcon } from '../components/Icons';
import { TrackList } from '../components/TrackList';
import { MusicCard } from '../components/MusicCard';

export function SearchPage({
  searchTerm,
  setSearchTerm,
  searchResults,
  onPlayTrack,
  onPlayList,
  navigateTo,
  currentTrack,
  isPlaying,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' }
  ];

  const recentSearches = ['Synthwave', 'Chillout', 'Starlight', 'Midnight', 'Cyberpunk'];

  return (
    <div className="space-y-6 animate-fade-in text-left pb-12 select-none">
      {/* Search Input Box */}
      <div className="relative max-w-2xl w-full">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search songs, artists, albums, or playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-white/10 bg-slate-900/60 pl-12 pr-10 py-3.5 text-sm text-white outline-none focus:border-blue-500 focus:bg-slate-900 transition-all shadow-md"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {searchTerm.trim() && (
        <div className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto no-scrollbar">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-blue-600/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Default State */}
      {!searchTerm.trim() ? (
        <div className="py-8 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs text-slate-300 font-semibold hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-white transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8">
          {/* SONGS SECTION */}
          {(activeFilter === 'all' || activeFilter === 'songs') && searchResults.songs.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Songs ({searchResults.songs.length})
              </h3>
              <TrackList
                tracks={searchResults.songs}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={(id) => onPlayTrack(id, searchResults.songs.map((t) => t.id))}
                likedIds={likedIds}
                onToggleLike={onToggleLike}
                onOpenAddPlaylist={onOpenAddPlaylist}
                navigateTo={navigateTo}
              />
            </section>
          )}

          {/* ARTISTS SECTION */}
          {(activeFilter === 'all' || activeFilter === 'artists') && searchResults.artists.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Artists ({searchResults.artists.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {searchResults.artists.map((artist) => (
                  <MusicCard
                    key={artist.artist_id || artist.name}
                    item={artist}
                    type="artist"
                    onNavigate={() => navigateTo({ tab: 'artist', id: artist.name })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ALBUMS SECTION */}
          {(activeFilter === 'all' || activeFilter === 'albums') && searchResults.albums.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Albums ({searchResults.albums.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {searchResults.albums.map((album) => (
                  <MusicCard
                    key={album.name}
                    item={album}
                    type="album"
                    onNavigate={() => navigateTo({ tab: 'album', id: album.name })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* PLAYLISTS SECTION */}
          {(activeFilter === 'all' || activeFilter === 'playlists') && searchResults.playlists.length > 0 && (
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                Playlists ({searchResults.playlists.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {searchResults.playlists.map((playlist) => (
                  <MusicCard
                    key={playlist.playlist_id || playlist.name}
                    item={playlist}
                    type="playlist"
                    onNavigate={() => navigateTo({ tab: 'playlist', id: playlist.playlist_id })}
                  />
                ))}
              </div>
            </section>
          )}

          {/* NO RESULTS */}
          {searchResults.songs.length === 0 &&
            searchResults.artists.length === 0 &&
            searchResults.albums.length === 0 &&
            searchResults.playlists.length === 0 && (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-white font-bold text-sm">No results found for "{searchTerm}"</p>
                <p className="text-slate-400 text-xs mt-1">Check spelling or try a different search term.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
