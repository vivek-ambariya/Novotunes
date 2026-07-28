import React, { useState } from 'react';
import { TrackList } from '../components/TrackList';
import { MusicCard } from '../components/MusicCard';
import { PlayIcon, ShareIcon, UserIcon } from '../components/Icons';

export function ArtistPage({
  selectedArtistData,
  currentTrack,
  isPlaying,
  onPlayTrack,
  onPlayList,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  navigateTo,
  onShare
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  if (!selectedArtistData) {
    return (
      <div className="py-16 text-center animate-pulse">
        <p className="text-slate-400 font-bold text-sm">Loading artist profile...</p>
      </div>
    );
  }

  const { artist, tracks = [], albums = [] } = selectedArtistData;

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none">
      {/* ARTIST HERO BANNER */}
      <div className="relative rounded-3xl h-64 sm:h-80 overflow-hidden flex items-end p-6 sm:p-8 border border-white/10 shadow-xl bg-slate-900">
        {artist.profile_pic && (
          <img
            src={artist.profile_pic}
            alt={artist.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30 filter blur-[2px]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
          <img
            src={artist.profile_pic}
            alt={artist.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-blue-500/80 shadow-2xl shrink-0"
          />
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              ✓ Verified Artist
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white mt-2 leading-tight">
              {artist.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              {artist.monthly_listeners
                ? `${Math.round(artist.monthly_listeners / 100000) / 10}M Monthly Listeners`
                : 'Verified Artist'}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => onPlayList(tracks)}
                className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-6 py-2.5 shadow-md shadow-blue-500/20 tracking-wider transition"
              >
                <PlayIcon className="w-4 h-4 text-white" filled /> Play All
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`rounded-full px-5 py-2.5 text-xs font-bold border transition ${
                  isFollowing
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isFollowing ? 'Following ✓' : 'Follow'}
              </button>
              <button
                onClick={() => onShare('artist', artist.name)}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white transition"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BIOGRAPHY */}
      {artist.bio && (
        <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 text-xs text-slate-300 leading-relaxed">
          <p className="font-bold text-white mb-1.5 uppercase tracking-wider text-[11px]">About</p>
          {artist.bio}
        </div>
      )}

      {/* POPULAR TRACKS */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
          Popular Songs
        </h3>
        <TrackList
          tracks={tracks.slice(0, 5)}
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayTrack={(id) => onPlayTrack(id, tracks.map((t) => t.id))}
          likedIds={likedIds}
          onToggleLike={onToggleLike}
          onOpenAddPlaylist={onOpenAddPlaylist}
          navigateTo={navigateTo}
        />
      </section>

      {/* ALBUMS DISCOGRAPHY */}
      {albums.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
            Albums
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {albums.map((alb) => (
              <MusicCard
                key={alb.name}
                item={alb}
                type="album"
                onNavigate={() => navigateTo({ tab: 'album', id: alb.name })}
              />
            ))}
          </div>
        </section>
      )}

      {/* SIMILAR ARTISTS */}
      {artist.similar_artists && artist.similar_artists.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
            Similar Artists
          </h3>
          <div className="flex flex-wrap gap-2">
            {artist.similar_artists.map((artistName) => (
              <button
                key={artistName}
                onClick={() => navigateTo({ tab: 'artist', id: artistName })}
                className="flex items-center gap-2 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-blue-600/10 hover:border-blue-500/30 hover:text-white transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                {artistName}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
