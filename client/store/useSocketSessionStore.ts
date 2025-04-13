// store/useSessionStore.ts
import { create } from "zustand";
import { io } from "socket.io-client";
import { SocketSessionStore } from "@/interfaces/interface";

export const useSocketSessionStore = create<SocketSessionStore>((set, get) => ({
  socket: null,
  isConnected: false,
  activeSession: null,
  notification: null,
  lastCheckIn: null,

  connectSocket: (userId) => {
    const existingSocket = get().socket;

    if (existingSocket && existingSocket.connected) {
      console.log("Socket already connected. Skipping reconnection.");
      return;
    }
    
    const socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000", {
      auth: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("Socket connected");
    });

    socket.on("disconnect", (reason) => {
      set({ isConnected: false });
      console.log("Socket disconnected:", reason);
    });

    socket.on("session_started", (data) => {
      console.log("Session started:", data);
      set({
        activeSession: data,
        lastCheckIn: new Date(),
        notification: null,
      });
    });

    socket.on("session_resumed", (data) => {
      console.log("Session resumed:", data);
      set({
        activeSession: {
          sessionId: data.sessionId,
          duration: Math.ceil(data.remainingTime / 60),
          remainingCheckins: data.remainingCheckins,
        },
        lastCheckIn: data.lastCheckIn ? new Date(data.lastCheckIn) : null,
      });
    });

    socket.on("session_ended", () => {
      console.log("Session ended");
      set({
        activeSession: null,
        lastCheckIn: null,
        notification: null,
      });
    });

    socket.on("check_in_request", (data) => {
      console.log("Check-in request:", data);
      set({ notification: null });
      setTimeout(() => {
        set({
          notification: {
            id: data.id,
            message: data.message,
            timestamp: data.timestamp,
          },
        });
      }, 100);
    });

    socket.on("check_in_confirmed", (data) => {
      set({ lastCheckIn: new Date(data.timestamp) });
      set((state) => ({
        activeSession: state.activeSession
          ? {
              ...state.activeSession,
              remainingCheckins: data.remainingCheckins,
            }
          : null,
      }));
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    socket?.disconnect();
    set({
      socket: null,
      isConnected: false,
      activeSession: null,
      notification: null,
    });
  },

  startSession: (duration) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("start_session", { duration });
    } else {
      console.error("Socket not connected");
    }
  },

  endSession: () => {
    const socket = get().socket;
    const sessionId = get().activeSession?.sessionId;
    if (socket?.connected && sessionId) {
      socket.emit("end_session", { sessionId });
    } else {
      console.error("Cannot end session");
    }
  },

  sendCheckInResponse: (id, response) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit("check_in_response", { checkInId: id, response });
      set({ notification: null });
    } else {
      console.error("Cannot send check-in response: Socket disconnected");
    }
  },
}));
