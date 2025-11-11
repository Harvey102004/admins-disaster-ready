"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function SessionHandler() {
  useEffect(() => {
    async function sendHeartbeat() {
      try {
        await fetch(
          "https://greenyellow-lion-623632.hostingersite.com/public/session.php",
          {
            method: "GET",
            credentials: "include",
          },
        );
      } catch (err) {
        console.error("Failed to refresh session:", err);
      }
    }

    let idleTimer: NodeJS.Timeout;
    const MAX_IDLE_TIME = 60 * 60 * 1000; // 1 hour

    function handleSessionExpired() {
      toast.error("Your session has expired due to inactivity.");

      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 3000); // 3-second delay para makita ang toast
    }

    function resetIdleTimer() {
      clearTimeout(idleTimer);
      sendHeartbeat();

      idleTimer = setTimeout(handleSessionExpired, MAX_IDLE_TIME);
    }

    ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach((event) =>
      window.addEventListener(event, resetIdleTimer),
    );

    resetIdleTimer();
  }, []);

  return null;
}
