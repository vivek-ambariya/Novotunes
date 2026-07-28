const express = require('express');
const axios = require('axios');

const router = express.Router();

let cachedToken = null;
let tokenExpiry = null;

// Function to fetch Spotify Client Credentials access token
async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify Client ID or Client Secret is missing in backend .env configuration.');
  }

  // If token is cached and not expired (with 1 min buffer), use it
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 60000) {
    return cachedToken;
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  const { access_token, expires_in } = response.data;
  cachedToken = access_token;
  tokenExpiry = Date.now() + expires_in * 1000;
  return cachedToken;
}

// Search endpoint
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Search query parameter "q" is required.' });
  }

  try {
    const token = await getAccessToken();
    const spotifyResponse = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track,episode',
        limit: 20,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const tracks = (spotifyResponse.data.tracks?.items || []).map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(', '),
      album: track.album.name,
      duration: fmtMs(track.duration_ms),
      audioUrl: track.preview_url, // 30-sec MP3 preview url
      cover_image: track.album.images?.[0]?.url || '',
      mood: 'Spotify Track',
    }));

    const episodes = (spotifyResponse.data.episodes?.items || []).map((episode) => ({
      id: episode.id,
      title: episode.name,
      artist: episode.show?.name || 'Podcast Episode',
      album: episode.show?.publisher || 'Podcast',
      duration: fmtMs(episode.duration_ms),
      audioUrl: episode.audio_preview_url, // 30-sec podcast preview url
      cover_image: episode.images?.[0]?.url || '',
      mood: 'Spotify Podcast',
    }));

    res.json({
      tracks,
      episodes,
    });
  } catch (error) {
    console.error('Spotify Search API Error:', error.message);
    
    // Check if it's a configuration error
    if (error.message.includes('missing in backend .env')) {
      return res.status(400).json({
        error: 'Spotify configuration missing. Please enter your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in the backend `.env` file.',
      });
    }

    res.status(500).json({ error: 'Failed to fetch results from Spotify' });
  }
});

function fmtMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

module.exports = router;
