const { WebSocketServer } = require("ws");
const { createServer } = require("http");
const { handleRoom, removeClient, getRooms } = require("./rooms");

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log("✅ Client connected to WebSocket server");
  ws.on("message", (msg) => {
    handleRoom(ws, msg.toString());
  });

  ws.on("close", () => removeClient(ws));
});

const PORT = process.env.WS_PORT || 5001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
});
