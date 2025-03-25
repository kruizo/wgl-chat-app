import React from "react";
import { Server } from "../types";

interface SidebarProps {
  servers: Server[];
  currentRoom: Server | null;
  onRoomChange: (server: Server) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  servers,
  currentRoom,
  onRoomChange,
}) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold">Servers</h2>
      <ul>
        {servers.map((server) => (
          <li
            key={server.id}
            onClick={() => onRoomChange(server)}
            className={`p-2 cursor-pointer rounded ${
              currentRoom?.id === server.id ? "bg-gray-700" : ""
            }`}
          >
            {server.icon} {server.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
