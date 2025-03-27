import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";

interface UseWebSocketProps {
  username: string | null;
  serverId: string;
}

export function useWebSocket({ username, serverId }: UseWebSocketProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userCount, setUserCount] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!username) return;

    ws.current = new WebSocket("ws://localhost:5001");

    ws.current.onopen = () => {
      console.log("✅ Connected to WebSocket");
      ws.current?.send(
        JSON.stringify({ type: "join", room: serverId, username })
      );
    };

    ws.current.onmessage = (msg) => {
      const receivedMessage = JSON.parse(msg.data);

      if (receivedMessage.type === "user_count") {
        setUserCount(receivedMessage.count || 0);
      } else if (receivedMessage.type === "message") {
        setMessages((prev) => [...prev, receivedMessage]);
      }
    };

    ws.current.onclose = () => {
      console.log("❌ Disconnected from WebSocket");
    };

    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [username, serverId]);

  const sendMessage = (message: string) => {
    if (!message.trim() || !username) return;

    const messageData = {
      type: "message",
      room: serverId,
      sender: username,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    ws.current?.send(JSON.stringify(messageData));
  };

  const serverChange = (message: string) => {};

  return { messages, userCount, sendMessage };
}
