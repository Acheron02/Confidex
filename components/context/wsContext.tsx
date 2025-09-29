"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface WSContextValue {
  ws?: WebSocket;
  isReady: boolean;
}

const WSContext = createContext<WSContextValue>({ isReady: false });

export const WSProvider = ({ children }: { children: React.ReactNode }) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [ws, setWs] = useState<WebSocket>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(
        process.env.NEXT_PUBLIC_WS_URL ||
          `${protocol}://${window.location.hostname}:8080`
      );

      wsRef.current = socket;
      setWs(socket);

      socket.onopen = () => {
        console.log("✅ WS connected");
        setIsReady(true);
      };

      socket.onclose = (event) => {
        console.log(
          `⚠️ WS closed (code: ${event.code}, reason: ${
            event.reason || "none"
          }) – reconnecting in 3s`
        );
        setIsReady(false);

        reconnectTimeout = setTimeout(() => {
          wsRef.current = null;
          setWs(undefined);
          connect();
        }, 3000);
      };

      socket.onerror = () => {
        // Don’t spam console on first load, only warn quietly
        if (!isReady) {
          console.warn("WS connection not ready yet, retrying…");
        } else {
          console.error("❌ WebSocket error (connection lost)");
        }
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, []);

  return (
    <WSContext.Provider value={{ ws, isReady }}>{children}</WSContext.Provider>
  );
};

// ✅ Consumer hook
export const useWS = () => useContext(WSContext);
