const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    app: 'EsportsEdge API',
    message: 'Valorant prediction platform backend is running.',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server',
  });
});

module.exports = app;
