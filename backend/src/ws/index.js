const { WebSocketServer } = require("ws");
const { createServer } = require("http");
// const { handleRoom, removeClient, handleMessage } = require("./rooms");
const { handleSocketEvent, handleClientLeave } = require("./handler.ts");

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log("✅ Client connected to WebSocket server");

  ws.on("message", (msg) => {
    console.log("Received from WS client: ", msg.toString());

    handleSocketEvent(ws, msg);
  });

  ws.on("close", () => handleClientLeave(ws));
});

const PORT = process.env.WS_PORT || 5001;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket Server running on port ${PORT}`);
});
