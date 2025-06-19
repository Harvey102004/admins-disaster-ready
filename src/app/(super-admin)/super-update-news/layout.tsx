import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update & News",
};

export default function UpdateNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
