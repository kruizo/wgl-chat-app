const rooms = new Map();
const wsData = new Map();
const broadcastQueue = new Map();

function handleRoom(ws, data) {
  console.log(`📩 Received: ${data.toString()}`);

  if (!rooms.has(data.room)) rooms.set(data.room, new Set());

  removeClient(ws);

  const roomSet = rooms.get(data.room);

  if (!roomSet.has(ws)) {
    roomSet.add(ws);
    wsData.set(ws, { room: data.room, username: data.username });
    console.log(`👤 ${data.username} joined room: ${data.room}`);

    broadcastEventInRoom(data.room, {
      type: "join",
      username: data.username,
      room: data.room,
    });

    broadcastUserCount(data.room);
  }
}

// ✅ Handle Message Broadcasting
function handleMessage(data) {
  broadcastEventInRoom(data.room, data);
}

// ✅ Remove Client from Room
function removeClient(ws) {
  const clientData = wsData.get(ws);

  if (clientData && clientData.room && rooms.has(clientData.room)) {
    const roomSet = rooms.get(clientData.room);
    roomSet.delete(ws);
    console.log(`❌ ${clientData.username} left room: ${clientData.room}`);

    // Broadcast leave event
    broadcastEventInRoom(clientData.room, {
      type: "leave",
      username: clientData.username,
      room: clientData.room,
    });

    broadcastUserCount(clientData.room);

    if (roomSet.size === 0) {
      rooms.delete(clientData.room);
    }
  }

  wsData.delete(ws);
}

function broadcastUserCount(room) {
  if (broadcastQueue.has(room)) {
    clearTimeout(broadcastQueue.get(room));
  }

  broadcastQueue.set(
    room,
    setTimeout(() => {
      if (rooms.has(room)) {
        const count = rooms.get(room).size;
        rooms.get(room).forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: "user_count", room, count }));
          }
        });
      }
      broadcastQueue.delete(room);
    }, 100)
  );
}

module.exports = {
  handleRoom,
  removeClient,
  handleMessage,
};
