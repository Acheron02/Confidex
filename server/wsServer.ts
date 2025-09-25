import WebSocket, { WebSocketServer } from "ws";

let wss: WebSocketServer;

// Only initialize once
if (!(globalThis as any).wss) {
  wss = new WebSocketServer({ port: 8080 });
  (globalThis as any).wss = wss;

  wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected via WS");

    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });
  });
} else {
  wss = (globalThis as any).wss;
}

// Helper to broadcast to all clients
export function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

export default wss;
