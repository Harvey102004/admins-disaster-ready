"use client";

import dynamic from "next/dynamic";
import { FaQuestionCircle } from "react-icons/fa";

const HazardMap = dynamic(
  () => import("@/components/super-admin/risk-mapping/map"),
  {
    ssr: false,
  },
);

export default function DisasterRiskMapping() {
  return (
    <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
      <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>
      <div className="flex items-center justify-center gap-2 border-b pb-6">
        <h1 className="text-dark-blue text-xl font-bold">
          Disaster Risk Mapping
        </h1>

        <div className="relative z-50">
          <div className="group inline-block cursor-pointer">
            <FaQuestionCircle className="text-dark-blue mt-2 text-lg transition hover:text-gray-600" />

            <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded bg-white p-4 text-sm text-gray-700 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
              Click a hazard type (e.g., Flood), then click on the map to place
              a marker. Use this to identify disaster-prone areas.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center">
        <div className="h-[80vh] w-full max-w-5xl">
          <HazardMap />
        </div>
      </div>
    </div>
  );
}
