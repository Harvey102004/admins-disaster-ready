import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

export default function SubIncidentReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
