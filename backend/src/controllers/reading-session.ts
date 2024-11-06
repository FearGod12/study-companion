import { Response } from 'express';
import { ReadingSession } from '../models/reading-session.js';
import { Schedule } from '../models/schedule.js';

export class ReadingSessionController {
  // Start a reading session
  static async startSession(req: any, res: Response): Promise<void> {
    try {
      const { scheduleId } = req.body;

      // Verify schedule exists and belongs to user
      const schedule = await Schedule.findOne({
        _id: scheduleId,
        userId: req.user._id,
        isActive: true,
      });

      if (!schedule) {
        res.status(404).json({ error: 'Schedule not found' });
        return;
      }

      // Check for any active sessions
      const activeSession = await ReadingSession.findOne({
        userId: req.user._id,
        status: 'active',
      });

      if (activeSession) {
        res.status(400).json({ error: 'Another session is already active' });
        return;
      }

      const session = new ReadingSession({
        userId: req.user._id,
        scheduleId,
        startTime: new Date(),
        lastCheckIn: new Date(),
      });

      await session.save();
      res.status(201).json(session);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unknown error occurred' });
      }
    }
  }

  // Check-in for an active session
  static async checkIn(req: any, res: Response): Promise<void> {
    try {
      const session = await ReadingSession.findOneAndUpdate(
        {
          userId: req.user._id,
          status: 'active',
        },
        {
          lastCheckIn: new Date(),
        },
        { new: true },
      );

      if (!session) {
        res.status(404).json({ error: 'No active session found' });
        return;
      }

      res.json(session);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  // End a reading session
  static async endSession(req: any, res: Response): Promise<void> {
    try {
      const session = await ReadingSession.findOne({
        userId: req.user._id,
        status: 'active',
      });

      if (!session) {
        res.status(404).json({ error: 'No active session found' });
        return;
      }

      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - session.startTime.getTime()) / 60000); // Convert to minutes

      session.endTime = endTime;
      session.duration = duration;
      session.status = 'completed';
      await session.save();

      res.json(session);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
}
