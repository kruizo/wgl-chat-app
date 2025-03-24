const rooms = new Map();

function handleRoom(ws, message) {
  const data = JSON.parse(message);
  console.log(`📩 Received: ${message.toString()}`);

  if (data.type === "join") {
    if (!rooms.has(data.room)) rooms.set(data.room, new Set());

    removeClient(ws);

    rooms.get(data.room).add(ws);
    ws.room = data.room;
    ws.username = data.username;
    console.log(`👤 ${data.username} joined room: ${ws.room}`);

    broadcastUserCount(data.room);
  }

  if (data.type === "message") {
    if (rooms.has(data.room)) {
      rooms.get(data.room).forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
          console.log(`📤 ${data.sender} sent message to room: ${data.room}`);
        }
      });
    }
  }
}

function removeClient(ws) {
  if (ws.room && rooms.has(ws.room)) {
    rooms.get(ws.room).delete(ws);
    console.log(`❌ ${ws.username} left room: ${ws.room}`);

    broadcastUserCount(ws.room);

    if (rooms.get(ws.room).size === 0) {
      rooms.delete(ws.room);
    }
  }
}

function broadcastUserCount(room) {
  if (rooms.has(room)) {
    const count = rooms.get(room).size;
    rooms.get(room).forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify({ type: "user_count", room, count }));
      }
    });
  }
}

module.exports = { handleRoom, removeClient };
