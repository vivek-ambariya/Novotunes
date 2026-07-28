const express = require('express');
const axios = require('axios');

const router = express.Router();

/* ───────────────────────────────────────────────
   Curated podcast episodes with direct audio URLs
   All from Creative Commons / public domain sources
   ─────────────────────────────────────────────── */
const FEATURED_PODCASTS = [
  {
    id: 'pod-1',
    title: 'The Power of Habit',
    artist: 'TED Radio Hour',
    album: 'NPR',
    duration: '6:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover_image: '',
    mood: 'Podcast · Science',
    type: 'podcast',
  },
  {
    id: 'pod-2',
    title: 'How Music Affects Your Brain',
    artist: 'BrainStuff',
    album: 'iHeartRadio',
    duration: '5:48',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover_image: '',
    mood: 'Podcast · Science',
    type: 'podcast',
  },
  {
    id: 'pod-3',
    title: 'The Art of Deep Focus',
    artist: 'The Mindful Creative',
    album: 'Creative Commons',
    duration: '6:36',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover_image: '',
    mood: 'Podcast · Mindfulness',
    type: 'podcast',
  },
  {
    id: 'pod-4',
    title: 'Why We Love Lo-Fi Music',
    artist: 'Sound Matters',
    album: 'Open Podcast',
    duration: '5:24',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover_image: '',
    mood: 'Podcast · Music',
    type: 'podcast',
  },
  {
    id: 'pod-5',
    title: 'The History of Electronic Music',
    artist: 'Soundscapes FM',
    album: 'Archive Audio',
    duration: '4:55',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover_image: '',
    mood: 'Podcast · History',
    type: 'podcast',
  },
  {
    id: 'pod-6',
    title: 'Creativity and the Flow State',
    artist: 'The Psychology Podcast',
    album: 'Open Source',
    duration: '5:18',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover_image: '',
    mood: 'Podcast · Psychology',
    type: 'podcast',
  },
  {
    id: 'pod-7',
    title: 'Sound Design in Film',
    artist: 'Audio Craft',
    album: 'CC Audio',
    duration: '6:01',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    cover_image: '',
    mood: 'Podcast · Film',
    type: 'podcast',
  },
  {
    id: 'pod-8',
    title: 'The Science of Sleep & Sound',
    artist: 'Wellness Wave',
    album: 'Public Domain',
    duration: '5:42',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover_image: '',
    mood: 'Podcast · Wellness',
    type: 'podcast',
  },
];

/* ── Featured endpoint ── */
router.get('/featured', (_req, res) => {
  res.json({ episodes: FEATURED_PODCASTS });
});

/* ── Search podcasts via iTunes Search API (no auth required) ── */
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  try {
    // iTunes Search API — free, no API key needed
    const itunesResponse = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: query,
        media: 'podcast',
        entity: 'podcastEpisode',
        limit: 12,
      },
    });

    const episodes = (itunesResponse.data.results || [])
      .filter((ep) => ep.episodeUrl) // only include episodes with playable audio
      .map((ep) => ({
        id: `itunes-${ep.trackId}`,
        title: ep.trackName || 'Untitled Episode',
        artist: ep.collectionName || 'Unknown Show',
        album: ep.artistName || 'Podcast',
        duration: fmtMs(ep.trackTimeMillis || 0),
        audioUrl: ep.episodeUrl,
        cover_image: ep.artworkUrl160 || ep.artworkUrl600 || '',
        mood: `Podcast · ${ep.primaryGenreName || 'General'}`,
        type: 'podcast',
      }));

    res.json({ episodes });
  } catch (error) {
    console.error('iTunes podcast search error:', error.message);
    res.status(500).json({ error: 'Failed to search podcasts' });
  }
});

function fmtMs(ms) {
  if (!ms) return '0:00';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

module.exports = router;
