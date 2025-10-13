"use client";

import { useEffect, useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) return null;

  const dateString = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <MdSpaceDashboard className="text-2xl" />
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <div className="flex gap-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {dateString} – {timeString}
        </p>
        <FaRegCalendarAlt className="" />
      </div>
    </div>
  );
}
