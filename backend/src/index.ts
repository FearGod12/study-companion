import { createServer } from 'http';
import app from './app.js';
import { NotificationService } from './services/notifications.js';
import { StudySessionWebSocketManager } from './services/socket.js';
import { ReadingSessionController } from './controllers/reading-session.js';

async function startServer() {
  try {
    const PORT = process.env.PORT || 3000;
    const server = createServer(app);
    const wsManager = new StudySessionWebSocketManager(server);
    ReadingSessionController.initialize(wsManager);

    // Initialize notification service
    await NotificationService.init();

    // Start Express server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      await NotificationService.shutdown();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
