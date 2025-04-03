import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ReadingSessionService } from '../services/reading-session.js';
import { StudySessionWebSocketManager } from '../services/socket.js';
import { makeResponse } from '../utils/makeResponse.js';
import prisma from '../config/prisma.js';


export class ReadingSessionController {
  private static readingSessionService: ReadingSessionService;

  static initialize(wsManager: StudySessionWebSocketManager) {
    ReadingSessionController.readingSessionService = new ReadingSessionService(prisma, wsManager);
  }

  static async startSession(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const { scheduleId } = req.params;
      const userId = req.user.id;

      if (!scheduleId) {
        res.status(400).json(makeResponse(false, 'Schedule ID is required', null));
        return;
      }

      // Call service method
      const session = await ReadingSessionController.readingSessionService.startSession(
        userId,
        scheduleId
      );
      console.log('session', session);

      

      res.status(201).json(makeResponse(true, 'study session started successfully', session));
    } catch (error: unknown) {
      next(error);
    }
  }

  static async endSession(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const { scheduleId } = req.params;
      const userId = req.user.id;

      if (!scheduleId) {
        res.status(400).json(makeResponse(false, 'Schedule ID is required', null));
        return;
      }

      // Call service method
      const session = await ReadingSessionController.readingSessionService.endSession(
        userId,
        scheduleId
      );

      res.json(makeResponse(true, 'session ended successfully', session));
    } catch (error) {
      next(error);
    }
  }

  static async checkIn(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate input
      const { scheduleId } = req.params;
      const userId = req.user.id;

      if (!scheduleId) {
        res.status(400).json(makeResponse(false, 'Schedule ID is required', null));
        return;
      }

      // Call service method
      const session = await ReadingSessionController.readingSessionService.checkIn(
        userId,
        scheduleId
      );

      res.json(makeResponse(true, 'checkin recorded', session));
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getAllSessions(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;

      // Validate and parse pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json(makeResponse(false, 'Invalid pagination parameters', null));
        return;
      }

      // Call service method
      const result = await ReadingSessionController.readingSessionService.getAllSessions(
        userId,
        page,
        limit
      );

      res.json(makeResponse(true, 'All sessions retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  static async getUserStatistics(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;

      // Call service method
      const userStats = await ReadingSessionController.readingSessionService.getUserStatistics(
        userId
      );

      res.json(makeResponse(true, 'User statistics retrieved successfully', userStats));
    } catch (error: unknown) {
      next(error);
    }
  }
}
