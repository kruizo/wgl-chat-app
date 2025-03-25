import { useEffect, useState } from "react";

const STORAGE_KEY = "chat_username";
const EXPIRATION_HOURS = 24;

export function useUsername() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const { name, expiresAt } = JSON.parse(storedData);
      if (new Date().getTime() < expiresAt) {
        setUsername(name);
        return;
      }
    }

    let name: string | null = null;
    while (!name?.trim()) {
      name = prompt("Enter your username")?.trim() || null;
    }

    const expirationTime =
      new Date().getTime() + EXPIRATION_HOURS * 60 * 60 * 1000;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, expiresAt: expirationTime })
    );
    setUsername(name);
  }, []);

  return username;
}
