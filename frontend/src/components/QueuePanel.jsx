import React from 'react';
import { XIcon, TrashIcon, MusicIcon } from './Icons';

export function QueuePanel({
  queue,
  queueIndex,
  currentTrack,
  allTracks,
  isPlaying,
  onClose,
  onRemoveTrack,
  onReorderQueue,
  onPlayTrack,
  onClearQueue,
  onSaveQueueAsPlaylist
}) {
  return (
    <aside className="w-80 bg-slate-950/90 border-l border-white/10 flex flex-col p-4 gap-4 backdrop-blur-2xl shrink-0 overflow-hidden text-left animate-slide-up relative z-30 select-none shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
        <h3 className="font-black text-xs tracking-wider uppercase text-blue-400">
          Playing Queue
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          title="Close Queue"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 no-scrollbar">
        {/* NOW PLAYING */}
        {currentTrack ? (
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Now Playing
            </h4>
            <div className="flex items-center gap-3 p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-2xl shadow-md">
              {currentTrack.cover_image ? (
                <img
                  src={currentTrack.cover_image}
                  alt={currentTrack.title}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <MusicIcon className="w-5 h-5 text-blue-400" />
                </div>
              )}
              <div className="flex-1 truncate text-left">
                <p className="font-bold text-xs text-white truncate">{currentTrack.title}</p>
                <p className="text-[10px] text-blue-400 truncate mt-0.5">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No track playing.</p>
        )}

        {/* NEXT UP */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Next Up ({queue.length})
            </h4>
            {queue.length > 0 && (
              <button
                onClick={onClearQueue}
                className="text-[10px] text-slate-400 hover:text-white font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {queue.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-white/5 rounded-2xl">
              <p className="text-xs text-slate-500">Queue is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto no-scrollbar">
              {queue.map((id, index) => {
                const track = allTracks.find((t) => t.id === id || t.track_id === id);
                if (!track) return null;
                const isCurrent = queueIndex === index;

                return (
                  <div
                    key={`${id}-${index}`}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-600/10 border-blue-500/20'
                        : 'bg-white/[0.03] border-white/5 hover:bg-blue-600/10'
                    }`}
                  >
                    <div
                      onClick={() => onPlayTrack(track.id, queue)}
                      className="flex items-center gap-2.5 max-w-[170px] truncate text-left cursor-pointer group"
                    >
                      {track.cover_image ? (
                        <img
                          src={track.cover_image}
                          alt={track.title}
                          className="w-8 h-8 rounded-lg object-cover border border-white/5 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          <MusicIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className={`font-bold text-xs truncate ${isCurrent ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
                          {track.title}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={() => onReorderQueue(index, -1)}
                        className="p-1 text-[9px] text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <button
                        disabled={index === queue.length - 1}
                        onClick={() => onReorderQueue(index, 1)}
                        className="p-1 text-[9px] text-slate-400 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => onRemoveTrack(index)}
                        className="p-1 text-[10px] text-slate-400 hover:text-white font-bold ml-1"
                        title="Remove"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Save Queue Footer Button */}
      {queue.length > 0 && (
        <button
          onClick={onSaveQueueAsPlaylist}
          className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-center text-white shrink-0 mt-2 transition shadow-md"
        >
          Save Queue as Playlist
        </button>
      )}
    </aside>
  );
}
