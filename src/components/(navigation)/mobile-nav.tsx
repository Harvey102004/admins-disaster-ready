"use client";

import { useState } from "react";

import { FiMenu } from "react-icons/fi";
import SidebarMobile from "./mobile-sideBar";

export default function MobileNavigation() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <FiMenu
          onClick={() => setIsSideBarOpen(true)}
          className="text-xl dark:text-white"
        />
      </div>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/10 backdrop-blur-[5px] transition-opacity ${
          isSideBarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSideBarOpen(false)}
      />

      {/* Sidebar itself */}
      <div
        className={`dark:bg-light-black fixed top-0 left-0 z-50 h-full w-[75%] transform rounded-r-3xl bg-white shadow-lg transition-transform duration-300 ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarMobile onClick={() => setIsSideBarOpen(false)} />
      </div>
    </>
  );
}
