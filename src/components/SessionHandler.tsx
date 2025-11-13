"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SessionHandler() {
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

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

    const MAX_IDLE_TIME = 60 * 60 * 1000; // 1 hour
    const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes

    function handleSessionExpired() {
      toast.error("Your session has expired due to inactivity.");

      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 3000);
    }

    function resetIdleTimer() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(handleSessionExpired, MAX_IDLE_TIME);
    }

    function startHeartbeat() {
      // Prevent duplicate intervals
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);

      // send first heartbeat immediately
      sendHeartbeat();

      // then repeat every 5 minutes
      heartbeatInterval.current = setInterval(
        sendHeartbeat,
        HEARTBEAT_INTERVAL,
      );
    }

    // Only start if logged in (optional check)
    const isLoggedIn =
      !!localStorage.getItem("token") || !!localStorage.getItem("user");
    if (isLoggedIn) {
      startHeartbeat();
      resetIdleTimer();

      ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
        (event) => window.addEventListener(event, resetIdleTimer),
      );
    }

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);

      ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
        (event) => window.removeEventListener(event, resetIdleTimer),
      );
    };
  }, []);

  return null;
}
