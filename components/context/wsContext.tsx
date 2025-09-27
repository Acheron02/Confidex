"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface WSContextValue {
  ws?: WebSocket;
}

const WSContext = createContext<WSContextValue>({});

export const WSProvider = ({ children }: { children: React.ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(
        `${protocol}://${window.location.hostname}:8080`
      );

      wsRef.current = socket;
      setWs(socket);

      socket.onopen = () => console.log("WS connected");
      socket.onclose = () => {
        console.log("WS closed – reconnecting in 3s");
        reconnectTimeout = setTimeout(() => {
          wsRef.current = null;
          setWs(undefined);
          connect(); // reconnect automatically
        }, 3000);
      };
      socket.onerror = (err) => {
        console.error("WS error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, []);

  return <WSContext.Provider value={{ ws }}>{children}</WSContext.Provider>;
};

// ✅ Returns undefined if WebSocket not ready yet
export const useWS = (): WebSocket | undefined => {
  const context = useContext(WSContext);
  return context.ws;
};
