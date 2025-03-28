"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

interface MessageListProps {
  messages: Message[];
  currentUser?: string;
  currentSessionId: string;
}

export function MessageList({
  messages = [],
  currentUser = "",
  currentSessionId = "",
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  let previousSender: string | null = null;

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
      setNewMessageCount(0);
    } else if (
      messages.length > 0 &&
      messages[messages.length - 1].sender !== currentUser
    ) {
      setNewMessageCount((prev) => prev + 1);
    }
  }, [messages]);

  // ✅ Scroll to the bottom smoothly
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setNewMessageCount(0);
  };

  // ✅ Track if user is at the bottom
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const scrollThreshold = 50; // Threshold before considering "not at bottom"
    const distanceFromBottom =
      scrollRef.current.scrollHeight -
      scrollRef.current.scrollTop -
      scrollRef.current.clientHeight;

    setIsAtBottom(distanceFromBottom < scrollThreshold);
  };

  const isMessageFromCurrentUser = (msg: Message) =>
    msg.sender === currentUser && currentSessionId === msg.sessionId;

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Main scrollable area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 bg-background h-full"
      >
        <div className="space-y-0.5">
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const initials = msg.sender
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase();

              const showSender = msg.sender !== previousSender;
              const isFirstInGroup =
                showSender ||
                index === 0 ||
                messages[index - 1].sender !== msg.sender;
              previousSender = msg.sender;
              console.log(
                "session: ",
                msg.sessionId,
                "local: ",
                currentSessionId
              );
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end",
                    isMessageFromCurrentUser(msg) && "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "flex gap-3 items-start",
                      isMessageFromCurrentUser(msg) && "flex-row-reverse"
                    )}
                  >
                    <div className="w-8">
                      {isFirstInGroup && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={cn(
                              isMessageFromCurrentUser(msg)
                                ? "bg-primary"
                                : "bg-secondary"
                            )}
                          >
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    <div
                      className={cn(
                        "flex flex-col max-w-[75%] space-y-0.5",
                        isMessageFromCurrentUser(msg) && "items-end text-right"
                      )}
                    >
                      {isFirstInGroup && (
                        <div
                          className={cn(
                            "flex items-center gap-2 mb-1",
                            isMessageFromCurrentUser(msg) && "justify-end"
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium text-foreground",
                              isMessageFromCurrentUser(msg) && "ml-auto"
                            )}
                          >
                            {msg.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp}
                          </span>
                        </div>
                      )}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "rounded-2xl px-3 py-1 w-fit",
                              isMessageFromCurrentUser(msg)
                                ? "bg-primary rounded-tr-none"
                                : "bg-muted text-foreground rounded-tl-none"
                            )}
                          >
                            <p>{msg.content}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{msg.timestamp}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      </div>

      {!isAtBottom && newMessageCount > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full shadow-md text-sm"
        >
          {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
