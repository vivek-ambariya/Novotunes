import React from 'react';
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
  VolumeMuteIcon,
  HeartIcon,
  StarIcon,
  DownloadIcon,
  QueueIcon,
  PlusIcon,
  MusicIcon
} from './Icons';

function fmtTime(s) {
  if (isNaN(s) || s === null) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export function Player({
  currentTrack,
  isPlaying,
  volume,
  currentTime,
  duration,
  queue,
  isShuffle,
  isRepeat,
  togglePlay,
  setVolume,
  seek,
  handleNextTrack,
  handlePrevTrack,
  setIsShuffle,
  setIsRepeat,
  likedIds,
  favoritesIds,
  downloadedIds,
  handleToggleLike,
  handleToggleFavorite,
  handleToggleDownload,
  showQueue,
  setShowQueue,
  onOpenAddPlaylist,
  showNowPlaying,
  setShowNowPlaying,
  navigateTo
}) {
  const trackId = currentTrack?.id || currentTrack?.track_id;
  const isLiked = trackId ? likedIds.includes(trackId) : false;
  const isFavorite = trackId ? favoritesIds.includes(trackId) : false;
  const isDownloaded = trackId ? downloadedIds.includes(trackId) : false;

  const cover = currentTrack?.cover_image || currentTrack?.coverImage;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 border-t border-white/10 px-4 sm:px-6 flex items-center justify-between backdrop-blur-2xl z-40 select-none shadow-2xl">
      
      {/* ─── LEFT: TRACK DETAILS ─── */}
      <div className="w-1/4 min-w-[180px] flex items-center gap-3 text-left">
        {currentTrack ? (
          <>
            <div
              onClick={() => currentTrack.album && navigateTo({ tab: 'album', id: currentTrack.album })}
              className="relative group cursor-pointer shrink-0"
            >
              {cover ? (
                <img
                  src={cover}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-md group-hover:opacity-80 transition"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 shadow-md">
                  <MusicIcon className="w-6 h-6 text-blue-400" />
                </div>
              )}
            </div>

            <div className="truncate flex-1">
              <p
                onClick={() => currentTrack.album && navigateTo({ tab: 'album', id: currentTrack.album })}
                className="font-bold text-xs text-white truncate hover:underline cursor-pointer"
              >
                {currentTrack.title}
              </p>
              <p
                onClick={() => currentTrack.artist && navigateTo({ tab: 'artist', id: currentTrack.artist })}
                className="text-[11px] text-slate-400 truncate hover:underline cursor-pointer mt-0.5"
              >
                {currentTrack.artist}
              </p>
            </div>

            {/* Quick Actions (Heart, Star, Download, Add to Playlist) */}
            <div className="hidden xl:flex items-center gap-2 pl-2">
              <button
                onClick={() => handleToggleLike(trackId)}
                className={`p-1.5 rounded-full hover:bg-white/10 transition ${
                  isLiked ? 'text-blue-500' : 'text-slate-400 hover:text-white'
                }`}
                title={isLiked ? "Unlike Song" : "Like Song"}
              >
                <HeartIcon className="w-4 h-4" filled={isLiked} />
              </button>

              <button
                onClick={() => handleToggleFavorite(trackId)}
                className={`p-1.5 rounded-full hover:bg-white/10 transition ${
                  isFavorite ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <StarIcon className="w-4 h-4" filled={isFavorite} />
              </button>

              <button
                onClick={() => handleToggleDownload(trackId)}
                className={`p-1.5 rounded-full hover:bg-white/10 transition ${
                  isDownloaded ? 'text-blue-400' : 'text-slate-400 hover:text-white'
                }`}
                title={isDownloaded ? "Remove Offline Download" : "Download Offline"}
              >
                <DownloadIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAddPlaylist(trackId)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
                title="Add to Playlist"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
              <MusicIcon className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-xs text-slate-400">No track playing</p>
              <p className="text-[10px] text-slate-600">Select a song to listen</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── CENTER: PLAYBACK CONTROLS & SEEK BAR ─── */}
      <div className="flex-1 max-w-2xl flex flex-col items-center gap-1.5 px-4">
        {/* Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 rounded-full hover:bg-white/10 transition ${
              isShuffle ? 'text-blue-500' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <ShuffleIcon className="w-4 h-4" active={isShuffle} />
          </button>

          <button
            onClick={handlePrevTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Previous"
          >
            <SkipBackIcon className="w-4 h-4" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white text-black hover:scale-105 transition-transform duration-200 shadow-md shadow-white/10"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4 text-black" />
            ) : (
              <PlayIcon className="w-4 h-4 text-black ml-0.5" filled />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="Next"
          >
            <SkipForwardIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-1.5 rounded-full hover:bg-white/10 transition ${
              isRepeat ? 'text-blue-500' : 'text-slate-400 hover:text-white'
            }`}
            title="Repeat"
          >
            <RepeatIcon className="w-4 h-4" active={isRepeat} />
          </button>
        </div>

        {/* Progress Slider (Primary Blue #3B82F6) */}
        <div className="w-full flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>{fmtTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-blue-500"
            />
          </div>
          <span>{fmtTime(duration)}</span>
        </div>
      </div>

      {/* ─── RIGHT: VOLUME & AUXILIARY CONTROLS ─── */}
      <div className="w-1/4 min-w-[180px] flex items-center justify-end gap-3 text-slate-400">
        {/* Queue Drawer Toggle */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className={`relative p-2 rounded-xl border transition ${
            showQueue
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
              : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
          title="Playing Queue"
        >
          <QueueIcon className="w-4 h-4" />
          {queue.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </button>

        {/* Volume Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            className="p-1.5 rounded-full hover:text-white transition"
            title={volume === 0 ? "Unmute" : "Mute"}
          >
            {volume === 0 ? (
              <VolumeMuteIcon className="w-4 h-4 text-blue-400" />
            ) : (
              <VolumeIcon className="w-4 h-4 text-slate-300" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 bg-white/10 rounded-full appearance-none outline-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </footer>
  );
}
