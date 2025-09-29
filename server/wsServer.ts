const WebSocket = require("ws");
const { WebSocketServer } = WebSocket;

import type { WebSocket as WS, WebSocketServer as WSS } from "ws";

let wss: WSS; // ✅ Explicit type

// Only initialize once
if (!(globalThis as any).wss) {
  wss = new WebSocketServer({ port: 8080 });
  (globalThis as any).wss = wss;

  wss.on("connection", (ws: WS) => {
    console.log("Client connected via WS");

    ws.on("message", (message: Buffer) => {
      console.log("Received:", message.toString());
    });
  });
} else {
  wss = (globalThis as any).wss;
}

// Helper to broadcast to all clients
function broadcast(data: any) {
  wss.clients.forEach((client: WS) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export { wss, broadcast };
