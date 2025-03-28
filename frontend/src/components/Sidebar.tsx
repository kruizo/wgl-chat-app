"use client";

import type { Server } from "@/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";
import { Sheet, SheetContent } from "./ui/sheet";

interface SidebarProps {
  servers?: Server[];
  currentRoom?: Server | null;
  onRoomChange?: (server: Server) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export function Sidebar({
  servers = [],
  currentRoom = null,
  onRoomChange = () => {},
  isMobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
}: SidebarProps) {
  const serverContent = (
    <div className="p-3 bg-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-card-foreground">Servers</h2>
      </div>

      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="space-y-1">
          {servers && servers.length > 0 ? (
            servers.map((server) => (
              <Button
                key={server.id}
                variant={currentRoom?.id === server.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start rounded-lg py-6",
                  currentRoom?.id === server.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-card-foreground"
                )}
                onClick={() => {
                  onRoomChange(server);
                  closeMobileMenu();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted-foreground/10">
                    {server.icon || <Hash className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{server.name}</span>
                </div>
              </Button>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No servers available
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        {serverContent}
      </div>
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
          <SheetContent side="left" className="p-0 w-50 text-card-foreground">
            {serverContent}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
