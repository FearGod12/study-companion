import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { NotificationPopup } from '../components/notifications/NotificationPopup';
import { WebSocketContext } from './WebSocketContext';

export const WebSocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {

    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}?userId=${userId}`);

    ws.onopen = () => {
      console.log('Connected to study session server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'check_in_request') {
        setNotification({
          id: data.id,
          message: data.message,
          timestamp: data.timestamp
        });

        setTimeout(() => {
          setNotification(prev => {
            if (prev?.id === data.id) return null;
            return prev;
          });
        }, 120000);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from study session server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendResponse = (checkInId, response) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'check_in_response',
        checkInId: checkInId,
        response: response,
        responseTime: Date.now() - notification.timestamp
      }));
      setNotification(null);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, notification, sendResponse }}>
      {children}
      {notification && <NotificationPopup
        message={notification.message}
        onRespond={(response) => sendResponse(notification.id, response)}
      />}
    </WebSocketContext.Provider>
  );
};


WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  userId: PropTypes.string.isRequired,
};
