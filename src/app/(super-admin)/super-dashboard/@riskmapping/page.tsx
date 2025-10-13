"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MappingCount = {
  Flood: number;
  RoadBlockage: number;
  FallenTree: number;
  Landslide: number;
  Hospital: number;
  Pharmacy: number;
};

export default function RiskMappingOverview() {
  const [counts, setCounts] = useState<MappingCount>({
    Flood: 0,
    RoadBlockage: 0,
    FallenTree: 0,
    Landslide: 0,
    Hospital: 0,
    Pharmacy: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "http://localhost/Disaster-backend/public/disasterMapping.php",
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const tempCounts: MappingCount = {
            Flood: 0,
            RoadBlockage: 0,
            FallenTree: 0,
            Landslide: 0,
            Hospital: 0,
            Pharmacy: 0,
          };

          json.data.forEach((item: any) => {
            const type = item.type as keyof MappingCount;
            if (tempCounts[type] !== undefined) {
              tempCounts[type]++;
            }
          });

          setCounts(tempCounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="border-dark-blue/50 flex h-full w-full flex-col gap-7 rounded-lg border px-5 py-4 shadow-lg">
      <h2 className="text-center text-sm">Riskmapping Overview</h2>

      <ul className="mx-4 flex flex-col gap-3 text-sm">
        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/flood.png"
              alt="Flood Icon"
              width={18}
              height={18}
            />
            <span>Flood</span>
          </div>
          <span className="font-semibold">{counts.Flood}</span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/road-blockage.png"
              alt="Road Blockage Icon"
              width={18}
              height={18}
            />
            <span>Road Blockage</span>
          </div>
          <span className="font-semibold">{counts.RoadBlockage}</span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/tree.png"
              alt="Fallen Tree Icon"
              width={18}
              height={18}
            />
            <span>Fallen Tree</span>
          </div>
          <span className="font-semibold">{counts.FallenTree}</span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/landslide.png"
              alt="Landslide Icon"
              width={18}
              height={18}
            />
            <span>Landslide</span>
          </div>
          <span className="font-semibold">{counts.Landslide}</span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/hospital.png"
              alt="Hospital Icon"
              width={18}
              height={18}
            />
            <span>Hospital</span>
          </div>
          <span className="font-semibold">{counts.Hospital}</span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/pharmacy.png"
              alt="Pharmacy Icon"
              width={18}
              height={18}
            />
            <span>Pharmacy</span>
          </div>
          <span className="font-semibold">{counts.Pharmacy}</span>
        </li>
      </ul>
    </div>
  );
}
