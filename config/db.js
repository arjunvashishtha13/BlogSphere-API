const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blogsphere';

  // Production-ready connection options (works for both local and Atlas)
  const options = {
    maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    heartbeatFrequencyMS: 10000,
  };
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
    console.log('Connected to:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
  });


  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting reconnection...');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });

  await mongoose.connect(mongoUri, options);
};

module.exports = connectDB;
