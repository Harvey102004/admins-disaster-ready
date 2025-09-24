"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { FaCloud, FaRoad, FaUsers } from "react-icons/fa6";
import { MdOutlineAdd } from "react-icons/md";
import { PiWarningFill } from "react-icons/pi";
import { MdAnnouncement } from "react-icons/md";

export default function UpdateNewsNavSuper() {
  const pathname = usePathname();
  const [addFormPath, setAddFormPath] = useState("");

  // Determine add form path after mount to avoid hydration mismatch
  useEffect(() => {
    switch (true) {
      case pathname.includes("weather-advisory"):
        setAddFormPath("/super-update-news/weather-advisory/add-weather-form");
        break;
      case pathname.includes("road-advisory"):
        setAddFormPath("/super-update-news/road-advisory/add-road-form");
        break;
      case pathname.includes("disaster-updates"):
        setAddFormPath("/super-update-news/disaster-updates/add-disaster-form");
        break;
      case pathname.includes("community-notice"):
        setAddFormPath(
          "/super-update-news/community-notice/add-community-notice-form",
        );
        break;
      default:
        setAddFormPath("");
    }
  }, [pathname]);

  const advisories = [
    {
      name: "Weather",
      icon: <FaCloud />,
      href: "weather-advisory",
    },
    {
      name: "Road",
      icon: <FaRoad />,
      href: "road-advisory",
    },
    {
      name: "Disaster",
      icon: <PiWarningFill />,
      href: "disaster-updates",
    },
    {
      name: "Community Notice",
      icon: <FaUsers />,
      href: "community-notice",
    },
  ];

  return (
    <div className="sticky top-0 z-30 mx-8 flex items-center justify-between gap-5 py-5 backdrop-blur-md">
      <div className="flex items-center gap-2 pr-3 font-medium">
        <MdAnnouncement className="text-dark-blue text-2xl" />
        <p>Updates & News</p>
      </div>

      <div className="flex items-center gap-2">
        {advisories.map((updates, i) => {
          const isActive = pathname.includes(updates.href.toLowerCase());

          return (
            <Link
              href={`/super-update-news/${updates.href.toLowerCase()}`}
              key={i}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-sm transition-all duration-300 ${
                isActive ? "bg-dark-blue text-puti" : "hover:bg-dark-blue/10"
              }`}
            >
              {updates.icon}
              <p>{updates.name}</p>
            </Link>
          );
        })}
      </div>

      <div>
        <Link
          href={addFormPath}
          className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs transition-all duration-300 hover:opacity-75"
        >
          Add Updates <MdOutlineAdd />
        </Link>
      </div>
    </div>
  );
}

export const UpdateNewsNavSub = () => {
  const pathname = usePathname();
  const [addFormPath, setAddFormPath] = useState("");

  // Determine add form path after mount to avoid hydration mismatch
  useEffect(() => {
    switch (true) {
      case pathname.includes("weather-advisory"):
        setAddFormPath("/sub-update-news/weather-advisory/add-weather-form");
        break;
      case pathname.includes("road-advisory"):
        setAddFormPath("/sub-update-news/road-advisory/add-road-form");
        break;
      case pathname.includes("disaster-updates"):
        setAddFormPath("/sub-update-news/disaster-updates/add-disaster-form");
        break;
      case pathname.includes("community-notice"):
        setAddFormPath(
          "/sub-update-news/community-notice/add-community-notice-form",
        );
        break;
      default:
        setAddFormPath("");
    }
  }, [pathname]);

  const advisories = [
    {
      name: "Weather",
      icon: <FaCloud />,
      href: "weather-advisory",
    },
    {
      name: "Road",
      icon: <FaRoad />,
      href: "road-advisory",
    },
    {
      name: "Disaster",
      icon: <PiWarningFill />,
      href: "disaster-updates",
    },
    {
      name: "Community Notice",
      icon: <FaUsers />,
      href: "community-notice",
    },
  ];

  return (
    <div className="sticky top-0 z-30 mx-8 flex items-center justify-between gap-5 py-5 backdrop-blur-md">
      <div className="flex items-center gap-2 pr-3 font-medium">
        <MdAnnouncement className="text-dark-blue text-2xl" />
        <p>Updates & News</p>
      </div>

      <div className="flex items-center gap-2">
        {advisories.map((updates, i) => {
          const isActive = pathname.includes(updates.href.toLowerCase());

          return (
            <Link
              href={`/sub-update-news/${updates.href.toLowerCase()}`}
              key={i}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-sm transition-all duration-300 ${
                isActive ? "bg-dark-blue text-puti" : "hover:bg-dark-blue/10"
              }`}
            >
              {updates.icon}
              <p>{updates.name}</p>
            </Link>
          );
        })}
      </div>

      <div>
        <Link
          href={addFormPath}
          className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs transition-all duration-300 hover:opacity-75"
        >
          Add Updates <MdOutlineAdd />
        </Link>
      </div>
    </div>
  );
};
