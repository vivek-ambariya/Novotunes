import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/**
 * Advanced Web Audio Core API Context
 * Provides single source of truth for playing music, volume control, seeking, 
 * queue management, and synchronization with collaborative rooms.
 */
const AudioPlayerContext = createContext(null);

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export function AudioPlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Playing queue state
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false); // 'off', 'track', 'queue' (simplified as bool for loop)

  const audioRef = useRef(new Audio());

  const resolveTrack = (trackOrId) => {
    if (!trackOrId) return null;
    if (typeof trackOrId === 'object') return trackOrId;
    
    const trackCatalog = window.__novatunesTrackCatalog || [];
    return trackCatalog.find((track) => track.id === trackOrId || track.track_id === trackOrId) || null;
  };

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      // Handle queue progression
      handleNextTrack();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue, queueIndex, isRepeat, isShuffle]);

  const playTrack = (trackOrId, customQueue = null) => {
    const track = resolveTrack(trackOrId);
    if (!track) return;

    const trackUrl = track.audioUrl || track.audio_url;
    if (!trackUrl) {
      alert(`No audio URL preview available for "${track.title}"`);
      return;
    }

    // Set custom queue if provided, else ensure track is in queue
    if (customQueue) {
      setQueue(customQueue);
      const newIndex = customQueue.findIndex((id) => id === track.id || id === track.track_id);
      setQueueIndex(newIndex >= 0 ? newIndex : 0);
    } else {
      setQueue((prev) => {
        const id = track.id || track.track_id;
        if (prev.includes(id)) {
          const newIndex = prev.indexOf(id);
          setQueueIndex(newIndex);
          return prev;
        }
        const updated = [...prev, id];
        setQueueIndex(updated.length - 1);
        return updated;
      });
    }

    setCurrentTrack(track);
    audioRef.current.src = trackUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const togglePlay = () => {
    if (!currentTrack) {
      // Play first track in queue/catalog
      const trackCatalog = window.__novatunesTrackCatalog || [];
      if (trackCatalog.length > 0) {
        playTrack(trackCatalog[0].id || trackCatalog[0].track_id);
      }
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;

    if (isRepeat) {
      // Repeat same track
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      // Loop back to start
      nextIdx = 0;
    }

    setQueueIndex(nextIdx);
    const nextTrackId = queue[nextIdx];
    const track = resolveTrack(nextTrackId);
    if (track) {
      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl || track.audio_url;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handlePrevTrack = () => {
    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }

    setQueueIndex(prevIdx);
    const prevTrackId = queue[prevIdx];
    const track = resolveTrack(prevTrackId);
    if (track) {
      setCurrentTrack(track);
      audioRef.current.src = track.audioUrl || track.audio_url;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const contextValue = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    queueIndex,
    isShuffle,
    isRepeat,
    setQueue,
    setQueueIndex,
    setIsShuffle,
    setIsRepeat,
    playTrack,
    togglePlay,
    setVolume,
    seek,
    handleNextTrack,
    handlePrevTrack
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
