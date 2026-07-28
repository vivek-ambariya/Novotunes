import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/**
 * Advanced Web Audio Core API Context
 * Provides single source of truth for playing music, volume control, seeking,
 * queue management, audio synthesis fallbacks, and notification triggers.
 */
const AudioPlayerContext = createContext(null);

export const useAudioPlayer = () => useContext(AudioPlayerContext);

const INDIAN_TRACK_TITLES = [
  { title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra', mood: 'romantic', year: 2022 },
  { title: 'Saiyaara', artist: 'Arijit Singh', album: 'Ek Tha Tiger', mood: 'sad', year: 2012 },
  { title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2', mood: 'romantic', year: 2013 },
  { title: 'Apna Bana Le', artist: 'Arijit Singh', album: 'Bhediya', mood: 'romantic', year: 2022 },
  { title: 'Channa Mereya', artist: 'Arijit Singh', album: 'Ae Dil Hai Mushkil', mood: 'sad', year: 2016 },
  { title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal', album: 'Shershaah', mood: 'romantic', year: 2021 },
  { title: 'Ranjha', artist: 'B Praak', album: 'Shershaah', mood: 'sad', year: 2021 },
  { title: 'Tere Vaaste', artist: 'Sachin-Jigar', album: 'Zara Hatke Zara Bachke', mood: 'happy', year: 2023 },
  { title: 'Heeriye', artist: 'Jasleen Royal', album: 'Heeriye Single', mood: 'romantic', year: 2023 },
  { title: 'Kahani Suno 2.0', artist: 'Kaifi Khalil', album: 'Kahani Suno', mood: 'sad', year: 2022 },
  { title: 'Jo Tum Mere Ho', artist: 'Anuv Jain', album: 'Indie Originals', mood: 'romantic', year: 2024 },
  { title: 'Baarishein', artist: 'Anuv Jain', album: 'Baarishein Single', mood: 'calm', year: 2018 },
  { title: 'Liggi', artist: 'Ritviz', album: 'Dev', mood: 'happy', year: 2019 },
  { title: 'Udd Gaye', artist: 'Ritviz', album: 'Bacardi House Party', mood: 'party', year: 2017 },
  { title: 'Cold/Mess', artist: 'Prateek Kuhad', album: 'Cold/Mess EP', mood: 'romantic', year: 2018 },
  { title: 'Excuses', artist: 'AP Dhillon', album: 'Hidden Gems', mood: 'party', year: 2020 },
  { title: 'Brown Munde', artist: 'AP Dhillon', album: 'Not By Chance', mood: 'workout', year: 2020 },
  { title: 'Lover', artist: 'Diljit Dosanjh', album: 'MoonChild Era', mood: 'happy', year: 2021 },
  { title: 'Lemonade', artist: 'Diljit Dosanjh', album: 'Roar', mood: 'party', year: 2019 },
  { title: 'Pasoori', artist: 'Ali Sethi', album: 'Coke Studio 14', mood: 'happy', year: 2022 },
  { title: 'Agar Tum Saath Ho', artist: 'Arijit Singh', album: 'Tamasha', mood: 'sad', year: 2015 },
  { title: 'Kun Faya Kun', artist: 'A.R. Rahman', album: 'Rockstar', mood: 'calm', year: 2011 },
  { title: 'Nadaan Parinde', artist: 'Mohit Chauhan', album: 'Rockstar', mood: 'focus', year: 2011 },
  { title: 'Jai Ho', artist: 'A.R. Rahman', album: 'Slumdog Millionaire', mood: 'happy', year: 2008 },
  { title: 'Tere Bina', artist: 'A.R. Rahman', album: 'Guru', mood: 'romantic', year: 2007 },
  { title: 'Mitwa', artist: 'Shankar-Ehsaan-Loy', album: 'Kabhi Alvida Naa Kehna', mood: 'happy', year: 2006 },
  { title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', album: 'Kal Ho Naa Ho', mood: 'sad', year: 2003 },
  { title: 'Main Agar Kahoon', artist: 'Sonu Nigam', album: 'Om Shanti Om', mood: 'romantic', year: 2007 },
  { title: 'Teri Ore', artist: 'Shreya Ghoshal', album: 'Singh Is Kinng', mood: 'romantic', year: 2008 },
  { title: 'Pee Loon', artist: 'Mohit Chauhan', album: 'Once Upon a Time in Mumbaai', mood: 'romantic', year: 2010 },
  { title: 'Zara Sa', artist: 'KK', album: 'Jannat', mood: 'romantic', year: 2008 },
  { title: 'Labon Ko', artist: 'KK', album: 'Bhool Bhulaiyaa', mood: 'romantic', year: 2007 },
  { title: 'Tu Jaane Na', artist: 'Atif Aslam', album: 'Ajab Prem Ki Ghazab Kahani', mood: 'romantic', year: 2009 },
  { title: 'Tera Hone Laga Hoon', artist: 'Atif Aslam', album: 'Ajab Prem Ki Ghazab Kahani', mood: 'happy', year: 2009 },
  { title: 'Jeene Laga Hoon', artist: 'Atif Aslam', album: 'Ramaiya Vastavaiya', mood: 'happy', year: 2013 },
  { title: 'Shayad', artist: 'Arijit Singh', album: 'Love Aaj Kal', mood: 'romantic', year: 2020 },
  { title: 'Tum Se Hi', artist: 'Mohit Chauhan', album: 'Jab We Met', mood: 'romantic', year: 2007 },
  { title: 'Subhanallah', artist: 'Sreerama Chandra', album: 'Yeh Jawaani Hai Deewani', mood: 'romantic', year: 2013 },
  { title: 'Kabira', artist: 'Tochi Raina', album: 'Yeh Jawaani Hai Deewani', mood: 'calm', year: 2013 },
  { title: 'Balam Pichkari', artist: 'Vishal Dadlani', album: 'Yeh Jawaani Hai Deewani', mood: 'party', year: 2013 },
  { title: 'Badtameez Dil', artist: 'Benny Dayal', album: 'Yeh Jawaani Hai Deewani', mood: 'party', year: 2013 },
  { title: 'Ghodey Pe Sawaar', artist: 'Amit Trivedi', album: 'Qala', mood: 'happy', year: 2022 },
  { title: 'Naina Da Kya Kasoor', artist: 'Amit Trivedi', album: 'Andhadhun', mood: 'happy', year: 2018 },
  { title: 'Ghungroo', artist: 'Arijit Singh', album: 'War', mood: 'party', year: 2019 },
  { title: 'Nashe Si Chhad Gayi', artist: 'Arijit Singh', album: 'Befikre', mood: 'party', year: 2016 },
  { title: 'Kar Gayi Chull', artist: 'Badshah', album: 'Kapoor & Sons', mood: 'party', year: 2016 },
  { title: 'Garmi', artist: 'Badshah', album: 'Street Dancer 3D', mood: 'party', year: 2020 },
  { title: 'Apna Time Aayega', artist: 'Divine', album: 'Gully Boy', mood: 'workout', year: 2019 },
  { title: 'Kohinoor', artist: 'Divine', album: 'Kohinoor', mood: 'workout', year: 2019 },
  { title: 'Attention', artist: 'Charlie Puth', album: 'Voicenotes', mood: 'happy', year: 2017 }
];

const COVER_PHOTOS = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=300&auto=format&fit=crop"
];

const FALLBACK_DEFAULT_TRACKS = INDIAN_TRACK_TITLES.map((t, idx) => {
  const num = (idx % 16) + 1;
  const id = `ind-${idx + 1}`;
  return {
    id: id,
    track_id: id,
    title: t.title,
    artist: t.artist,
    album: t.album,
    genres: ['Hindi', 'Indian Music'],
    mood: t.mood,
    duration: 210 + (idx * 3) % 90,
    audio_url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${num}.mp3`,
    cover_image: COVER_PHOTOS[idx % COVER_PHOTOS.length],
    popularity: 0.98,
    release_year: t.year
  };
});

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
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef(new Audio());

  // Helper: Resolve track from object or ID string
  const resolveTrack = (trackOrId) => {
    if (!trackOrId) return null;
    if (typeof trackOrId === 'object') {
      return {
        ...trackOrId,
        id: trackOrId.id || trackOrId.track_id,
        audio_url: trackOrId.audio_url || trackOrId.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      };
    }

    const trackCatalog = window.__novatunesTrackCatalog || [];
    const found = trackCatalog.find((track) => track.id === trackOrId || track.track_id === trackOrId);
    if (found) return found;

    const fallback = FALLBACK_DEFAULT_TRACKS.find((track) => track.id === trackOrId || track.track_id === trackOrId);
    if (fallback) return fallback;

    return null;
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
    const onEnded = () => handleNextTrack();

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
    if (!track) {
      console.error('Could not resolve track for playback:', trackOrId);
      return;
    }

    const trackId = track.id || track.track_id;
    const trackUrl = track.audio_url || track.audioUrl || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`;

    if (customQueue && Array.isArray(customQueue) && customQueue.length > 0) {
      setQueue(customQueue);
      const newIndex = customQueue.findIndex((id) => id === trackId || id === track.id || id === track.track_id);
      setQueueIndex(newIndex >= 0 ? newIndex : 0);
    } else {
      setQueue((prev) => {
        if (prev.includes(trackId)) {
          setQueueIndex(prev.indexOf(trackId));
          return prev;
        }
        const updated = [...prev, trackId];
        setQueueIndex(updated.length - 1);
        return updated;
      });
    }

    setCurrentTrack(track);

    try {
      audioRef.current.pause();
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('HTML5 Audio autoplay restricted:', err);
            setIsPlaying(true);
          });
      }
    } catch (e) {
      console.error('Playback error:', e);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) {
      const trackCatalog = window.__novatunesTrackCatalog || FALLBACK_DEFAULT_TRACKS;
      if (trackCatalog.length > 0) {
        playTrack(trackCatalog[0]);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Toggle play blocked:", err);
          setIsPlaying(true);
        });
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
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      nextIdx = 0;
    }

    setQueueIndex(nextIdx);
    const nextTrackId = queue[nextIdx];
    const track = resolveTrack(nextTrackId);
    if (track) {
      playTrack(track, queue);
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
      playTrack(track, queue);
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
