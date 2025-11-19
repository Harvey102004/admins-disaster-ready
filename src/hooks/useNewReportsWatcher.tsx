"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { getAllReports } from "@/server/api/reports";

export function useNewReportsWatcher() {
  const previousPending = useRef<number | null>(null);
  const newPendingTotal = useRef(0);
  const toastId = useRef<string | number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current) {
    audioRef.current = new Audio("/notifSound.mp3");
  }

  const { data: reports } = useQuery({
    queryKey: ["reports-count"],
    queryFn: getAllReports,
    refetchInterval: 1000,
  });

  // Count only PENDING reports
  const pendingCount =
    reports?.filter((r: any) => r.status?.trim().toLowerCase() === "pending")
      .length ?? 0;

  useEffect(() => {
    if (previousPending.current === null) {
      previousPending.current = pendingCount;
      return;
    }

    const diff = pendingCount - previousPending.current;

    // Trigger only when pending increases
    if (diff > 0) {
      newPendingTotal.current += diff;

      const message = `You have ${newPendingTotal.current} pending incident reports that require your attention. Please review and resolve them as soon as possible.`;

      // Play alert sound
      audioRef.current?.play().catch(() => {});

      // Update existing toast OR create new toast
      if (toastId.current) {
        toast.message(message, {
          id: toastId.current,
        });
      } else {
        toastId.current = toast.error(message, {
          duration: Infinity,
          action: {
            label: (
              <span className="rounded-full bg-red-700 px-3 py-2 text-[8px] text-white">
                OK
              </span>
            ),
            onClick: () => {
              newPendingTotal.current = 0;
              toastId.current = null;
              previousPending.current = pendingCount;
            },
          },
        });
      }
    }

    previousPending.current = pendingCount;
  }, [pendingCount]);
}
