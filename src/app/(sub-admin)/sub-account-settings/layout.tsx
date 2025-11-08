import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default function SubAccountSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
