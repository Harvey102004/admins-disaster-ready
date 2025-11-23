"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SessionHandler() {
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function sendHeartbeat() {
      try {
        const res = await fetch(
          "https://greenyellow-lion-623632.hostingersite.com/public/session.php",
          {
            method: "GET",
            credentials: "include",
          },
        );

        // OPTIONAL: detect expired session from backend
        // If your session.php returns { expired: true }
        try {
          const data = await res.json();
          if (data?.expired) handleSessionExpired();
        } catch (_) {}
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

    function stopHeartbeat() {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
    }

    function startHeartbeat() {
      stopHeartbeat(); // prevent duplicates

      // send first heartbeat immediately
      sendHeartbeat();

      // repeat heartbeat every 5 minutes
      heartbeatInterval.current = setInterval(
        sendHeartbeat,
        HEARTBEAT_INTERVAL,
      );
    }

    function resetIdleTimer() {
      // restart heartbeat ONLY when user interacts
      startHeartbeat();

      // reset idle timer
      if (idleTimer.current) clearTimeout(idleTimer.current);

      idleTimer.current = setTimeout(() => {
        stopHeartbeat(); // stop heartbeat so session expires
        handleSessionExpired();
      }, MAX_IDLE_TIME);
    }

    // Check if user is logged in
    const isLoggedIn =
      !!localStorage.getItem("token") || !!localStorage.getItem("user");

    if (isLoggedIn) {
      resetIdleTimer(); // initialize

      // user activities that reset idle timer
      ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
        (event) => window.addEventListener(event, resetIdleTimer),
      );
    }

    return () => {
      stopHeartbeat();
      if (idleTimer.current) clearTimeout(idleTimer.current);

      ["click", "mousemove", "keydown", "scroll", "touchstart"].forEach(
        (event) => window.removeEventListener(event, resetIdleTimer),
      );
    };
  }, []);

  return null;
}
