import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { redis } from '@/lib/redis';
dotenv.config();

console.log('🔧 Initializing server...');

const app = express();
const PORT = process.env.PORT || 8000;

console.log(`📡 Setting up server on port ${PORT}`);

// Middleware
console.log('🛡️ Configuring CORS middleware...');
app.use(
  cors({
    origin: 'http://localhost:3000', // your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
console.log('📦 Adding JSON body parser middleware...');
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ status: 'ok', message: 'Server is running' });
});
// Add after the health check
app.get('/test-cache', async (req, res) => {
  console.log('🧪 Test cache endpoint hit');
  try {
    const cacheKey = 'test:key';
    console.log(`🔍 Checking cache for key: ${cacheKey}`);
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log('🎯 Test Cache HIT');
      return res.json({ message: 'Cache HIT', data: cachedData });
    }

    console.log('❌ Test Cache MISS');
    const testData = {
      timestamp: new Date().toISOString(),
      random: Math.random(),
    };

    await redis.set(cacheKey, testData, 300);
    console.log('💾 Test Cache SET');

    res.json({ message: 'Cache MISS', data: testData });
  } catch (error) {
    console.error('Test cache error:', error);
    res.status(500).json({ error: 'Cache test failed' });
  }
});
// Agents Route
console.log('🔗 Loading agents routes...');
import agentsRouter from './routes/agents';

console.log('🛤️ Registering agents routes...');
app.use('/agents', agentsRouter);

// Meetings Route
console.log('🔗 Loading meetings routes...');
import meetingsRouter from './routes/meetings';

console.log('🛤️ Registering meetings routes...');
app.use('/meetings', meetingsRouter);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log('✅ Server initialization complete');
});

// Graceful shutdown: disconnect all active AI agent sessions
import { disconnectAllSessions } from './controllers/agent-realtime.controller';

const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  disconnectAllSessions();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
