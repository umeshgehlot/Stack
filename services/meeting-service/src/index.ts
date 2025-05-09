import { createApp } from './app';
import { WebRtcHandler } from './handlers/webrtc.handler';

// Load environment variables
const {
  PORT = 3003,
  HOST = '0.0.0.0'
} = process.env;

// Start the server
const start = async () => {
  try {
    const fastify = await createApp();
    
    // Initialize WebRTC handler
    const webRtcHandler = new WebRtcHandler(fastify);
    webRtcHandler.registerWebSocketRoutes(fastify);
    
    await fastify.listen({ port: Number(PORT), host: HOST });
    
    // Log successful startup
    fastify.log.info(`Meeting service is running on ${HOST}:${PORT}`);
    
    // Handle graceful shutdown
    const shutdown = async () => {
      fastify.log.info('Shutting down meeting service...');
      await fastify.close();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();
