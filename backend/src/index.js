import app from './app.js';
import { NotificationService } from './services/notifications.js';
async function startServer() {
    try {
        const PORT = process.env.PORT || 3000;
        // Initialize notification service
        await NotificationService.init();
        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        // Handle graceful shutdown
        process.on('SIGTERM', async () => {
            await NotificationService.shutdown();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
