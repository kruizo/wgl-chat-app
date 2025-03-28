import { useCallback, useEffect, useRef, useState } from "react";
import { Message, Server } from "@/types";
import { v4 as uuidv4 } from "uuid";
import "@/types/global.d.ts";

interface UseWebSocketProps {
  username: string | null;
  sessionId: string | null;
}

export function useWebSocket({ username, sessionId }: UseWebSocketProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const [rooms, setRooms] = useState<Server[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Server | null>(null);
  const previousRoom = useRef<string | null>(null);

  // Message queue and sending status
  const messageQueue = useRef<string[]>([]);
  const isSending = useRef(false);

  useEffect(() => {
    if (!username || !sessionId) return; // Skip if username/sessionId not set

    const fetchRoomsAndConnect = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/rooms");
        const data = await res.json();

        if (data.length > 0) {
          setRooms(data);
          setCurrentRoom(data[0]);

          console.log("🔌 Creating WebSocket connection...");
          ws.current = new WebSocket("ws://localhost:5001");

          ws.current.onopen = () => {
            console.log("✅ Connected to WebSocket");
            joinRoom(data[0].id);
          };

          ws.current.onmessage = (msg) => {
            const receivedMessage = JSON.parse(msg.data);

            setMessages((prev) => {
              if (
                receivedMessage.type === "message" &&
                !prev.some((m) => m.id === receivedMessage.id)
              ) {
                console.log(`📩 Received message: ${receivedMessage.content}`);
                return [...prev, receivedMessage];
              }
              return prev; // Avoid adding duplicate messages
            });

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
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log("🔌 Closing WebSocket connection");
        ws.current.close();
        ws.current = null;
      }
    };
  }, [username, sessionId]); // ✅ Depend only on username & sessionId

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
      ws.current.send(
        JSON.stringify({ type: "join", room: roomId, username, sessionId })
      );
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
  // Queue-based message sender
  const processQueue = useCallback(() => {
    if (isSending.current || messageQueue.current.length === 0) {
      return;
    }

    isSending.current = true;
    const nextMessage = messageQueue.current.shift();
    if (nextMessage && ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(nextMessage);
      setTimeout(() => {
        isSending.current = false;
        processQueue(); // Process next message after delay
      }, 300); // Throttle: 300ms delay between messages
    } else {
      isSending.current = false;
    }
  }, []);

  const enqueueMessage = (message: string) => {
    messageQueue.current.push(message);
    processQueue(); // Start processing the queue
  };

  const sendMessage = (message: string) => {
    if (!message.trim() || !username || !currentRoom) return;

    const messageData = {
      id: uuidv4(),
      type: "message",
      room: currentRoom.id,
      sender: username,
      content: message,
      sessionId,
      timestamp: new Date().toLocaleTimeString(),
    };

    // ✅ Instantly add message to UI without waiting for WebSocket
    setMessages((prev) => [...prev, messageData]);

    // ✅ Queue message for actual WebSocket sending
    const messageString = JSON.stringify(messageData);
    enqueueMessage(messageString);
  };

  return { messages, sendMessage, currentRoom, changeRoom, rooms };
}
