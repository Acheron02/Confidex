"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface WSContextValue {
  ws?: WebSocket;
}

const WSContext = createContext<WSContextValue>({});

export const WSProvider = ({ children }: { children: React.ReactNode }) => {
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    if (ws) return; // already initialized

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}://${window.location.hostname}:8080`
    );

    socket.onopen = () => console.log("WS connected");
    socket.onclose = () => console.log("WS closed");
    socket.onerror = (err) => console.error("WS error:", err);

    setWs(socket);

    // optional: cleanup on unmount
    // return () => socket.close();
  }, [ws]);

  return <WSContext.Provider value={{ ws }}>{children}</WSContext.Provider>;
};

export const useWS = () => useContext(WSContext);
