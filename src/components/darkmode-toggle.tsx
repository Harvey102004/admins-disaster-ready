"use client";

import * as React from "react";
import { MdSunny } from "react-icons/md";
import { IoMoon } from "react-icons/io5";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggleLogin() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={"icon"}
      className="bg-itim text-light dark:text-itim dark:bg-puti transition-none"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      <MdSunny className="scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <IoMoon className="absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function ModeToggleSideBar() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={"sm"}
      className="bg-dark-blue text-light dark:text-itim dark:bg-puti transition-none"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      <MdSunny className="scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <IoMoon className="absolute scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
