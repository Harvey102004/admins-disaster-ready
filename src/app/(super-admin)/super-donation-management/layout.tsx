import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donations",
};

export default function DonationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
