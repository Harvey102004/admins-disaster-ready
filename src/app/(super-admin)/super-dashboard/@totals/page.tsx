"use client";

import { FaBuildingShield } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi2";
import { RiSendPlaneFill } from "react-icons/ri";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { getEvacuationCenters } from "@/server/api/evacuation";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TotalsPage() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  const totalEvacuations = data.length;

  let plenty = 0;
  let almostFull = 0;
  let full = 0;

  data.forEach((e) => {
    const percent = ((e.current_evacuees ?? 0) / e.capacity) * 100;

    if (e.capacity === 0) return;

    if (e.current_evacuees === 0) {
      full++;
    } else if (percent >= 81 && percent <= 99) {
      almostFull++;
    } else if (percent <= 80) {
      plenty++;
    }
  });

  return (
    <div className="flex w-full gap-6">
      {/* TOTAL REPORTS */}
      <div className="relative flex w-1/2 flex-col justify-between rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-5 text-white shadow-lg dark:brightness-90">
        <div className="flex flex-col gap-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <RiSendPlaneFill /> Total Reports
            </h2>
          </div>

          <h1 className="mb-2 text-4xl font-bold">23,000</h1>

          <div className="relative mb-5 h-12 overflow-hidden">
            <svg
              viewBox="0 0 120 40"
              className="absolute top-0 left-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,25 C15,5 35,35 55,15 75,0 95,40 120,20"
                stroke="rgba(173, 216, 255, 0.9)"
                strokeWidth="1.8"
                fill="none"
              />
              <path
                d="M0,30 C20,45 40,10 60,25 80,35 100,5 120,30"
                stroke="rgba(100, 180, 255, 0.6)"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M0,35 C10,20 30,40 50,20 70,10 90,35 120,25"
                stroke="rgba(37, 99, 235, 0.5)"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex justify-around gap-8">
          <div className="text-center">
            <p className="mb-1 text-sm text-white/80">Critical</p>
            <p className="text-lg font-semibold text-white">10 %</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-white/80">Moderate</p>
            <p className="text-lg font-semibold text-white">30 %</p>
          </div>
          <div className="text-center">
            <p className="mb-1 text-sm text-white/80">Minor</p>
            <p className="text-lg font-semibold text-white">60 %</p>
          </div>
        </div>
      </div>

      {/* POPULATION & REPORTS */}
      <div className="flex w-1/2 flex-col gap-3">
        {/* Total Populations */}
        <div className="border-dark-blue/50 relative flex w-full items-center justify-between rounded-xl border p-4 px-6 shadow-lg">
          <div className="flex h-full flex-col justify-between gap-4">
            <p className="flex items-center gap-2 text-sm">
              <HiUserGroup />
              Total Populations
            </p>
            <p className="text-2xl font-bold">117,030</p>
          </div>

          <Image
            src="/logos/lb-logo.png"
            alt="People Illustration"
            width={60}
            height={60}
          />
        </div>

        {/* Total Evacuations */}
        <div className="border-dark-blue/50 relative flex w-full flex-1 flex-col items-center justify-between gap-3 rounded-xl border p-4 px-6 shadow-lg">
          <div className="flex h-full w-full items-center justify-between">
            <div className="flex h-full flex-col justify-between">
              <p className="flex items-center gap-2 text-sm">
                <FaBuildingShield />
                Total Evacuations
              </p>
              <p className="text-2xl font-bold">{totalEvacuations}</p>
              {/* Legend */}
              <div className="mt-2 flex w-full flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span>Plenty</span>
                  </div>
                  <span className="font-semibold">{plenty}</span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span>Almost full</span>
                  </div>
                  <span className="font-semibold">{almostFull}</span>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    <span>Full</span>
                  </div>
                  <span className="font-semibold">{full}</span>
                </div>
              </div>
            </div>

            <div className="relative h-24 w-24">
              <Doughnut
                data={{
                  labels: ["Plenty", "Almost Full", "Full"],
                  datasets: [
                    {
                      data: [plenty, almostFull, full],
                      backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  cutout: "65%",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
