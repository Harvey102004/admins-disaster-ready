import React from "react";
import type { Metadata } from "next";
import { UpdateNewsNavSub } from "@/components/(navigation)/UpdateNewsNav";
export const metadata: Metadata = {
  title: "Update & News",
};

export default function UpdateNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full pl-8 transition-all duration-300">
      <UpdateNewsNavSub />

      {children}
    </div>
  );
}
