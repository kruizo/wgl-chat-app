import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Menu, Moon, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Server } from "@/types";

interface HeaderProps {
  currentRoom?: Server | null;
  userCount: number;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentRoom,
  userCount,
  toggleMobileMenu,
}) => {
  const { getCurrentTheme, toggleTheme } = useTheme();
  const isDark = getCurrentTheme() === "dark";

  return (
    <div className="border-b border-border p-4 flex items-center justify-between bg-card  text-card-foreground">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-lg">
            @ {currentRoom?.name || "Select a room"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-primary/10 ">
          <div className="text-foreground">{userCount} users online</div>
        </Badge>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full text-accent-foreground"
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default Header;
