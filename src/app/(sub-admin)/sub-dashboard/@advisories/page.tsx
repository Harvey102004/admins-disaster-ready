"use client";

import { useEffect, useState } from "react";
import { FaCloud, FaRoad, FaUsers } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import {
  getWeather,
  getRoad,
  getDisaster,
  getCommunity,
} from "@/server/api/advisories";

export default function Advisories() {
  const [totals, setTotals] = useState({
    weather: 0,
    road: 0,
    disaster: 0,
    community: 0,
  });

  useEffect(() => {
    async function fetchAll() {
      try {
        const [weatherData, roadData, disasterData, communityData] =
          await Promise.all([
            getWeather(),
            getRoad(),
            getDisaster(),
            getCommunity(),
          ]);

        setTotals({
          weather: weatherData.length,
          road: roadData.length,
          disaster: disasterData.length,
          community: communityData.length,
        });
      } catch (error) {
        console.error("Error fetching advisories:", error);
      }
    }

    fetchAll();
  }, []);

  const totalAdvisoties =
    totals.weather + totals.road + totals.disaster + totals.community;

  return (
    <div className="grid h-full w-full gap-6 rounded-lg">
      {/* Total Adviosries */}
      <div className="border-dark-blue/50 col-start-1 col-end-3 row-start-5 row-end-6 flex h-full w-full items-center justify-center gap-3 rounded-lg border shadow-lg">
        <div className="flex flex-col items-center justify-center gap-3 p-5">
          <h2 className="text-sm">Total Advisories</h2>
          <p className="text-4xl font-semibold">{totalAdvisoties}</p>
        </div>
      </div>

      {/* Weather Advisory */}
      <div className="border-dark-blue/50 col-start-1 col-end-2 row-start-1 row-end-3 flex h-full w-full items-center justify-center rounded-lg border shadow-lg">
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2 pb-2">
          <FaCloud className="text-dark-blue text-2xl" />
          <h2 className="text-xs">Weather Advisory</h2>
          <p className="text-3xl font-bold">{totals.weather}</p>
        </div>
      </div>

      {/* Road Advisory */}
      <div className="border-dark-blue/50 col-start-2 col-end-3 row-start-1 row-end-3 flex h-full w-full items-center justify-center rounded-lg border shadow-lg">
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2">
          <FaRoad className="text-dark-blue text-2xl" />
          <h2 className="text-xs">Road Advisory</h2>
          <p className="text-3xl font-bold">{totals.road}</p>
        </div>
      </div>

      {/* Disaster Updates */}
      <div className="border-dark-blue/50 col-start-1 col-end-2 row-start-3 row-end-5 flex h-full w-full items-center justify-center rounded-lg border shadow-lg">
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2">
          <PiWarningFill className="text-dark-blue text-2xl" />
          <h2 className="text-xs">Disaster Updates</h2>
          <p className="text-3xl font-bold">{totals.disaster}</p>
        </div>
      </div>

      {/* Community Notice */}
      <div className="border-dark-blue/50 col-start-2 col-end-3 row-start-3 row-end-5 flex h-full w-full items-center justify-center rounded-lg border shadow-lg">
        <div className="mt-4 flex h-full w-full flex-col items-center justify-center gap-2 pb-2">
          <FaUsers className="text-dark-blue text-2xl" />
          <h2 className="text-xs">Community Notice</h2>
          <p className="text-3xl font-bold">{totals.community}</p>
        </div>
      </div>
    </div>
  );
}
