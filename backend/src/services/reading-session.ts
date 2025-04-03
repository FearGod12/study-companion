import { PrismaClient, ReadingSession, Schedule, SessionStatus } from '@prisma/client';
import { StudySessionWebSocketManager } from '../services/socket.js';
import { NotificationService } from '../services/notifications.js';
import { CustomError } from '../utils/customError.js';

export class ReadingSessionService {
  private prisma: PrismaClient;
  private wsManager: StudySessionWebSocketManager;

  constructor(prisma: PrismaClient, wsManager: StudySessionWebSocketManager) {
    this.prisma = prisma;
    this.wsManager = wsManager;
  }
  static convertToNigeriaTimezone(date: Date): Date {
    return new Date(date.getTime() + 1 * 60 * 60 * 1000);
  }
  async startSession(userId: string, scheduleId: string): Promise<ReadingSession> {
    // Verify schedule exists and belongs to user
    const schedule = await this.prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        userId: userId,
        isActive: true,
      },
    });

    if (!schedule) {
      throw new CustomError(404, 'Schedule not found');
    }

    // Check for any active sessions
    const activeSession = await this.prisma.readingSession.findFirst({
      where: {
        userId: userId,
        status: SessionStatus.ACTIVE,
      },
    });

    if (activeSession) {
      if (activeSession.scheduleId === scheduleId) {
        // If there's an active WebSocket session, include the remaining check-ins
        const wsSession = this.wsManager.isSessionActive(userId);
        if (wsSession) {
          return {
            ...activeSession,
            lastCheckIn: this.wsManager.getLastCheckInTime(userId) || activeSession.lastCheckIn,
          };
        }
      }

      const activeSessionEndTime = new Date(
        activeSession.startTime.getTime() + activeSession.duration * 60000
      );

      if (activeSessionEndTime < new Date()) {
        // Mark expired session as completed
        await this.prisma.schedule.update({
          where: { id: activeSession.scheduleId },
          data: { isActive: false },
        });

        await this.prisma.readingSession.update({
          where: { id: activeSession.id },
          data: { status: SessionStatus.COMPLETED },
        });

        this.wsManager.stopCheckInInterval(userId);
      } else {
        throw new CustomError(409, 'Another session is currently active');
      }
    }

    // Create new reading session
    const session = await this.prisma.readingSession.create({
      data: {
        userId: userId,
        scheduleId: scheduleId,
        startTime: new Date(),
        lastCheckIn: new Date(),
        duration: schedule.duration,
        status: SessionStatus.ACTIVE,
      },
    });

    // Start socket session with check-ins
    this.wsManager.handleStartSession(userId, {
      duration: schedule.duration,
    });

    // Cancel all scheduled notifications for this schedule
    NotificationService.cancelNotifications(scheduleId);

    // Schedule automatic session end
    this.scheduleSessionEnd(session.id, userId, scheduleId, schedule.duration);

    return session;
  }

  private scheduleSessionEnd(
    sessionId: string,
    userId: string,
    scheduleId: string,
    durationMinutes: number
  ): void {
    setTimeout(async () => {
      try {
        const activeSession = await this.prisma.readingSession.findFirst({
          where: {
            id: sessionId,
            status: SessionStatus.ACTIVE,
          },
        });

        if (activeSession) {
          await this.prisma.readingSession.update({
            where: { id: sessionId },
            data: { status: SessionStatus.COMPLETED },
          });

          await this.prisma.schedule.update({
            where: { id: scheduleId },
            data: { isActive: false },
          });

          // Stop WebSocket check-ins when session expires
          this.wsManager.stopCheckInInterval(userId);
        }
      } catch (error) {
        console.error('Error auto-ending session:', error);
      }
    }, durationMinutes * 60000);
  }

  async endSession(userId: string, scheduleId: string): Promise<ReadingSession> {
    const schedule = await this.prisma.schedule.findFirst({
      where: {
        id: scheduleId,
        userId: userId,
        isActive: true,
      },
    });

    if (!schedule) {
      throw new CustomError(404, 'Schedule not found');
    }

    const session = await this.prisma.readingSession.findFirst({
      where: {
        userId: userId,
        status: SessionStatus.ACTIVE,
        scheduleId: scheduleId,
      },
    });

    if (!session) {
      throw new CustomError(404, 'No active session found');
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 60000);

    const updatedSession = await this.prisma.readingSession.update({
      where: { id: session.id },
      data: {
        endTime: endTime,
        duration: duration,
        status: SessionStatus.COMPLETED,
      },
    });

    await this.prisma.schedule.update({
      where: { id: scheduleId },
      data: { isActive: false },
    });

    // Stop WebSocket check-ins
    this.wsManager.stopCheckInInterval(userId);

    return updatedSession;
  }

  async checkIn(userId: string, scheduleId: string): Promise<any> {
    // find it first if the user has an active session
    let session = await this.prisma.readingSession.findFirst({
      where: {
        userId: userId,
        status: SessionStatus.ACTIVE,
        scheduleId: scheduleId,
      },
    });

    if (!session) {
      throw new CustomError(404, 'No active session found');
    }

    // update the last check in time
    session = await this.prisma.readingSession.update({
      where: { id: session.id },
      data: { lastCheckIn: new Date() },
    });

    // Get the remaining check-ins from the WebSocket manager
    const wsActive = this.wsManager.isSessionActive(userId);
    const lastCheckIn = this.wsManager.getLastCheckInTime(userId);

    if (!wsActive) {
      throw new CustomError(400, 'session not active');
    }

    return {
      ...session,
      lastCheckIn,
    };
  }

  async getAllSessions(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    const skip = (page - 1) * limit;

    const sessions = await this.prisma.readingSession.findMany({
      where: { userId },
      skip: skip,
      take: limit,
      orderBy: { startTime: 'desc' },
    });

    const total = await this.prisma.readingSession.count({
      where: { userId },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      sessions: sessions.map(session => ({
        ...session,
        startTime: session.startTime
          ? ReadingSessionService.convertToNigeriaTimezone(session.startTime)
          : null,
        endTime: session.endTime
          ? ReadingSessionService.convertToNigeriaTimezone(session.endTime)
          : null,
        lastCheckIn: session.lastCheckIn
          ? ReadingSessionService.convertToNigeriaTimezone(session.lastCheckIn)
          : null,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getUserStatistics(userId: string): Promise<any> {
    // Get completed sessions
    const completedSessions = await this.prisma.readingSession.findMany({
      where: {
        userId: userId,
        status: SessionStatus.COMPLETED,
      },
    });

    // Calculate basic statistics
    const totalMinutesStudied = completedSessions.reduce(
      (sum, session) => sum + session.duration,
      0
    );
    const totalSessionsCompleted = completedSessions.length;

    let longestSessionDuration = 0;
    let totalDuration = 0;

    completedSessions.forEach(session => {
      if (session.duration > longestSessionDuration) {
        longestSessionDuration = session.duration;
      }
      totalDuration += session.duration;
    });

    const averageSessionDuration =
      totalSessionsCompleted > 0 ? totalDuration / totalSessionsCompleted : 0;

    // Calculate streak information (consecutive days with at least one completed session)
    const sessionDates = new Set<string>();

    completedSessions.forEach(session => {
      const dateStr = session.startTime.toISOString().split('T')[0];
      sessionDates.add(dateStr);
    });

    // Convert to array and sort
    const sortedDates = Array.from(sessionDates).sort();

    // Calculate current and longest streak
    let currentStreak = 0;
    let longestStreak = 0;
    let previousDate: string | null = null;

    sortedDates.forEach(dateStr => {
      if (previousDate === null) {
        // First day
        currentStreak = 1;
        longestStreak = 1;
        previousDate = dateStr;
        return;
      }

      // Check if the current day is exactly one day after the previous day
      const prevDate = new Date(previousDate);
      const currentDate = new Date(dateStr);
      const dayDifference = Math.floor(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24)
      );

      if (dayDifference === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (dayDifference > 1) {
        currentStreak = 1;
      }

      previousDate = dateStr;
    });

    // Prepare the response
    return {
      totalMinutesStudied,
      totalSessionsCompleted,
      longestSessionDuration,
      averageSessionDuration,
      currentStreak,
      longestStreak,
    };
  }
}
