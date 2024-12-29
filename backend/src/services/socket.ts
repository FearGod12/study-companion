import { Server as HttpServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';

interface CheckInEvent {
  id: string;
  type: 'check_in_request';
  message: string;
  timestamp: number;
}

export class StudySessionWebSocketManager {
  private wss: WebSocketServer;
  private activeConnections: Map<string, WebSocket> = new Map();
  private sessionCheckIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(server: HttpServer) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
    console.log('socket server started');
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws, req) => {
      const userId = this.extractUserIdFromRequest(req);

      if (!userId) {
        ws.close();
        return;
      }

      this.activeConnections.set(userId, ws);

      ws.on('message', message => {
        this.handleIncomingMessage(userId, message.toString());
      });

      ws.on('close', () => {
        this.activeConnections.delete(userId);
        this.stopCheckInInterval(userId);
      });
    });
  }

  private extractUserIdFromRequest(req: any): string | null {
    // Implement your authentication logic here
    // This could involve checking authentication tokens, session, etc.
    // For this example, we'll assume the user ID is passed in the query
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('userId');
  }

  public startStudySessionCheckIns(userId: string, sessionDuration: number) {
    // Stop any existing interval for this user
    this.stopCheckInInterval(userId);

    const ws = this.activeConnections.get(userId);
    if (!ws) return;

    // Calculate a random interval strategy
    const checkInStrategy = this.generateCheckInStrategy(sessionDuration);

    const intervalId = setInterval(() => {
      if (!this.activeConnections.has(userId)) {
        this.stopCheckInInterval(userId);
        return;
      }

      const checkInEvent: CheckInEvent = {
        id: uuidv4(),
        type: 'check_in_request',
        message: this.getRandomCheckInMessage(),
        timestamp: Date.now(),
      };

      ws.send(JSON.stringify(checkInEvent));
    }, checkInStrategy.interval);

    this.sessionCheckIntervals.set(userId, intervalId);
  }

  private generateCheckInStrategy(sessionDuration: number) {
    // Intelligent check-in interval generation
    // More check-ins for shorter sessions, fewer for longer sessions
    const baseInterval = 5 * 60 * 1000; // 5 minutes
    const jitterFactor = 0.3; // 30% randomness

    // Adjust interval based on session duration
    const interval = Math.max(
      3 * 60 * 1000, // Minimum 3 minutes between check-ins
      Math.min(
        baseInterval * (sessionDuration / 30), // Proportional to session length
        15 * 60 * 1000, // Maximum 15 minutes between check-ins
      ),
    );

    // Add some randomness to make check-ins unpredictable
    const randomizedInterval = interval * (1 + (Math.random() * 2 - 1) * jitterFactor);

    return {
      interval: Math.round(randomizedInterval),
      jitter: jitterFactor,
    };
  }

  private getRandomCheckInMessage(): string {
    const messages = [
      'Are you still focused?',
      "How's your study session going?",
      'Take a moment to check your progress',
      'Staying on track?',
      'Quick wellness check',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private handleIncomingMessage(userId: string, message: string) {
    try {
      const parsedMessage = JSON.parse(message);

      // If it's a check-in response, you might want to log or process it
      if (parsedMessage.type === 'check_in_response') {
        // Potentially update last check-in time in your reading session model
        // You could emit an event or call a method in your ReadingSessionController
      }
    } catch (error) {
      console.error('Invalid message format', error);
    }
  }

  private stopCheckInInterval(userId: string) {
    const intervalId = this.sessionCheckIntervals.get(userId);
    if (intervalId) {
      clearInterval(intervalId);
      this.sessionCheckIntervals.delete(userId);
    }
  }

  // Method to integrate with your existing startSession method
  public attachToReadingSessionStart(userId: string, sessionDuration: number) {
    this.startStudySessionCheckIns(userId, sessionDuration);
  }
}
