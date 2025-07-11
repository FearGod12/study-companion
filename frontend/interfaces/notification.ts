import { Socket } from "socket.io-client";

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

export interface SessionData {
  sessionId: string;
  duration: number;
  remainingCheckins: number;
  lastCheckIn?: Date | null;
}

export interface SocketSessionStore {
  socket: Socket | null;
  isConnected: boolean;
  activeSession: SessionData | null;
  notification: Notification | null;
  lastCheckIn: Date | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
  startSession: (duration: number) => void;
  endSession: () => void;
  sendCheckInResponse: (id: string, response: boolean) => void;
}

export interface NotificationPopupProps {
  message: string;
  onRespond: (response: boolean) => void;
  timeout?: number;
}
