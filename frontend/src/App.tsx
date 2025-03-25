"use client";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import { useWebSocket } from "./hooks/useWebSocket";
import { useUsername } from "./hooks/useUsername";

export default function ChatApp() {
  const username = useUsername();
  const { messages, sendMessage, currentRoom, changeRoom, rooms } =
    useWebSocket({
      username,
    });

  return (
    <div className="flex h-screen">
      <Sidebar
        servers={rooms}
        currentRoom={currentRoom}
        onRoomChange={changeRoom}
      />
      <div className="flex flex-col flex-1">
        <Header
          currentRoomName={currentRoom?.name}
          userCount={currentRoom?.userCount || 0}
          toggleMobileMenu={() => {}}
        />
        <MessageList messages={messages} username={username} />
        <MessageInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
