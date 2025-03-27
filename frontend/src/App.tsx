"use client";

import { useMemo, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { Server } from "./types";
import { useWebSocket } from "./hooks/useWebSocket";
import { useUsername } from "./hooks/useUsername";

export default function ChatApp() {
  const initialServers = useMemo<Server[]>(
    () => [
      { id: "1", name: "General", icon: "G", color: "#292CFF" },
      { id: "2", name: "Gaming", icon: "G", color: "#A805FF" },
    ],
    []
  );

  const [servers] = useState(initialServers);
  const [currentServer, setCurrentServer] = useState(servers[0]);

  const username = useUsername();
  const { messages, userCount, sendMessage } = useWebSocket({
    username,
    serverId: currentServer.id,
  });

  const handleServerChange = useCallback((server: Server) => {
    setCurrentServer(server);
    
  }, []);

  return (
    <div className="flex h-screen bg-background dark:bg-darkBackground">
      <Sidebar
        servers={servers}
        currentServer={currentServer}
        onServerChange={handleServerChange}
      />
      <div className="flex flex-col flex-1">
        <Header
          currentServerName={currentServer.name}
          userCount={userCount}
          toggleMobileMenu={() => {}}
        />
        <MessageList messages={messages} username={username || ""} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
