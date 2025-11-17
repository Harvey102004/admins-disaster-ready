"use client";

import { useEffect, useState } from "react";
import { FaComputer } from "react-icons/fa6";

export default function DeviceGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const mobile = /Mobi|Android/i.test(ua);
    setIsMobile(mobile);
  }, []);

  if (isMobile === null) return null; // Loading state habang checking

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3">
        <FaComputer className="text-4xl" />
        <p className="text-center text-sm text-gray-500">
          This website works on desktop only.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
