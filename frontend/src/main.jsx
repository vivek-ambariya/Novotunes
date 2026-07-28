import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { AudioPlayerProvider, useAudioPlayer } from './AudioCore';
import { WebcamVibe } from './WebcamVibe';
import './styles.css';

// Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Player } from './components/Player';
import { QueuePanel } from './components/QueuePanel';
import { NowPlayingPanel } from './components/NowPlayingPanel';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { LibraryPage } from './pages/LibraryPage';
import { AlbumPage } from './pages/AlbumPage';
import { ArtistPage } from './pages/ArtistPage';
import { PlaylistPage } from './pages/PlaylistPage';
import { LikedSongsPage } from './pages/LikedSongsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { AuthScreen } from './pages/AuthScreen';
import { LandingPage } from './pages/LandingPage';

// Local storage session keys
const USERS_KEY = 'novatunes_users';
const SESSION_KEY = 'novatunes_session';

const COVER_PHOTOS = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=300&auto=format&fit=crop"
];

const DEFAULT_DEMO_USER = {
  username: 'DemoUser',
  email: 'demo@novatunes.com',
  password: 'password123'
};

function getStoredUsers() {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
    return [DEFAULT_DEMO_USER];
  }
  try {
    const parsed = JSON.parse(users);
    if (!parsed.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email)) {
      parsed.push(DEFAULT_DEMO_USER);
      localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
    return [DEFAULT_DEMO_USER];
  }
}

function storeUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(email, password) {
  return getStoredUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
}

function emailExists(email) {
  return getStoredUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
}

