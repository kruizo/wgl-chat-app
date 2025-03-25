"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  getCurrentTheme: () => string; // Add a function to get the current theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check localStorage for theme preference
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);

    console.log("📌 Stored theme from localStorage:", storedTheme);

    // Apply the theme to <html>
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark"); // ❗ REMOVE dark class
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    console.log("🔄 Toggling theme to:", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark"); // ❗ ENSURE CLASS REMOVAL
    }
  };

  const getCurrentTheme = () => theme; // Function to return the current theme

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, getCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
