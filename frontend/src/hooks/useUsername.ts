// useUsername.ts
import { useEffect, useState } from "react";

const STORAGE_KEY = "chat_username";
const SESSION_KEY = "chat_session_id";
const EXPIRATION_HOURS = 24;

export function useUsername() {
  const [username, setUsername] = useState<string>(() => getCurrentUser()); // ✅ Initial load
  const [sessionId, setSessionId] = useState<string | null>(() =>
    localStorage.getItem(SESSION_KEY)
  );

  useEffect(() => {
    if (!sessionId) {
      generateAndStoreSessionId(); // Create new session if missing
    }
  }, [sessionId]);

  // ✅ Get current username or reset if invalid
  function getCurrentUser() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const sessionId = localStorage.getItem(SESSION_KEY);

    if (storedData && sessionId) {
      const { name, expiresAt } = JSON.parse(storedData);
      if (new Date().getTime() < expiresAt) {
        return name; // ✅ Valid session, return name
      }
    }
    return resetUserData(); // ❌ If expired or missing, reset
  }

  // ✅ Reset username and session when expired or invalid
  function resetUserData() {
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

    generateAndStoreSessionId(); // Create new session
    setUsername(name);
    return name;
  }

  // ✅ Create and store session ID
  function generateAndStoreSessionId() {
    const sessionId =
      Math.random().toString(36).substr(2, 9) +
      "-" +
      new Date().getTime().toString(36);
    localStorage.setItem(SESSION_KEY, sessionId);
    setSessionId(sessionId);
  }

  return { username, sessionId, resetUserData };
}
