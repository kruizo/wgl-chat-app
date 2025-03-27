import React from "react";
import { Message } from "../types";

interface MessageListProps {
  messages: Message[];
  username: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, username }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-950">
      {messages.map((msg, index) => (
        <>
          <div
            key={index}
            className={`p-2 space-x-4 rounded-md dark:text-gray-300 text-black`}
          >
            <strong className="font-bold ">{msg.sender}</strong>
            <span className="text-sm">{msg.timestamp}</span>
          </div>
          <p className="pl-2 dark:text-gray-200 text-black">{msg.content}</p>
        </>
      ))}
    </div>
  );
};

export default MessageList;
