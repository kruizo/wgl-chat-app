import { useCallback, useEffect, useRef, useState } from "react";
import { Message, Server } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface UseWebSocketProps {
  username: string | null;
}

export function useWebSocket({ username }: UseWebSocketProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const [rooms, setRooms] = useState<Server[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Server | null>(null);
  const previousRoom = useRef<string | null>(null);

  useEffect(() => {
    const fetchRoomsAndConnect = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rooms");
        const data = await res.json();

        if (data.length > 0) {
          setRooms(data);
          setCurrentRoom(data[0]);

          ws.current = new WebSocket("ws://localhost:5001");

          ws.current.onopen = () => {
            console.log("✅ Connected to WebSocket");
            joinRoom(data[0].id);
          };

          ws.current.onmessage = (msg) => {
            const receivedMessage = JSON.parse(msg.data);

            if (receivedMessage.type === "message") {
              setMessages((prev) => [...prev, receivedMessage]);
              console.log(`📩 Received message: ${receivedMessage.content}`);
            }
            if (receivedMessage.user_count) {
              setCurrentRoom((prev) =>
                prev ? { ...prev, userCount: receivedMessage.user_count } : prev
              );
            }
          };

          ws.current.onclose = () => {
            console.log("❌ Disconnected from WebSocket");
          };
        }
      } catch (error) {
        console.error("❌ Failed to fetch rooms or connect:", error);
      }
    };

    fetchRoomsAndConnect();

    return () => {
      ws.current?.close();
      ws.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const changeRoom = useCallback((room: Server) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    if (previousRoom.current === room.id) {
      console.log(`🔄 Already in room: ${room.id}, no need to switch.`);
      return;
    }

    if (previousRoom.current && previousRoom.current !== room.id) {
      leaveRoom(previousRoom.current);
    }

    joinRoom(room.id);
    previousRoom.current = room.id;
    setMessages([]);
    setCurrentRoom(room);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinRoom = (roomId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "join", room: roomId, username }));
      console.log(`🚪 Joined room: ${roomId}`);
      previousRoom.current = roomId;
    }
  };

  const leaveRoom = (roomId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "leave", room: roomId, username })
      );
      console.log(`🚪 Left room: ${roomId}`);
      previousRoom.current = null;
    }
  };

  const sendMessage = (message: string) => {
    if (!message.trim() || !username || !currentRoom) return;

    const messageData = {
      id: uuidv4(),
      type: "message",
      room: currentRoom.id,
      sender: username,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    ws.current?.send(JSON.stringify(messageData));
  };

  return { messages, sendMessage, currentRoom, changeRoom, rooms };
}
