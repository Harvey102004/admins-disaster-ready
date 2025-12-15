import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiLogoutCircleRLine, RiSendPlaneFill } from "react-icons/ri";
import { FaBuildingShield } from "react-icons/fa6";
import { createPortal } from "react-dom";

import { IoClose } from "react-icons/io5";
import { SegmentedThemeToggle } from "../theme-toggle";
import { useEffect, useState } from "react";
import { successToast } from "../toast";
import axios from "axios";

export default function SidebarMobile({ onClick }: { onClick?: () => void }) {
  const [isLogout, setIsLogout] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    {
      link: "Incident Reports",
      path: "/mobile-reports",
      icon: <RiSendPlaneFill />,
    },
    {
      link: "Evacuation Centers",
      path: "/mobile-evacuation",
      icon: <FaBuildingShield />,
    },
  ];

  return (
    <>
      <div className="relative flex h-full w-full flex-col justify-between">
        <div className="flex h-[85%] flex-col justify-between">
          <div className="">
            <div className="mt-2 flex items-center justify-between p-5">
              <h1 className="text-dark-blue text text-center font-extrabold md:text-xl dark:text-white">
                Disaster Ready
              </h1>
              <IoClose
                onClick={onClick}
                className="absolute top-5 right-3 cursor-pointer text-lg"
              />
            </div>

            <nav className="mt-5">
              <p className="mb-4 pl-5 text-xs">Menu</p>
              <ul className="flex flex-col gap-2 pr-[15%] text-sm">
                {navLinks.map((navLink) => {
                  const isActive = pathname === navLink.path;

                  return (
                    <Link
                      key={navLink.link}
                      href={navLink.path}
                      onClick={onClick}
                      className={`hover:text-dark-blue rounded-r-full py-3 text-xs ${isActive ? "bg-dark-blue text-white" : ""}`}
                    >
                      <li className="flex items-center gap-4 pl-5">
                        <div className="text-base">{navLink.icon}</div>
                        <span>{navLink.link}</span>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div
            onClick={() => setIsLogout(true)}
            className="flex items-center gap-4 pl-5"
          >
            <RiLogoutCircleRLine className="text-base dark:text-white" />

            <p className="text-xs">Logout</p>
          </div>
        </div>

        <div className="mx-auto mb-[5%] h-14 w-[80%]">
          {mounted && <SegmentedThemeToggle />}
        </div>
      </div>

      {/* Logout modal */}
      {isLogout &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setIsLogout(false)}
          >
            <div
              className="dark:bg-light-black relative w-[80%] max-w-[320px] rounded-2xl bg-white p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                Confirm Logout
              </h3>

              <p className="mb-6 text-center text-[10px] text-gray-600 dark:text-gray-300">
                Are you sure you want to logout? You will need to login again to
                access your account.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[10px] text-gray-700"
                  onClick={() => setIsLogout(false)}
                >
                  Cancel
                </button>

                <button
                  className="rounded-md bg-red-600 px-4 py-1.5 text-[10px] text-white"
                  onClick={async () => {
                    try {
                      await axios.get(
                        "https://greenyellow-lion-623632.hostingersite.com/public/logout.php",
                        { withCredentials: true },
                      );
                      successToast("Success!", "Logout completed successfully");
                    } catch (error) {
                      console.error("Logout failed:", error);
                    } finally {
                      localStorage.removeItem("user");
                      setIsLogout(false);
                      router.push("/mobile-login");
                      router.refresh();
                    }
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
