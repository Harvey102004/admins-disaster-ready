"use client";

import dynamic from "next/dynamic";

const EvacuationListView = dynamic(
  () => import("@/components/maps/evac-map-list"),
  {
    ssr: false,
  },
);

export default function Page() {
  return (
    <div className="relative h-screen w-full pl-4">
      <EvacuationListView />{" "}
    </div>
  );
}
