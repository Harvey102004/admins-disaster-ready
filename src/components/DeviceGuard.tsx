"use client";

import { useEffect, useState } from "react";
import { FaComputer } from "react-icons/fa6";

export default function DeviceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    setIsMobileDevice(isMobile);
  }, []);

  if (isMobileDevice === null) return null; // while detecting

  // 👉 MOBILE DEVICES → ALLOW EVERYTHING
  if (isMobileDevice) {
    return <>{children}</>;
  }

  // 👉 DESKTOP BUT SMALL WIDTH → SHOW WARNING
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <FaComputer className="text-4xl" />
        <p className="text-center text-sm text-gray-500">
          This website works on desktop only.
        </p>
      </div>
    );
  }

  // 👉 DESKTOP WITH NORMAL WIDTH → ALLOW
  return <>{children}</>;
}
