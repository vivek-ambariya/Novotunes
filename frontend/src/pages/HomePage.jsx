import React from 'react';
import { MusicCard } from '../components/MusicCard';
import { SparklesIcon, PlayIcon } from '../components/Icons';

export function HomePage({
  catalog = [],
  artists = [],
  recentlyPlayedList = [],
  mlRecommendations = [],
  onPlayTrack,
  onPlayList,
  navigateTo,
  likedIds,
  onToggleLike
}) {
  const popularAlbums = React.useMemo(() => {
    const albumMap = new Map();
    catalog.forEach((t) => {
      if (t.album && !albumMap.has(t.album)) {
        albumMap.set(t.album, {
          id: t.album,
          title: t.album,
          artist: t.artist,
          cover_image: t.cover_image,
          release_year: t.release_year || 2026,
          tracks: catalog.filter((x) => x.album === t.album)
        });
      }
    });
    return Array.from(albumMap.values()).slice(0, 8);
  }, [catalog]);

  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none">
      
      {/* ─── AI ASSISTANT HERO BANNER ─── */}
      <div className="relative rounded-3xl bg-slate-900 border border-blue-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-xl">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-3.5 py-1 text-[10px] font-bold tracking-widest uppercase">
            <SparklesIcon className="w-3.5 h-3.5 text-blue-400" /> NovaTunes AI Engine
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-3 leading-snug text-white">
            Music crafted around your exact mood and emotions
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Use our AI prompt analyzer or Facial Vibe Matcher to instantly generate custom audio queues.
          </p>
        </div>
        <button
          onClick={() => navigateTo({ tab: 'ai-assistant' })}
          className="relative z-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase px-7 py-3.5 tracking-widest transition duration-200 shrink-0 shadow-lg shadow-blue-500/20"
        >
          Open AI Assistant ✨
        </button>
      </div>

      {/* ─── RECENTLY PLAYED ─── */}
      {recentlyPlayedList.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Recently Played
            </h3>
          </div>
          <div className="horizontal-scroll-row no-scrollbar">
            {recentlyPlayedList.slice(0, 10).map((track) => (
              <MusicCard
                key={track.id}
                item={track}
                type="track"
                onPlay={() => onPlayTrack(track.id, recentlyPlayedList.map((t) => t.id))}
                onNavigate={() => track.album && navigateTo({ tab: 'album', id: track.album })}
                isLiked={likedIds.includes(track.id)}
                onToggleLike={() => onToggleLike(track.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── MADE FOR YOU (AI ML RECOMMENDATIONS) ─── */}
      {mlRecommendations.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-blue-400" /> Made For You
            </h3>
          </div>
          <div className="horizontal-scroll-row no-scrollbar">
            {mlRecommendations.map((track) => (
              <MusicCard
                key={track.id}
                item={track}
                type="track"
                onPlay={() => onPlayTrack(track.id, mlRecommendations.map((t) => t.id))}
                onNavigate={() => track.album && navigateTo({ tab: 'album', id: track.album })}
                isLiked={likedIds.includes(track.id)}
                onToggleLike={() => onToggleLike(track.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── TRENDING SONGS ─── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Trending Songs
          </h3>
        </div>
        <div className="horizontal-scroll-row no-scrollbar">
          {catalog.slice(0, 12).map((track) => (
            <MusicCard
              key={track.id}
              item={track}
              type="track"
              onPlay={() => onPlayTrack(track.id, catalog.map((t) => t.id))}
              onNavigate={() => track.album && navigateTo({ tab: 'album', id: track.album })}
              isLiked={likedIds.includes(track.id)}
              onToggleLike={() => onToggleLike(track.id)}
            />
          ))}
        </div>
      </section>

      {/* ─── TOP ARTISTS ─── */}
      {artists.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Top Artists
            </h3>
          </div>
          <div className="horizontal-scroll-row no-scrollbar">
            {artists.slice(0, 10).map((artist) => (
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

      {/* ─── POPULAR ALBUMS ─── */}
      {popularAlbums.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Popular Albums
            </h3>
          </div>
          <div className="horizontal-scroll-row no-scrollbar">
            {popularAlbums.map((album) => (
              <MusicCard
                key={album.title}
                item={album}
                type="album"
                onPlay={() => onPlayList(album.tracks)}
                onNavigate={() => navigateTo({ tab: 'album', id: album.title })}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── RECOMMENDED MIXES ─── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Recommended Mixes
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { mood: 'happy', label: 'Happy Pop Mix' },
            { mood: 'sad', label: 'Dreamy Melancholy Mix' },
            { mood: 'romantic', label: 'Love & Acoustic Mix' },
            { mood: 'workout', label: 'High Energy Gym Mix' }
          ].map((mix) => (
            <button
              key={mix.mood}
              onClick={() => {
                const list = catalog.filter((t) => t.mood === mix.mood);
                onPlayList(list.length > 0 ? list : catalog.slice(0, 5));
              }}
              className="rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 p-5 text-left font-black text-sm text-white flex flex-col justify-between h-28 hover:scale-[1.02] shadow-md transition-all duration-200 group"
            >
              <span className="text-white group-hover:text-blue-400 transition-colors">{mix.label}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-blue-400 flex items-center gap-1 transition-colors">
                Play Mix <PlayIcon className="w-3 h-3 text-blue-400 ml-1" filled />
              </span>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}
