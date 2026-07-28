const axios = require('axios');

async function fetchRecommendations(payload) {
  const baseURL = process.env.DJANGO_ML_BASE_URL || 'http://127.0.0.1:8002';
  const serviceToken = process.env.DJANGO_ML_SERVICE_TOKEN || 'novatunes-local-token';

  const response = await axios.post(`${baseURL}/api/recommendations/`, payload, {
    timeout: 4000,
    headers: {
      'Content-Type': 'application/json',
      ...(serviceToken ? { Authorization: `Bearer ${serviceToken}` } : {}),
    },
  });
  return response.data;
}

module.exports = { fetchRecommendations };
