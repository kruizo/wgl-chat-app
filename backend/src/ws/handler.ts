// const { handleRoom, removeClient, handleMessage } = require("./rooms");
const rooms = new Map();
const wsData = new Map();
const sessionMap = new Map(); // sessionId -> ws
const broadcastQueue = new Map();

const handleSocketEvent = (ws, event) => {
  try {
    console.log(`📩 Received: ${event.toString()}`);

    const socketMessage = JSON.parse(event.toString());

    if (socketMessage == null) {
      console.error("❌ Invalid message");
      return;
    }
    if (!socketMessage.type) {
      console.error("❌ Message type is missing");
      return;
    }

    switch (socketMessage.type) {
      case "join":
        handleClientJoin(ws, socketMessage);
        break;
      case "leave":
        handleClientLeave(ws);
        break;
      case "message":
        processMessage(socketMessage);
        break;
      default:
        console.error(`❌ Unknown message type: ${socketMessage.type}`);
    }
  } catch (error) {
    console.error("❌ Error parsing message:", error);
  }
};

function handleClientJoin(ws, message) {
  if (!rooms.has(message.room)) rooms.set(message.room, new Set());

  if (message.sessionId && sessionMap.has(message.sessionId)) {
    console.log(`🔁 Duplicate session. Closing previous connection.`);
    const existingWs = sessionMap.get(message.sessionId);
    if (existingWs && existingWs !== ws) {
      existingWs.close();
    }
  }

  handleClientLeave(ws);

  const roomSet = rooms.get(message.room);

  if (!roomSet.has(ws)) {
    roomSet.add(ws);
    wsData.set(ws, {
      room: message.room,
      username: message.username,
      sessionId: message.sessionId,
    });
    sessionMap.set(message.sessionId, ws);
    console.log(`👤 ${message.username} joined room: ${message.room}`);

    broadcastEventInRoom(
      message.room,
      {
        type: message.type,
        username: message.username,
        room: message.room,
      },
      true
    );
  }
}

function processMessage(message) {
  if (!message.content || typeof message.content !== "string") {
    console.error("❌ Invalid message content");
    return;
  }

  broadcastEventInRoom(message.room, message, false);
}

function handleClientLeave(ws) {
  let client = wsData.get(ws);

  if (client && client.room && rooms.has(client.room)) {
    const roomSet = rooms.get(client.room);
    roomSet.delete(ws);
    console.log(`❌ ${client.username} left room: ${client.room}`);

    broadcastEventInRoom(
      client.room,
      {
        type: client.type,
        username: client.username,
        room: client.room,
      },
      true
    );

    if (roomSet.size === 0) {
      rooms.delete(client.room);
    }
  }

  wsData.delete(ws);
}
function broadcastEventInRoom(room, event, includeCount = false) {
  if (rooms.has(room)) {
    const roomSet = rooms.get(room);

    const updatedEvent = includeCount
      ? {
          ...event,
          user_count: roomSet.size,
        }
      : event;

    roomSet.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(updatedEvent));
      }
    });
  }
}

module.exports = {
  handleSocketEvent,
  handleClientLeave,
};
