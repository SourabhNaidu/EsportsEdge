require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { startMatchCompletedWorker } = require('./workers/matchCompleted.worker');

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'development-only-secret-change-before-deploy';
  console.warn('JWT_SECRET is not set. Using a development-only fallback secret.');
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.emit('server:ready', {
    message: 'Real-time layer connected.',
  });
});

async function startServer() {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`EsportsEdge API listening on http://localhost:${PORT}`);
  });

  if (process.env.START_RABBIT_WORKER !== 'false') {
    startMatchCompletedWorker({ io }).catch((error) => {
      console.warn(`RabbitMQ worker disabled: ${error.message}`);
    });
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  server,
  io,
  startServer,
};
