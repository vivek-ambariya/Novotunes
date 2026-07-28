const express = require('express');
const { fetchRecommendations } = require('../services/recommendationClient');

const router = express.Router();

const fallbackRecommendations = [
  { song_id: '1', title: 'Midnight Drive', artist: 'Aria Vale', score: 0.94 },
  { song_id: '2', title: 'Neon Pulse', artist: 'Signal Bloom', score: 0.91 },
  { song_id: '3', title: 'Blue Hour', artist: 'Solace Lane', score: 0.88 },
];

router.post('/', async (req, res, next) => {
  try {
    const payload = {
      user_id: req.body.user_id,
      history: req.body.history || [],
      catalog: req.body.catalog || [],
      limit: req.body.limit || 10,
    };

    const data = await fetchRecommendations(payload);
    res.json(data);
  } catch (error) {
    console.error('Django ML bridge unavailable, returning fallback recommendations:', error.message);
    res.status(200).json({
      user_id: req.body.user_id || 'demo-user',
      source: 'fallback',
      recommendations: fallbackRecommendations.slice(0, req.body.limit || 10),
    });
  }
});

module.exports = router;
