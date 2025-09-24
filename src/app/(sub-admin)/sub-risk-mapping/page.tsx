"use client";

import dynamic from "next/dynamic";

const RiskMappingMap = dynamic(() => import("@/components/maps/risk-mapping"), {
  ssr: false,
});

export default function DisasterRiskMapping() {
  return (
    <div className="relative h-screen w-full pl-4">
      <RiskMappingMap />
    </div>
  );
}
