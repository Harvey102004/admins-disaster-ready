import React from "react";
import type { Metadata } from "next";
import UpdateNewsNavSuper from "@/components/(navigation)/UpdateNewsNav";
import ProtectedRoute from "@/components/ProtectedRoutes";
export const metadata: Metadata = {
  title: "Update & News",
};

export default function UpdateNewsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="relative w-full pl-8 transition-all duration-300">
        <UpdateNewsNavSuper />

        {children}
        {modal}
      </div>
    </ProtectedRoute>
  );
}
