"use client";

import { ModeToggleSideBar } from "../darkmode-toggle";
import { MdSpaceDashboard, MdAnnouncement } from "react-icons/md";
import { FaBuildingShield } from "react-icons/fa6";
import { RiTruckFill, RiCoinsFill, RiLogoutCircleLine } from "react-icons/ri";
import { HiMiniMapPin } from "react-icons/hi2";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { UserProps } from "../../../types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SideBarSkeleton } from "../skeleton/Skeleton-update-news";

export default function NavbarSuperAdmin() {
  const pathname = usePathname();
  const [isLogout, setIsLogout] = useState(false);
  const router = useRouter();

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
      icon: <FaBuildingShield />,
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
      className={`x-translate-y-1/2 bg-dark-blue/20 border-dark-blue dark:bg-light-black relative top-[1vh] left-[0.5vw] flex h-[98vh] w-[30vw] flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 dark:border-white/5`}
    >
      <div className="border-b-dark-blue/50 flex items-center justify-between border-b pb-3 pl-4 dark:border-b-gray-500/30">
        <h1 className="text-dark-blue text-lg font-bold text-nowrap">
          DisasterReady
        </h1>

        <div className={`"absolute right-0"}`}>
          <ModeToggleSideBar />
        </div>
      </div>

      <div className="border-b-dark-blue/50 relative mt-5 flex items-center gap-3 border-b pb-5 dark:border-b-gray-500/30">
        {storedAccount?.barangay && storedAccount.email ? (
          <>
            <div className="relative h-14 w-14">
              <Image src={`/logos/lb-logo.png`} alt="" fill />
            </div>

            <div className="flex flex-col gap-1.5 text-nowrap">
              <h1 className="text-sm font-semibold">
                {storedAccount?.barangay}
              </h1>
              <p className="max-w-[250px] truncate text-xs text-gray-800 dark:text-gray-400">
                {storedAccount?.email}
              </p>
              <p className="text-[10px] font-light text-gray-700 dark:text-gray-400">
                Super Admin
              </p>
            </div>
          </>
        ) : (
          <SideBarSkeleton />
        )}
      </div>

      <nav className="border-b-dark-blue/50 mt-3 border-b pb-3 dark:border-b-gray-500/30">
        <ul className="flex flex-col gap-1">
          {navLinks.map((link, i) => {
            const isActive =
              pathname === link.path ||
              (pathname.startsWith(link.path) && link.path !== "/");
            return (
              <Link
                key={i}
                href={link.path}
                className={`flex items-center gap-4 rounded-sm py-3 text-xs text-nowrap ${isActive ? "bg-dark-blue/90 text-puti" : "hover:bg-dark-blue/10"}`}
              >
                <div className="pl-4 text-lg">{link.icon}</div>

                {link.name}
              </Link>
            );
          })}
        </ul>
      </nav>
      <p
        onClick={() => setIsLogout(true)}
        className={`hover:text-dark-blue mt-auto flex cursor-pointer items-center gap-4 pl-4 text-xs`}
      >
        <RiLogoutCircleLine className={"text-xl"} />
        Logout
      </p>

      {isLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10"
          onClick={() => setIsLogout(false)}
        >
          <div
            className="dark:bg-light-black rounded bg-white p-7 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-5 font-medium">Are you sure you want to logout?</p>

            <div className="mx-auto flex items-center justify-center gap-5 text-sm text-white">
              <button
                className="bg-dark-blue rounded px-6 py-2"
                onClick={() => setIsLogout(false)}
              >
                No
              </button>
              <button
                className="rounded bg-red-500 px-6 py-2 text-white"
                onClick={() => {
                  localStorage.removeItem("user");
                  router.push("/login");
                  router.refresh();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
