const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const recommendationRoutes = require('./routes/recommendations');
const spotifyRoutes = require('./routes/spotify');
const podcastRoutes = require('./routes/podcasts');

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'node-backend' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'node-backend', bridge: 'ready' });
});

app.use('/api/recommendations', recommendationRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/podcasts', podcastRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'internal_server_error' });
});

app.listen(port, () => {
  console.log(`NovaTunes Node backend listening on port ${port}`);
});
