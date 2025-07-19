"use client";

import Image from "next/image";
import { FaUser, FaPhone } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { GoHomeFill } from "react-icons/go";
import { useRouter } from "next/navigation";

import {
  EvacuationLineChart,
  EvacuationBarChart,
  EvacuationDoughnutChart,
  EvacuationPolarAreaChart,
  EvacuationPieChart,
} from "../charts/evacuationCharts";

interface EvacuationCardProps {
  id: string | number;
  title: string;
  location: string;
  contact_person: string;
  contact_number: string;
  capacity: string | number;
  evacuees: string | number;
  chartStyle: string;
}

export default function EvacuationCard({
  id,
  title,
  location,
  contact_person,
  contact_number,
  capacity,
  evacuees,
  chartStyle,
}: EvacuationCardProps) {
  const router = useRouter();
  const cap = Number(capacity) || 0;
  const evacs = Number(evacuees) || 0;
  const vacancy = cap - evacs;

  let chartDesign = chartStyle;

  switch (chartDesign) {
    case "bar":
      chartDesign = "bar";
      break;
    case "line":
      chartDesign = "line";
      break;
    case "doughnut":
      chartDesign = "doughnut";
      break;
    case "pie":
      chartDesign = "pie";
      break;
    case "polar":
      chartDesign = "polar";
      break;
    default:
      break;
  }

  const vacancyRate = (vacancy / cap) * 100;

  let statusLabel = "Unknown";
  let statusColor = "bg-gray-400";

  if (cap === 0) {
    statusLabel = "No capacity data";
    statusColor = "bg-gray-400";
  } else if (vacancy === 0) {
    statusLabel = "Not Available  (Full) ";
    statusColor = "bg-red-600";
  } else if (vacancyRate < 50) {
    statusLabel = "Almost full";
    statusColor = "bg-yellow-400";
  } else {
    statusLabel = "Plenty of space";
    statusColor = "bg-green-500";
  }

  return (
    <div className="border-dark-blue/50 relative flex h-[280px] rounded-xl border p-5 transition-all duration-300 hover:z-10 hover:scale-[1.01] hover:shadow-lg dark:border-gray-500/40 dark:bg-transparent">
      <div className="h-full w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-[60%] items-center gap-2">
            <GoHomeFill className="text-dark-blue" />
            <p className="truncate">{title}</p>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-xs">{statusLabel}</p>
            <div className={`h-3 w-3 rounded-full ${statusColor}`}></div>
          </div>
        </div>

        <div className="mt-3 flex h-[85%] w-full justify-between gap-10">
          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="flex items-center gap-2">
              <HiLocationMarker className="text-dark-blue text-sm" />
              <p className="max-w-[185px] truncate text-xs">{location}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaUser className="text-dark-blue text-xs" />
              <p className="max-w-[185px] truncate text-xs">{contact_person}</p>
            </div>

            <div className="flex items-center gap-2">
              <FaPhone className="text-dark-blue text-xs" />
              <p className="max-w-[185px] truncate text-xs">{contact_number}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-dark-blue h-2.5 w-2.5 rounded-full"></div>
              <p className="max-w-[200px] truncate text-xs">
                Capacity: <span className="ml-1">{cap}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#C10000]"></div>
              <p className="max-w-[200px] truncate text-xs">
                Evacuees: <span className="ml-1">{evacs}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#4CAF50]"></div>
              <p className="max-w-[200px] truncate text-xs">
                Vacancy: <span className="ml-1">{vacancy}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image src={`/logos/lb-logo.png`} alt="" width={30} height={30} />
              <p className="text-xs text-gray-500">Added by: Wala pa</p>
            </div>
          </div>

          <div className="flex h-full w-1/2 flex-col items-center justify-between">
            <div className="flex h-full w-full items-center justify-center">
              {chartDesign === "bar" && (
                <EvacuationBarChart capacity={cap} evacuees={evacs} />
              )}
              {chartDesign === "line" && (
                <EvacuationLineChart capacity={cap} evacuees={evacs} />
              )}
              {chartDesign === "doughnut" && (
                <EvacuationDoughnutChart capacity={cap} evacuees={evacs} />
              )}
              {chartDesign === "pie" && (
                <EvacuationPieChart capacity={cap} evacuees={evacs} />
              )}
              {chartDesign === "polar" && (
                <EvacuationPolarAreaChart capacity={cap} evacuees={evacs} />
              )}
            </div>

            <button
              onClick={() => {
                sessionStorage.setItem("chartStyle", chartStyle);
                router.push(`/super-evacuation-center/detail/${id}`);
              }}
              className="bg-dark-blue ml-5 w-1/2 rounded-sm py-2 text-center text-[10px] text-white transition-all duration-300 hover:opacity-85"
            >
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
