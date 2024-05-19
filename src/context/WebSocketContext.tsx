import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { getEmail } from './AuthContext';

export const WebSocketContext = createContext<WebSocket | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const establishWebSocketConnection = async () => {
      const email = await getEmail();
      if (email) {
        ws.current = new WebSocket('ws://localhost:3000');

        ws.current.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.current.onclose = () => {
          console.log('WebSocket disconnected');
        };

        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          // Handle received data
          console.log('Received:', data);
        };
      }
    };

    establishWebSocketConnection();

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
