import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relief Goods",
};

export default function ReliefGoodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
