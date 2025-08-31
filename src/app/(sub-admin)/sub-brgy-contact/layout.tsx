import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Information",
};

export default function SubBrgyContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative h-screen w-full overflow-auto px-8 pt-4 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 border-b pb-4">
          <h1 className="text-dark-blue text-lg font-bold">
            Contact Information
          </h1>
        </div>
        {children}
      </div>
    </>
  );
}
