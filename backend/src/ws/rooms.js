const rooms = new Map(); // Room storage (roomName -> Set of clients)

function handleRoom(ws, message) {
  const data = JSON.parse(message); // Parse the JSON string into an object
  console.log(`📩 Received: ${message.toString()}`);

  if (data.type === "join") {
    if (!rooms.has(data.room)) rooms.set(data.room, new Set());
    // Remove the user from any existing
    //  room before adding to new one
    removeClient(ws);

    rooms.get(data.room).add(ws);
    ws.room = data.room;
    ws.username = data.username;
    console.log(`👤 ${data.username} joined room: ${ws.room}`);

    // Notify room members of updated user count
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

    // Notify room members of updated user count
    broadcastUserCount(ws.room);

    // Remove empty rooms
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