function getSession() {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username: user.username, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* ═══════════════════════════════════
   MAIN DASHBOARD APPLICATION
   ═══════════════════════════════════ */
function Dashboard({ user, onLogout }) {
  const {
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
  } = useAudioPlayer();

  // Navigation History Stack
  const [viewHistory, setViewHistory] = useState([{ tab: 'home' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentView = viewHistory[historyIndex];

  const navigateTo = (newView) => {
    const nextHistory = viewHistory.slice(0, historyIndex + 1);
    nextHistory.push(newView);
    setViewHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (historyIndex < viewHistory.length - 1) setHistoryIndex(historyIndex + 1);
  };

  // State caches
  const [catalog, setCatalog] = useState([]);
  const [artists, setArtists] = useState([]);

  // User LocalStorage state
  const [likedIds, setLikedIds] = useState(() => JSON.parse(localStorage.getItem(`liked_${user.email}`) || '["rf-spec-1", "rf-spec-3"]'));
  const [downloadedIds, setDownloadedIds] = useState(() => JSON.parse(localStorage.getItem(`downloads_${user.email}`) || '[]'));
  const [favoritesIds, setFavoritesIds] = useState(() => JSON.parse(localStorage.getItem(`favorites_${user.email}`) || '[]'));
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => JSON.parse(localStorage.getItem(`recent_${user.email}`) || '[]'));
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem(`history_${user.email}`) || '[]'));
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    const list = localStorage.getItem(`playlists_${user.email}`);
    return list ? JSON.parse(list) : [];
  });

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  // AI assistant states
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Modal to add song to playlist
  const [showAddPlaylistModal, setShowAddPlaylistModal] = useState(false);
  const [selectedTrackToAdd, setSelectedTrackToAdd] = useState(null);

  // Recommended tracks from Gateway ML
  const [mlRecommendations, setMlRecommendations] = useState([]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`liked_${user.email}`, JSON.stringify(likedIds));
  }, [likedIds, user.email]);

  useEffect(() => {
    localStorage.setItem(`downloads_${user.email}`, JSON.stringify(downloadedIds));
  }, [downloadedIds, user.email]);

  useEffect(() => {
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favoritesIds));
  }, [favoritesIds, user.email]);

  useEffect(() => {
    localStorage.setItem(`recent_${user.email}`, JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed, user.email]);

  useEffect(() => {
    localStorage.setItem(`history_${user.email}`, JSON.stringify(history));
  }, [history, user.email]);

  useEffect(() => {
    localStorage.setItem(`playlists_${user.email}`, JSON.stringify(customPlaylists));
  }, [customPlaylists, user.email]);

  // Load catalog and artists databases
  useEffect(() => {
    let active = true;

    fetch('http://127.0.0.1:8000/api/catalog/?limit=200')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const mappedTracks = (data.tracks || []).map((t) => ({
          ...t,
          id: t.track_id || t.id
        }));
        setCatalog(mappedTracks);
        window.__novatunesTrackCatalog = mappedTracks;
      })
      .catch((err) => console.error('Failed to fetch catalog:', err));

    fetch('http://127.0.0.1:8000/api/catalog/artists/')
      .then((r) => r.json())
      .then((data) => {
        if (active) setArtists(data.artists || []);
      })
      .catch((err) => console.error('Failed to fetch artists:', err));

    return () => {
      active = false;
    };
  }, []);

  // Fetch ML recommendations from Node Gateway
  useEffect(() => {
    if (catalog.length === 0) return;

    fetch('http://localhost:5005/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.username,
        history: history.slice(0, 10).map((id) => ({ song_id: id })),
        catalog: catalog,
        limit: 10
      })
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations) {
          const resolved = data.recommendations.map((rec) => {
            return catalog.find((t) => t.id === rec.track_id) || rec;
          }).filter(Boolean);
          setMlRecommendations(resolved);
        }
      })
      .catch((err) => console.error('Node Gateway ML bridge error:', err));
  }, [catalog, history, user.username]);

  // Track history and play log
  useEffect(() => {
    if (!currentTrack) return;
    const id = currentTrack.id || currentTrack.track_id;

    setHistory((prev) => [id, ...prev.filter((t) => t !== id)].slice(0, 100));
    setRecentlyPlayed((prev) => [id, ...prev.filter((t) => t !== id)].slice(0, 30));

    fetch('http://127.0.0.1:8000/api/recommendations/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.username,
        track_id: id,
        action: 'PLAY'
      })
    }).catch(() => {});
  }, [currentTrack, user.username]);

  // Derived lists
  const likedTracksList = useMemo(() => catalog.filter((t) => likedIds.includes(t.id)), [catalog, likedIds]);
  const downloadedTracksList = useMemo(() => catalog.filter((t) => downloadedIds.includes(t.id)), [catalog, downloadedIds]);
  const favoritesTracksList = useMemo(() => catalog.filter((t) => favoritesIds.includes(t.id)), [catalog, favoritesIds]);
  const recentlyPlayedList = useMemo(() => {
    return recentlyPlayed.map((id) => catalog.find((t) => t.id === id)).filter(Boolean);
  }, [recentlyPlayed, catalog]);

  // Dynamic Views Resolvers
  const activePlaylist = useMemo(() => {
    if (currentView.tab !== 'playlist') return null;
    const id = currentView.id;
    const custom = customPlaylists.find((p) => p.playlist_id === id);
    if (custom) return custom;

    const seeds = [
      { playlist_id: 'pl-chill', name: 'Late Night Drift', description: 'Low-light tracks for deep focus.', tracks: ['rf-spec-1', 'rf-spec-3', 'rf-gen-12', 'rf-gen-24'], cover_image: COVER_PHOTOS[0] },
      { playlist_id: 'pl-energy', name: 'Pulse Boost', description: 'Uplifting tracks for motion and hype.', tracks: ['rf-spec-2', 'rf-gen-8', 'rf-gen-18', 'rf-gen-32'], cover_image: COVER_PHOTOS[1] },
      { playlist_id: 'pl-stress', name: 'Stress Relief Lounge', description: 'Curated tracks to relax your mind.', tracks: ['rf-spec-1', 'rf-spec-2', 'rf-spec-3', 'rf-spec-4', 'rf-spec-5'], cover_image: COVER_PHOTOS[2] },
      { playlist_id: 'pl-focus', name: 'Focus Flow State', description: 'Minimal instrumentals for developers and creators.', tracks: ['rf-gen-6', 'rf-gen-16', 'rf-gen-26', 'rf-gen-36'], cover_image: COVER_PHOTOS[3] }
    ];
    return seeds.find((p) => p.playlist_id === id);
  }, [currentView, customPlaylists]);

  const activeAlbum = useMemo(() => {
    if (currentView.tab !== 'album') return null;
    const albumName = currentView.id;
    const albumTracks = catalog.filter((t) => t.album === albumName);
    if (albumTracks.length === 0) return null;
    return {
      name: albumName,
      artist: albumTracks[0].artist,
      cover_image: albumTracks[0].cover_image,
      release_year: albumTracks[0].release_year || 2026,
      tracks: albumTracks
    };
  }, [currentView, catalog]);

  const [selectedArtistData, setSelectedArtistData] = useState(null);
  useEffect(() => {
    if (currentView.tab !== 'artist') {
      setSelectedArtistData(null);
      return;
    }
    const name = currentView.id;
    fetch(`http://127.0.0.1:8000/api/catalog/artists/${encodeURIComponent(name)}/`)
      .then((r) => r.json())
      .then((data) => {
        const resolvedTracks = (data.tracks || []).map((t) => ({ ...t, id: t.track_id || t.id }));
        const resolvedAlbums = (data.albums || []).map((alb) => ({
          ...alb,
          tracks: (alb.tracks || []).map((t) => ({ ...t, id: t.track_id || t.id }))
        }));
        setSelectedArtistData({
          artist: data.artist,
          tracks: resolvedTracks,
          albums: resolvedAlbums
        });
      })
      .catch((err) => console.error('Failed to load artist details:', err));
  }, [currentView]);

  // Instant Search filter logic
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return { songs: [], artists: [], albums: [], playlists: [] };

    const matchingSongs = catalog.filter((t) =>
      t.title.toLowerCase().includes(query) || t.artist.toLowerCase().includes(query)
    );
    const matchingArtists = artists.filter((a) => a.name.toLowerCase().includes(query));

    const uniqueAlbums = Array.from(new Set(catalog.map((t) => t.album).filter(Boolean)));
    const matchingAlbums = uniqueAlbums
      .filter((alb) => alb.toLowerCase().includes(query))
      .map((alb) => {
        const sample = catalog.find((t) => t.album === alb);
        return { name: alb, artist: sample?.artist, cover_image: sample?.cover_image };
      });

    const seedPlaylists = [
      { playlist_id: 'pl-chill', name: 'Late Night Drift', owner_id: 'system' },
      { playlist_id: 'pl-energy', name: 'Pulse Boost', owner_id: 'system' },
      { playlist_id: 'pl-stress', name: 'Stress Relief Lounge', owner_id: 'system' },
      { playlist_id: 'pl-focus', name: 'Focus Flow State', owner_id: 'system' }
    ];
    const allLists = [...seedPlaylists, ...customPlaylists];
    const matchingPlaylists = allLists.filter((p) => p.name.toLowerCase().includes(query));

    return {
      songs: matchingSongs,
      artists: matchingArtists,
      albums: matchingAlbums,
      playlists: matchingPlaylists
    };
  }, [searchTerm, catalog, artists, customPlaylists]);

  // Toggle Handlers
  const handleToggleLike = (id) => {
    setLikedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleToggleFavorite = (id) => {
    setFavoritesIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleToggleDownload = (id) => {
    setDownloadedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  // Playlist modification logic
  const handleCreatePlaylist = () => {
    const name = prompt('Enter Playlist Name:', `My Playlist #${customPlaylists.length + 1}`);
    if (!name) return;
    const newPlaylist = {
      playlist_id: `pl-user-${Date.now()}`,
      name: name,
      owner_id: user.username,
      description: 'Custom music playlist.',
      tracks: [],
      cover_image: COVER_PHOTOS[customPlaylists.length % COVER_PHOTOS.length]
    };
    setCustomPlaylists((prev) => [...prev, newPlaylist]);
  };

  const handleDeletePlaylist = (id) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    setCustomPlaylists((prev) => prev.filter((p) => p.playlist_id !== id));
    navigateTo({ tab: 'home' });
  };

  const handleRenamePlaylist = (id) => {
    const playlist = customPlaylists.find((p) => p.playlist_id === id);
    if (!playlist) return;
    const newName = prompt('Rename Playlist:', playlist.name);
    if (!newName || !newName.trim()) return;
    setCustomPlaylists((prev) =>
      prev.map((p) => p.playlist_id === id ? { ...p, name: newName.trim() } : p)
    );
  };

  const handleAddTrackToPlaylist = (playlistId, trackId) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.playlist_id === playlistId) {
          if (p.tracks.includes(trackId)) return p;
          return { ...p, tracks: [...p.tracks, trackId] };
        }
        return p;
      })
    );
    setShowAddPlaylistModal(false);
  };

  const handleRemoveTrackFromPlaylist = (playlistId, trackId) => {
    setCustomPlaylists((prev) =>
      prev.map((p) => {
        if (p.playlist_id === playlistId) {
          return { ...p, tracks: p.tracks.filter((t) => t !== trackId) };
        }
        return p;
      })
    );
  };

  // Queue actions
  const handlePlayAllTracks = (tracksList) => {
    if (!tracksList || tracksList.length === 0) return;
    const ids = tracksList.map((t) => t.id || t.track_id);
    playTrack(ids[0], ids);
  };

  const handleShufflePlayAll = (tracksList) => {
    if (!tracksList || tracksList.length === 0) return;
    const ids = tracksList.map((t) => t.id || t.track_id);
    const shuffled = [...ids].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  const handleSaveQueueAsPlaylist = (tracksList) => {
    if (!tracksList || tracksList.length === 0) return;
    const name = prompt('Save Queue as Playlist:', 'AI Recommendation Playlist');
    if (!name) return;
    const newPlaylist = {
      playlist_id: `pl-user-${Date.now()}`,
      name: name,
      owner_id: user.username,
      description: 'Captured playlist from music queue.',
      tracks: tracksList.map((t) => t.id || t.track_id),
      cover_image: COVER_PHOTOS[customPlaylists.length % COVER_PHOTOS.length]
    };
    setCustomPlaylists((prev) => [...prev, newPlaylist]);
    alert('Playlist successfully created!');
  };

  const handleRemoveTrackFromQueue = (index) => {
    setQueue((prev) => prev.filter((_, idx) => idx !== index));
    if (queueIndex >= index && queueIndex > 0) {
      setQueueIndex((prev) => prev - 1);
    }
  };

  const handleReorderQueue = (index, direction) => {
    setQueue((prev) => {
      const list = [...prev];
      const newIdx = index + direction;
      if (newIdx < 0 || newIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[newIdx];
      list[newIdx] = temp;

      if (queueIndex === index) setQueueIndex(newIdx);
      else if (queueIndex === newIdx) setQueueIndex(index);
      return list;
    });
  };

  const handleShareLink = (type, id) => {
    const url = `${window.location.origin}/share/${type}/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert(`Share link copied to clipboard: ${url}`))
      .catch(() => alert('Failed to copy link.'));
  };

  // AI Assistant text search
  const handleTextMoodSearch = async (e) => {
    if (e) e.preventDefault();
    if (!aiInput.trim()) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/mood/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiInput.trim() })
      });
      const data = await response.json();
      const resolved = (data.queue || []).map((t) => {
        return catalog.find((x) => x.id === (t.track_id || t.id)) || t;
      });

      setAiResult({
        emotion: data.detected_emotion,
        tracks: resolved
      });
      navigateTo({ tab: 'ai-assistant' });
    } catch (err) {
      console.error('AI text assistant error:', err);
    } font: {
      setAiLoading(false);
      setAiInput('');
    }
  };

  const handleWebcamResult = (data) => {
    setShowWebcam(false);
    const resolved = (data.queue || []).map((t) => {
      return catalog.find((x) => x.id === (t.track_id || t.id)) || t;
    });
    setAiResult({
      emotion: data.detected_emotion,
      tracks: resolved
    });
    navigateTo({ tab: 'ai-assistant' });
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#020512] text-slate-100 select-none overflow-hidden font-sans">
      {/* Background ambient glowing gradient blobs (Preserved signature background) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-cyan-400/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-[140px]" />
      </div>

      <div className="flex flex-1 w-full overflow-hidden z-10 relative pb-20">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar
          currentView={currentView}
          navigateTo={navigateTo}
          customPlaylists={customPlaylists}
          onCreatePlaylist={handleCreatePlaylist}
          likedCount={likedIds.length}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950/20 relative">
          <Navbar
            currentView={currentView}
            goBack={goBack}
            goForward={goForward}
            historyIndex={historyIndex}
            historyLength={viewHistory.length}
            aiInput={aiInput}
            setAiInput={setAiInput}
            onAiSubmit={handleTextMoodSearch}
            aiLoading={aiLoading}
            onOpenWebcam={() => setShowWebcam(true)}
            user={user}
            onLogout={onLogout}
            navigateTo={navigateTo}
          />

          {/* VIEW CONTROLLER */}
          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {currentView.tab === 'home' && (
              <HomePage
                catalog={catalog}
                artists={artists}
                recentlyPlayedList={recentlyPlayedList}
                mlRecommendations={mlRecommendations}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                navigateTo={navigateTo}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
              />
            )}

            {currentView.tab === 'search' && (
              <SearchPage
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchResults={searchResults}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                navigateTo={navigateTo}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
              />
            )}

            {currentView.tab === 'library' && (
              <LibraryPage
                currentSubTab={currentView.id || 'liked'}
                likedTracksList={likedTracksList}
                customPlaylists={customPlaylists}
                downloadedTracksList={downloadedTracksList}
                favoritesTracksList={favoritesTracksList}
                recentlyPlayedList={recentlyPlayedList}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                navigateTo={navigateTo}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
                onCreatePlaylist={handleCreatePlaylist}
              />
            )}

            {currentView.tab === 'album' && (
              <AlbumPage
                activeAlbum={activeAlbum}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                onShufflePlay={handleShufflePlayAll}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
                navigateTo={navigateTo}
                onShare={handleShareLink}
              />
            )}

            {currentView.tab === 'artist' && (
              <ArtistPage
                selectedArtistData={selectedArtistData}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
                navigateTo={navigateTo}
                onShare={handleShareLink}
              />
            )}

            {currentView.tab === 'playlist' && (
              <PlaylistPage
                activePlaylist={activePlaylist}
                allTracks={catalog}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                onShufflePlay={handleShufflePlayAll}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
                navigateTo={navigateTo}
                onRenamePlaylist={handleRenamePlaylist}
                onDeletePlaylist={handleDeletePlaylist}
                onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
                onShare={handleShareLink}
                currentUser={user}
              />
            )}

            {currentView.tab === 'settings' && (
              <SettingsPage user={user} onLogout={onLogout} />
            )}

            {currentView.tab === 'ai-assistant' && (
              <AiAssistantPage
                aiInput={aiInput}
                setAiInput={setAiInput}
                onAiSubmit={handleTextMoodSearch}
                aiLoading={aiLoading}
                aiResult={aiResult}
                onOpenWebcam={() => setShowWebcam(true)}
                onPlayTrack={playTrack}
                onPlayList={handlePlayAllTracks}
                onShufflePlay={handleShufflePlayAll}
                onSaveQueueAsPlaylist={handleSaveQueueAsPlaylist}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                likedIds={likedIds}
                onToggleLike={handleToggleLike}
                onOpenAddPlaylist={(id) => {
                  setSelectedTrackToAdd(id);
                  setShowAddPlaylistModal(true);
                }}
                navigateTo={navigateTo}
              />
            )}
          </div>
        </main>

        {/* PLAYING QUEUE PANEL */}
        {showQueue && (
          <QueuePanel
            queue={queue}
            queueIndex={queueIndex}
            currentTrack={currentTrack}
            allTracks={catalog}
            isPlaying={isPlaying}
            onClose={() => setShowQueue(false)}
            onRemoveTrack={handleRemoveTrackFromQueue}
            onReorderQueue={handleReorderQueue}
            onPlayTrack={playTrack}
            onClearQueue={() => setQueue([])}
            onSaveQueueAsPlaylist={() => {
              const resolved = queue.map((id) => catalog.find((t) => t.id === id)).filter(Boolean);
              handleSaveQueueAsPlaylist(resolved);
            }}
          />
        )}

        {/* NOW PLAYING PANEL */}
        {showNowPlaying && (
          <NowPlayingPanel
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onClose={() => setShowNowPlaying(false)}
            isLiked={currentTrack ? likedIds.includes(currentTrack.id || currentTrack.track_id) : false}
            onToggleLike={handleToggleLike}
            navigateTo={navigateTo}
          />
        )}
      </div>

      {/* FIXED BOTTOM SPOTIFY-INSPIRED PLAYER */}
      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        volume={volume}
        currentTime={currentTime}
        duration={duration}
        queue={queue}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        togglePlay={togglePlay}
        setVolume={setVolume}
        seek={seek}
        handleNextTrack={handleNextTrack}
        handlePrevTrack={handlePrevTrack}
        setIsShuffle={setIsShuffle}
        setIsRepeat={setIsRepeat}
        likedIds={likedIds}
        favoritesIds={favoritesIds}
        downloadedIds={downloadedIds}
        handleToggleLike={handleToggleLike}
        handleToggleFavorite={handleToggleFavorite}
        handleToggleDownload={handleToggleDownload}
        showQueue={showQueue}
        setShowQueue={setShowQueue}
        onOpenAddPlaylist={(id) => {
          setSelectedTrackToAdd(id);
          setShowAddPlaylistModal(true);
        }}
        showNowPlaying={showNowPlaying}
        setShowNowPlaying={setShowNowPlaying}
        navigateTo={navigateTo}
      />

      {/* ADD TO PLAYLIST MODAL */}
      {showAddPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative text-left">
            <button
              onClick={() => setShowAddPlaylistModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-base font-black text-white mb-4">Add to Playlist</h3>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto no-scrollbar">
              {customPlaylists.map((p) => (
                <button
                  key={p.playlist_id}
                  onClick={() => handleAddTrackToPlaylist(p.playlist_id, selectedTrackToAdd)}
                  className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-xs text-slate-200 font-bold flex justify-between items-center"
                >
                  <span>🎵 {p.name}</span>
                  <span className="text-[10px] text-slate-400">{p.tracks.length} songs</span>
                </button>
              ))}

              <button
                onClick={handleCreatePlaylist}
                className="w-full text-center p-3 rounded-2xl border border-dashed border-cyan-400/40 text-cyan-300 font-bold hover:bg-cyan-400/10 transition text-xs mt-2"
              >
                + Create New Playlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WEBCAM VIBE MATCHER MODAL */}
      {showWebcam && (
        <WebcamVibe
          onClose={() => setShowWebcam(false)}
          onSuccess={handleWebcamResult}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   APP ROOT
   ═══════════════════════════════════ */
function App() {
  const [session, setSessionState] = useState(getSession());
  const [started, setStarted] = useState(!!getSession());

  const handleAuth = (user) => {
    setSession(user);
    setSessionState(user);
    setStarted(true);
  };

  const handleLogout = () => {
    clearSession();
    setSessionState(null);
    setStarted(false);
  };

  if (!started) {
    return <LandingPage onGetStarted={() => setStarted(true)} />;
  }

  if (!session) {
    return (
      <AuthScreen
        onAuth={handleAuth}
        onBack={() => setStarted(false)}
        emailExists={emailExists}
        storeUser={storeUser}
        findUser={findUser}
      />
    );
  }

  return (
    <AudioPlayerProvider>
      <Dashboard user={session} onLogout={handleLogout} />
    </AudioPlayerProvider>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}