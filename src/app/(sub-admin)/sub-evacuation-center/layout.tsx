import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evacuation Center",
};

export default function EvacuationCenterLayoutSub({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
