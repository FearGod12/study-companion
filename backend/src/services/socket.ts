import { Server as HttpServer } from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/users.js';
import { EmailSubject, sendMail } from '../utils/sendMail.js';

interface CheckInEvent {
  id: string;
  type: 'check_in_request';
  message: string;
  timestamp: number;
}

interface CheckInTimeout {
  timeoutId: NodeJS.Timeout;
  checkInId: string;
}

interface ActiveSession {
  endTime: Date;
  timeoutIds: NodeJS.Timeout[]; // Changed to array of timeouts
  lastCheckIn: Date;
  userId: string;
  sessionId: string;
  remainingCheckins: number;
  checkInTimeouts: Map<string, CheckInTimeout>;
  duration: number;
}

export class StudySessionWebSocketManager {
  private io: SocketIOServer;
  private activeSessions: Map<string, ActiveSession> = new Map();
  private userSockets: Map<string, Set<string>> = new Map();
  private readonly CHECK_IN_TIMEOUT = 120000;

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupSocketServer();
    console.log('Socket.IO server initialized');
  }

  private setupSocketServer() {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.auth.userId as string;

      if (!userId) {
        console.log('Connection rejected - no userId provided');
        socket.disconnect();
        return;
      }

      this.handleSocketConnection(socket, userId);

      // socket.on('start_session', data => this.handleStartSession(socket, userId, data));
      socket.on('end_session', data => this.handleEndSession(socket, userId, data));
      socket.on('check_in_response', data => this.handleCheckInResponse(socket, userId, data));
      socket.on('disconnect', () => this.handleDisconnect(socket, userId));
    });
  }

  private handleSocketConnection(socket: Socket, userId: string) {
    console.log(`User ${userId} connected with socket ${socket.id}`);

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socket.id);

    socket.join(userId);

    const activeSession = this.activeSessions.get(userId);
    if (activeSession && activeSession.endTime > new Date()) {
      const remainingTime = activeSession.endTime.getTime() - new Date().getTime();
      socket.emit('session_resumed', {
        sessionId: activeSession.sessionId,
        remainingTime: Math.ceil(remainingTime / 1000),
        lastCheckIn: activeSession.lastCheckIn,
        remainingCheckins: activeSession.remainingCheckins,
      });
    }
  }

  private sendCheckInRequest(userId: string) {
    const session = this.activeSessions.get(userId);
    if (!session || new Date() >= session.endTime) {
      this.stopCheckInInterval(userId);
      return;
    }

    const checkInId = uuidv4();
    const checkInEvent: CheckInEvent = {
      id: checkInId,
      type: 'check_in_request',
      message: this.getRandomCheckInMessage(),
      timestamp: Date.now(),
    };

    // Set timeout for this check-in
    const timeoutId = setTimeout(() => {
      this.handleMissedCheckIn(userId, checkInId);
    }, this.CHECK_IN_TIMEOUT);

    // Store the timeout
    session.checkInTimeouts.set(checkInId, {
      timeoutId,
      checkInId,
    });

    this.io.to(userId).emit('check_in_request', checkInEvent);
  }

  private handleCheckInResponse(
    socket: Socket,
    userId: string,
    data: { checkInId: string; response: boolean },
  ) {
    const session = this.activeSessions.get(userId);
    if (session) {
      // Clear the timeout for this check-in
      const timeout = session.checkInTimeouts.get(data.checkInId);
      if (timeout) {
        clearTimeout(timeout.timeoutId);
        session.checkInTimeouts.delete(data.checkInId);
      }

      session.lastCheckIn = new Date();
      session.remainingCheckins--;

      socket.emit('check_in_confirmed', {
        checkInId: data.checkInId,
        timestamp: session.lastCheckIn,
        remainingCheckins: session.remainingCheckins,
      });
    }
  }

  handleStartSession(userId: string, data: { duration: number }) {
    const { duration } = data;
    console.log(`Starting session for user ${userId} with duration ${duration} minutes`);

    const sessionId = uuidv4();
    const endTime = new Date(Date.now() + duration * 60000);

    // Clear any existing session
    this.stopCheckInInterval(userId);

    // Schedule 3 random check-ins
    const timeoutIds = this.scheduleRandomCheckins(userId, duration);

    this.activeSessions.set(userId, {
      endTime,
      timeoutIds,
      lastCheckIn: new Date(),
      userId,
      sessionId,
      remainingCheckins: 3,
      checkInTimeouts: new Map(),
      duration, // Store duration for email context
    });
  }

  stopCheckInInterval(userId: string) {
    const session = this.activeSessions.get(userId);
    if (session) {
      // Clear all scheduled timeouts
      session.timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));

      // Clear any pending check-in timeouts
      session.checkInTimeouts.forEach(timeout => clearTimeout(timeout.timeoutId));

      this.activeSessions.delete(userId);
      this.io.to(userId).emit('session_ended', { sessionId: session.sessionId });
    }
  }

  private async handleMissedCheckIn(userId: string, checkInId: string) {
    const session = this.activeSessions.get(userId);
    if (!session) return;

    // Clear the timeout record
    session.checkInTimeouts.delete(checkInId);

    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Send email using your existing utility
      sendMail(EmailSubject.StudySessionReminder, 'missed-checkin', {
        user,
        sessionData: {
          startTime: new Date(session.endTime.getTime() - session.duration * 60000),
          endTime: session.endTime,
          remainingCheckins: session.remainingCheckins,
        },
      });

      // Emit event to frontend about missed check-in
      this.io.to(userId).emit('check_in_missed', {
        checkInId,
        message: "You missed a study check-in. We've sent you an email with some encouragement!",
      });
    } catch (error) {
      console.error('Failed to handle missed check-in:', error);
    }
  }
  private scheduleRandomCheckins(userId: string, durationMinutes: number): NodeJS.Timeout[] {
    const durationMs = durationMinutes * 60000;
    const timeoutIds: NodeJS.Timeout[] = [];

    // Create three non-overlapping time windows
    const windowSize = Math.floor(durationMs / 3);

    // Schedule one check-in for each third of the session
    for (let i = 0; i < 3; i++) {
      const windowStart = i * windowSize;
      const windowEnd = (i + 1) * windowSize;

      // Random time within the window
      const checkInTime = Math.floor(Math.random() * (windowEnd - windowStart)) + windowStart;

      const timeoutId = setTimeout(() => {
        this.sendCheckInRequest(userId);
      }, checkInTime);

      timeoutIds.push(timeoutId);
    }

    return timeoutIds;
  }

  private handleEndSession(socket: Socket, userId: string, data: { sessionId: string }) {
    const activeSession = this.activeSessions.get(userId);
    if (activeSession && activeSession.sessionId === data.sessionId) {
      this.stopCheckInInterval(userId);
      socket.emit('session_ended', { sessionId: data.sessionId });
    }
  }

  private handleDisconnect(socket: Socket, userId: string) {
    console.log(`User ${userId} disconnected from socket ${socket.id}`);

    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  private getRandomCheckInMessage(): string {
    const messages = [
      'Are you still studying? Quick check-in!',
      "How's your progress? Tap to confirm.",
      'Time for a quick study check! Still focused?',
      'Quick check: Still on track with your studies?',
      'Maintain your study streak! Tap to confirm.',
      'Study check: Stay motivated!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Public methods for external use
  public isSessionActive(userId: string): boolean {
    const session = this.activeSessions.get(userId);
    return !!session && session.endTime > new Date();
  }

  public getLastCheckInTime(userId: string): Date | undefined {
    return this.activeSessions.get(userId)?.lastCheckIn;
  }

  public getUserActiveSessions(): { userId: string; endTime: Date }[] {
    return Array.from(this.activeSessions.values()).map(session => ({
      userId: session.userId,
      endTime: session.endTime,
    }));
  }
}
