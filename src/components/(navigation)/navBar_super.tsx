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
import { IoIosPaper } from "react-icons/io";
import axios from "axios";
import { toast } from "sonner";
import ProtectedRoute from "../ProtectedRoutes";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      name: "Incident Reports",
      path: "/super-incident-reports",
      icon: <IoIosPaper />,
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
    <ProtectedRoute>
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
                  className={`flex items-center gap-4 rounded-sm py-2.5 text-[11px] text-nowrap ${isActive ? "bg-dark-blue/90 text-puti" : "hover:bg-dark-blue/10"}`}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setIsLogout(false)}
          >
            <div
              className="dark:bg-light-black relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h3 className="mb-3 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Logout
              </h3>

              {/* Message */}
              <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Are you sure you want to logout? You will need to login again to
                access your account.
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-3">
                <button
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setIsLogout(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-md bg-red-600 px-4 py-2 text-xs text-white transition hover:bg-red-700"
                  onClick={async () => {
                    try {
                      await axios.get(
                        "https://greenyellow-lion-623632.hostingersite.com/public/logout.php",
                        {
                          withCredentials: true,
                        },
                      );
                      toast.success("Logged out successfully");
                    } catch (error) {
                      console.error(
                        "Logout failed (maybe already logged out):",
                        error,
                      );
                    } finally {
                      localStorage.removeItem("user");
                      setIsLogout(false);
                      router.push("/login");
                      router.refresh();
                    }
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
