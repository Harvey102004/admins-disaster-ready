import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Mapping",
};

export default function DisasterRiskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
