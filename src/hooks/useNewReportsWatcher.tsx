"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { getAllReports } from "@/server/api/reports";

export function useNewReportsWatcher() {
  const previousCount = useRef<number | null>(null);
  const pendingReports = useRef(0);
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

  const reportCount = reports?.length ?? 0;

  useEffect(() => {
    if (previousCount.current === null) {
      previousCount.current = reportCount ?? 0;
      return;
    }

    if (reportCount == null) return;

    const diff = reportCount - (previousCount.current ?? 0);

    if (diff > 0) {
      pendingReports.current += diff;

      // Play sound once
      if (audioRef.current) {
        audioRef.current.play().catch(() => console.log("Audio blocked"));
      }

      // Only create toast if not already showing
      if (toastId.current) {
        toast.message(
          `Received new ${pendingReports.current} ${pendingReports.current > 1 ? "reports!" : "report!"}`,
          {
            id: toastId.current,
          },
        );
      } else {
        // ✅ Create toast only once
        toastId.current = toast.error(
          `Received new ${pendingReports.current} ${pendingReports.current > 1 ? "reports!" : "report!"}`,
          {
            duration: Infinity,
            action: {
              label: (
                <span className="rounded-full bg-red-700 px-3 py-2 text-[8px] text-white">
                  OK
                </span>
              ),
              onClick: () => {
                pendingReports.current = 0;
                toastId.current = null;
                previousCount.current = reportCount;
              },
            },
          },
        );
      }
    }
  }, [reportCount]);
}
