"use client";

import { Sidebar } from "@/components/Sidebar";
import Header from "@/components/Header";
import { MessageList } from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useUsername } from "@/hooks/useUsername";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useMobileMenu } from "@/hooks/useMobileMenu";

export default function ChatApp() {
  const { username, sessionId } = useUsername(); // ✅ Updated hook
  const { messages, sendMessage, currentRoom, changeRoom, rooms } =
    useWebSocket({
      username: username,
      sessionId: sessionId,
    });

  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="mx-auto text-2xl font-bold pb-10 italic">GLOBAL CHAT</h1>
        <Card className="w-full max-w-4xl h-[80vh]  py-0 shadow-xl overflow-hidden">
          <CardContent className="p-0 h-full flex ">
            <Sidebar
              servers={rooms}
              currentRoom={currentRoom}
              onRoomChange={changeRoom}
              isMobileMenuOpen={isMobileMenuOpen}
              toggleMobileMenu={toggleMobileMenu}
              closeMobileMenu={closeMobileMenu}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
              <Header
                currentRoom={currentRoom}
                userCount={currentRoom?.userCount || 0}
                toggleMobileMenu={toggleMobileMenu}
              />
              <div className="flex-1 flex flex-col overflow-hidden">
                <MessageList
                  messages={messages}
                  currentUser={username}
                  currentSessionId={sessionId || ""}
                />
                <MessageInput onSendMessage={sendMessage} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}
