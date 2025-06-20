import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evacuation Center",
};

export default function EvacuationCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
