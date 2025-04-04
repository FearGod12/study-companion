import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { PrismaClient } from '@prisma/client';
import app from './app.js';
import { NotificationService } from './services/notifications.js';
import { StudySessionWebSocketManager } from './services/socket.js';
import { ReadingSessionController } from './controllers/reading-session.js';

// Create a single Prisma client instance to be shared across the application
const prisma = new PrismaClient();

async function startServer() {
  try {
    // Log environment variables for debugging
    console.log('Environment variables:');
    console.log(`PORT: ${process.env.PORT}`);
    console.log(`HOST: ${process.env.HOST}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || '0.0.0.0';
    const server = createServer(app);

    // Connect to the database
    await prisma.$connect();
    console.log('Connected to the database successfully');

    // Initialize WebSocket manager with Prisma
    const wsManager = new StudySessionWebSocketManager(server, prisma);

    // Initialize Reading Session Controller
    ReadingSessionController.initialize(wsManager);

    // Initialize notification service with Prisma
    NotificationService.init(prisma);

    // Start Express server
    server.listen(Number(PORT), HOST, () => {
      console.log(`Server is running on ${HOST}:${PORT}`);
      console.log(`Server is ready to accept connections`);
    });

    // Handle graceful shutdown
    setupGracefulShutdown(server);
  } catch (error) {
    console.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

function setupGracefulShutdown(server: Server) {
  // Graceful shutdown handler
  const shutdown = async () => {
    console.log('Shutting down server...');

    // Close HTTP server first (stop accepting new connections)
    server.close(() => {
      console.log('HTTP server closed');
    });

    try {
      // Shutdown notification service
      await NotificationService.shutdown();
      console.log('Notification service shut down');

      // Disconnect Prisma client
      await prisma.$disconnect();
      console.log('Database connection closed');

      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  // Listen for termination signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
