export interface StudySession {
  id: string;
  title: string;
  status: string;
  startTime: string;
  duration: number;
}

export interface StudyStatistics {
  totalMinutesStudied: number;
  totalSessionsCompleted: number;
  longestSessionDuration: number;
  averageSessionDuration: number;
  currentStreak: number;
  longestStreak: number;
}

export interface StudySessionData {
  scheduleId: string;
  id: string;
  startTime: string;
  endTime: string;
  lastCheckIn: string;
  duration: number;
  status: "active" | "completed" | "paused";
}

export interface SessionStore {
  studySessions: StudySession[];
  statistics: StudyStatistics | null;
  currentSession: StudySessionData | null;
  loading: boolean;
  error: string | null;
  startSession: (scheduleId: string) => Promise<void>;
  endSession: (scheduleId: string) => Promise<void>;
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  fetchStatistics: () => Promise<void>;
}
