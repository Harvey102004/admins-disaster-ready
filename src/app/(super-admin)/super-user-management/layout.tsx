import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User management",
};

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
