const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. API will run without a database connection.');
    return null;
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return null;
  }
}

function getDatabaseStatus() {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    connected: mongoose.connection.readyState === 1,
  };
}

module.exports = {
  connectDB,
  getDatabaseStatus,
};

