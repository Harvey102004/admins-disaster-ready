"use client";

import { ModeToggleSideBar } from "./darkmode-toggle";
import { MdSpaceDashboard, MdAnnouncement } from "react-icons/md";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { RiTruckFill, RiCoinsFill, RiLogoutCircleLine } from "react-icons/ri";
import { HiMiniMapPin } from "react-icons/hi2";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { PiResizeFill } from "react-icons/pi";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserProps } from "../../types";
import Link from "next/link";
import Image from "next/image";

export default function NavbarSuperAdmin() {
  const pathname = usePathname();

  const [isResize, setIsResize] = useState<boolean>(false);
  const [storedAccount, setStoredAccount] = useState<UserProps | null>(null);

  useEffect(() => {
    setStoredAccount(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  const navLinks = [
    {
      name: "Dashboard",
      path: "/super-dashboard",
      icon: <MdSpaceDashboard />,
    },
    {
      name: "Evacuation Center",
      path: "/super-evacuation-center",
      icon: <FaHouseCircleCheck />,
    },
    {
      name: "Disaster Risk Mapping",
      path: "/super-risk-mapping",
      icon: <HiMiniMapPin />,
    },
    {
      name: "Relief Goods",
      path: "/super-relief-goods",
      icon: <RiTruckFill />,
    },
    {
      name: "Barangay Contact Info",
      path: "/super-brgy-contact",
      icon: <BsFillTelephoneFill />,
    },
    {
      name: "Updates & News",
      path: "/super-update-news",
      icon: <MdAnnouncement />,
    },
    {
      name: "Donation Management",
      path: "/super-donation-management",
      icon: <RiCoinsFill />,
    },
    {
      name: "Users Management",
      path: "/super-user-management",
      icon: <FaUserEdit />,
    },
    {
      name: "Account Settings",
      path: "/super-account-settings",
      icon: <IoSettings />,
    },
  ];

  return (
    <div
      className={`x-translate-y-1/2 bg-dark-blue/20 border-dark-blue relative top-[1vh] left-[0.5vw] flex h-[98vh] overflow-hidden ${isResize ? "w-[5vw] items-center" : "w-[35vw]"} dark:bg-light-black flex-col gap-6 rounded-2xl border px-10 py-7 transition-all duration-300 dark:border-white/5`}
    >
      <div className="border-b-dark-blue/50 flex items-center justify-between border-b pb-4 dark:border-b-gray-500">
        {!isResize && (
          <h1 className="text-dark-blue text-sm font-bold text-nowrap">
            Disaster Ready
          </h1>
        )}

        {isResize ? (
          <PiResizeFill
            className="dark:text-puti text-dark-blue text-2xl"
            onClick={() => {
              setIsResize((prev) => !prev);
            }}
          />
        ) : (
          <PiResizeFill
            className="dark:text-puti text-dark-blue text-2xl"
            onClick={() => {
              setIsResize((prev) => !prev);
            }}
          />
        )}
      </div>

      <div className="border-b-dark-blue/50 relative flex items-center gap-3 border-b pb-5 dark:border-b-gray-500">
        <div className="relative h-12 min-h-12 w-12 min-w-12">
          <Image src={`/logos/lb-logo.png`} alt="" fill />
        </div>

        {!isResize && (
          <div className="flex flex-col gap-1 text-nowrap">
            <h1 className="text-xs">
              {storedAccount?.barangay ?? "Loading..."}
            </h1>
            <p className="text-[10px] font-light">Super Admin</p>
            <p className="text-[9px] text-gray-700 dark:text-gray-400">
              {storedAccount?.email ?? "Loading..."}
            </p>
          </div>
        )}

        <div className={`${isResize ? "hidden" : "absolute right-0"}`}>
          <ModeToggleSideBar />
        </div>
      </div>

      <nav className="border-b-dark-blue/50 border-b pb-6 dark:border-b-gray-500">
        <ul className="flex flex-col gap-7">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.path ||
              (pathname.startsWith(link.path) && link.path !== "/");
            return (
              <Link
                key={i}
                href={link.path}
                className={`flex items-center gap-4 text-xs text-nowrap ${isActive ? "text-dark-blue font-semibold" : "hover:text-dark-blue"}`}
              >
                <div className={`${isResize ? "text-xl" : "pl-4 text-lg"}`}>
                  {link.icon}
                </div>

                {isResize ? "" : link.name}
              </Link>
            );
          })}
        </ul>
      </nav>
      <p
        className={` ${isResize ? "" : "pl-4"} hover:text-dark-blue mt-auto flex cursor-pointer items-center gap-4 text-xs`}
      >
        <RiLogoutCircleLine
          className={`${isResize ? "text-2xl" : "text-xl"}`}
        />
        {isResize ? "" : "Logout"}
      </p>
    </div>
  );
}
