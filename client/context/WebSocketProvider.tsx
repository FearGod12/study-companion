import PropTypes from "prop-types";
import { useCallback, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { NotificationPopup } from "../components/notifications/NotificationPopup";
import { useAuth } from "../hooks/useAuthSignup";
import { SocketContext } from "./WebSocketContext";

export const WebSocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!user?._id) return;

    const connectSocket = () => {
      const socketIO = io(
        import.meta.env.VITE_WS_URL || "http://localhost:3000",
        {
          auth: { userId: user._id },
          reconnection: true,
          reconnectionAttempts: maxReconnectAttempts,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          transports: ["websocket", "polling"],
        }
      );

      setupSocketListeners(socketIO);
      setSocket(socketIO);
      return socketIO;
    };

    const socketIO = connectSocket();

    return () => {
      socketIO.disconnect();
      setSocket(null);
      setIsConnected(false);
      setActiveSession(null);
      setNotification(null);
    };
  }, [user?._id]);

  const setupSocketListeners = useCallback((socketIO) => {
    socketIO.on("connect", () => {
      console.log("Connected to study session server");
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    socketIO.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      setIsConnected(false);

      if (reason === "io server disconnect") {
        // Server disconnected us, try to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          socketIO.connect();
        }
      }
    });

    socketIO.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    socketIO.on("session_started", (data) => {
      console.log("Study session started:", data);
      setActiveSession(data);
      setLastCheckIn(new Date());
      setNotification(null); // Clear any existing notifications
    });

    socketIO.on("session_resumed", (data) => {
      console.log("Study session resumed:", data);
      setActiveSession({
        sessionId: data.sessionId,
        duration: Math.ceil(data.remainingTime / 60),
        remainingCheckins: data.remainingCheckins,
      });
      setLastCheckIn(data.lastCheckIn ? new Date(data.lastCheckIn) : null);
    });

    socketIO.on("session_ended", (data) => {
      console.log("Study session ended:", data);
      setActiveSession(null);
      setLastCheckIn(null);
      setNotification(null);
    });

    socketIO.on("check_in_request", (data) => {
      console.log("Check-in request received:", data);
      // Clear any existing notification before showing new one
      setNotification(null);
      setTimeout(() => {
        setNotification({
          id: data.id,
          message: data.message,
          timestamp: data.timestamp,
        });
      }, 100);
    });

    socketIO.on("check_in_confirmed", (data) => {
      console.log("Check-in confirmed:", data);
      setLastCheckIn(new Date(data.timestamp));
      if (activeSession) {
        setActiveSession((prev) => ({
          ...prev,
          remainingCheckins: data.remainingCheckins,
        }));
      }
    });
  }, []);

  const startSession = useCallback(
    (duration) => {
      if (!socket?.connected) {
        console.error("Socket not connected");
        return false;
      }
      socket.emit("start_session", { duration });
      return true;
    },
    [socket]
  );

  const endSession = useCallback(() => {
    if (!socket?.connected || !activeSession) {
      console.error(
        "Cannot end session: socket disconnected or no active session"
      );
      return false;
    }
    socket.emit("end_session", { sessionId: activeSession.sessionId });
    return true;
  }, [socket, activeSession]);

  const sendCheckInResponse = useCallback(
    (checkInId, response) => {
      if (!socket?.connected) {
        console.error("Cannot send check-in: socket disconnected");
        return false;
      }
      socket.emit("check_in_response", { checkInId, response });
      setNotification(null);
      return true;
    },
    [socket]
  );

  const value = {
    isConnected,
    activeSession,
    lastCheckIn,
    startSession,
    endSession,
    sendCheckInResponse,
    remainingCheckins: activeSession?.remainingCheckins,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
      {notification && (
        <NotificationPopup
          message={notification.message}
          onRespond={(response) =>
            sendCheckInResponse(notification.id, response)
          }
          timeout={120} // 2 minutes timeout
        />
      )}
    </SocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
