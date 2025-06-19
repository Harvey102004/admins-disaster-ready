import React from "react";
import { Metadata } from "next";

export const metadata = {
  title: "Evacuation Center",
};

export default function EvacuationCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
