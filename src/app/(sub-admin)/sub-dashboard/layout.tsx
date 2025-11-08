import DashboardHeader from "./dashboard-header";
import ProtectedRoute from "@/components/ProtectedRoutes";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function SubDashboardLayout({
  children,
  totals,
  notification,
  evacuation,
  riskmapping,
  population,
  advisories,
}: {
  children: React.ReactNode;
  totals: React.ReactNode;
  notification: React.ReactNode;
  evacuation: React.ReactNode;
  riskmapping: React.ReactNode;
  population: React.ReactNode;
  advisories: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="scrollBar relative h-screen w-full overflow-auto px-8 py-6 transition-all duration-300">
        <DashboardHeader />

        <div className="mt-10 grid h-[1200px] w-full grid-cols-7 grid-rows-8 gap-6 pb-10">
          <div className="col-start-1 col-end-6 row-start-1 row-end-3">
            {totals}
          </div>
          <div className="col-start-1 col-end-6 row-start-3 row-end-6 mt-6">
            {evacuation}
          </div>
          <div className="col-start-6 col-end-8 row-start-1 row-end-4">
            {notification}
          </div>
          <div className="col-start-6 col-end-8 row-start-4 row-end-6 h-full w-full rounded-lg">
            {riskmapping}
          </div>
          <div className="col-start-1 col-end-3 row-start-6 row-end-9 h-full w-full rounded-lg">
            {advisories}
          </div>

          <div className="col-start-3 col-end-8 row-start-6 row-end-9 h-full w-full">
            {population}
          </div>
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
