import React from "react";
import { Server } from "../types";

interface SidebarProps {
  servers: Server[];
  currentServer: Server;
  onServerChange: (server: Server) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  servers,
  currentServer,
  onServerChange,
}) => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold">Servers</h2>
      <ul>
        {servers.map((server) => (
          <li
            key={server.id}
            onClick={() => onServerChange(server)}
            className={`p-2 cursor-pointer rounded ${
              currentServer.id === server.id ? "bg-gray-700" : ""
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
