import React from 'react';
import { TrackList } from '../components/TrackList';
import { SparklesIcon, CameraIcon, PlayIcon, ShuffleIcon } from '../components/Icons';

export function AiAssistantPage({
  aiInput,
  setAiInput,
  onAiSubmit,
  aiLoading,
  aiResult,
  onOpenWebcam,
  onPlayTrack,
  onPlayList,
  onShufflePlay,
  onSaveQueueAsPlaylist,
  currentTrack,
  isPlaying,
  likedIds,
  onToggleLike,
  onOpenAddPlaylist,
  navigateTo
}) {
  return (
    <div className="space-y-8 animate-fade-in text-left pb-12 select-none max-w-4xl mx-auto">
      {/* AI HERO */}
      <div className="rounded-3xl border border-blue-500/30 bg-slate-900 p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-xl">
        <SparklesIcon className="w-8 h-8 text-blue-400 mb-3" />
        <h1 className="text-3xl font-black text-white">AI Mood & Vibe Assistant</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-2xl">
          Describe how you feel in plain text or analyze your facial expression via webcam. Our AI engine decodes your emotion and crafts a tailored music queue.
        </p>

        {/* Form Input */}
        <form onSubmit={onAiSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g. I'm feeling focused for programming, or tired after workout..."
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            className="flex-1 rounded-2xl border border-white/10 bg-slate-950 px-5 py-3.5 text-xs text-white outline-none focus:border-blue-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiInput.trim()}
            className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase px-6 py-3.5 tracking-wider disabled:opacity-40 hover:scale-[1.01] transition shadow-md shrink-0"
          >
            {aiLoading ? 'Analyzing...' : 'Submit Vibe'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-slate-500 text-xs font-semibold">Or try:</span>
          <button
            onClick={onOpenWebcam}
            className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 border border-white/10 transition"
          >
            <CameraIcon className="w-3.5 h-3.5 text-blue-400" /> Facial Vibe Matcher
          </button>
        </div>
      </div>

      {/* AI RESULT QUEUE */}
      {aiResult && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.04] border border-white/10 rounded-3xl p-6 gap-4">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Detected Vibe State
              </p>
              <h3 className="text-2xl font-black text-white flex items-center gap-2 mt-1">
                <span>
                  {aiResult.emotion === 'stress' ? '😰' :
                   aiResult.emotion === 'happy' ? '😊' :
                   aiResult.emotion === 'sad' ? '😢' :
                   aiResult.emotion === 'calm' ? '😌' :
                   aiResult.emotion === 'focus' ? '🧠' : '✨'}
                </span>
                <span className="capitalize">{aiResult.emotion}</span>
              </h3>
            </div>

            {aiResult.tracks && aiResult.tracks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onPlayList(aiResult.tracks)}
                  className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-2.5 shadow-md tracking-wider"
                >
                  <PlayIcon className="w-3.5 h-3.5 text-white" filled /> Play Mix
                </button>

                <button
                  onClick={() => onShufflePlay(aiResult.tracks)}
                  className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 border border-white/10"
                >
                  <ShuffleIcon className="w-3.5 h-3.5 text-white" /> Shuffle
                </button>

                <button
                  onClick={() => onSaveQueueAsPlaylist(aiResult.tracks)}
                  className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold text-xs px-4 py-2.5"
                >
                  Save as Playlist
                </button>
              </div>
            )}
          </div>

          {aiResult.tracks && (
            <TrackList
              tracks={aiResult.tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={(id) => onPlayTrack(id, aiResult.tracks.map((t) => t.id))}
              likedIds={likedIds}
              onToggleLike={onToggleLike}
              onOpenAddPlaylist={onOpenAddPlaylist}
              navigateTo={navigateTo}
            />
          )}
        </div>
      )}
    </div>
  );
}
