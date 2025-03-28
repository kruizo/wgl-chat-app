// hooks/useMobileMenu.ts
import { useState } from "react";

// ✅ Hook to handle mobile menu logic
export function useMobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle menu open/close
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Open menu
  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Close menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,
  };
}
