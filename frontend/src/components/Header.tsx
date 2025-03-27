import React from "react";
import { useTheme } from "@/context/ThemeProvider";

interface HeaderProps {
  currentServerName: string;
  userCount: number;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentServerName,
  userCount,
  toggleMobileMenu,
}) => {
  const { toggleTheme } = useTheme();

  return (
    <header className="p-4 dark:text-white text-black dark:bg-slate-900 flex justify-between items-center">
      <h1 className="text-primary">{currentServerName}</h1>
      <div className="flex items-center gap-4">
        <div className="bg-secondary px-3 py-1 rounded">
          Users Online: {userCount}
        </div>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded bg-primary text-white"
        >
          🌙 / ☀️
        </button>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
