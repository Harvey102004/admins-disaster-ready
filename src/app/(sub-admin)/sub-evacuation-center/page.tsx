"use client";

import { useQuery } from "@tanstack/react-query";

import { getEvacuationCenters } from "@/server/api/evacuation";
import {
  FilteringEvacuation,
  SortDropdown,
} from "@/components/sort-filter/evacuation";
import { useMemo, useState, useEffect } from "react";

import type { SortBy } from "@/lib/sort-filter-update-news";
import { SearchInput } from "@/components/Inputs";

import EvacuationCard from "@/components/cards/EvacuationCards";
import { FaHouseCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import { MdOutlineAdd } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoStatsChart } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  filterEvacuationData,
  sortEvacuationData,
} from "@/lib/sort-filter-evacuation";
import { EvacuationSkeleton } from "@/components/skeleton/evacuation";
import { AiFillFolderOpen } from "react-icons/ai";

export default function SubAdminEvacuationCenter() {
  const [sortBy, setSortBy] = useState("addedBy");
  const [barangay, setBarangay] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [styling, setStyling] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("chartStyle") || "line";
    }
    return "line";
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const filteredAndSorted = useMemo(() => {
    const filtered = filterEvacuationData(data ?? [], barangay, status);

    const searched = filtered.filter((item) => {
      const text = searchText.toLowerCase();

      return (
        item.name?.toLowerCase().includes(text) ||
        item.location?.toLowerCase().includes(text) ||
        item.contact_person?.toLowerCase().includes(text) ||
        item.contact_number?.toLowerCase().includes(text)
      );
    });

    return sortEvacuationData(searched, sortBy);
  }, [data, sortBy, barangay, status, searchText]);

  const allStyles = [
    { name: "BarGraph", value: "bar" },
    { name: "LineGraph", value: "line" },
    { name: "DoughnutGraph", value: "doughnut" },
    { name: "PieGraph", value: "pie" },
    { name: "PolarGraph", value: "polar" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chartStyle", styling);
    }
  }, [styling]);

  if (isLoading) {
    return <EvacuationSkeleton />;
  }

  return (
    <>
      <div className="relative h-screen w-full overflow-auto pl-8 transition-all duration-300">
        <div className="flex w-full items-center justify-between gap-8 px-8 py-5">
          <div className="flex items-center gap-2 pr-3 font-medium">
            <FaHouseCircleCheck className="text-dark-blue text-2xl" />
            <p>Evacuation center</p>
          </div>
          <SearchInput
            value={searchText}
            onchange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            classname="flex-1"
          />

          <Link
            href={"/sub-evacuation-center/add-evac-form"}
            className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs transition-all duration-300 hover:opacity-75"
          >
            Add Evacuation <MdOutlineAdd />
          </Link>
        </div>

        <div className="flex h-10 w-full items-center justify-between px-8 pb-3">
          <div className="">
            <Link
              href={"/sub-evacuation-center/evacuation-map-view"}
              className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 pl-5 text-xs transition-all duration-300 hover:opacity-75"
            >
              Map View <FaMapMarkerAlt className="text-[10px]" />
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <SortDropdown
              value={sortBy}
              onChange={(value) => setSortBy(value as SortBy)}
              options={[
                { label: "Evacuation name", value: "name" },
                { label: "Added by", value: "addedBy" },
                { label: "Capacity (High to Low)", value: "capacity_desc" },
                { label: "Capacity (Low to High)", value: "capacity_asc" },
                { label: "Vacancy (High to Low)", value: "vacancy_desc" },
                { label: "Vacancy (Low to High)", value: "vacancy_asc" },
                { label: "Evacuees (High to Low)", value: "evacuees_desc" },
                { label: "Evacuees (Low to High)", value: "evacuees_asc" },
              ]}
            />

            <FilteringEvacuation
              selectedBarangay={barangay}
              selectedStatus={status}
              onBarangayChange={setBarangay}
              onStatusChange={setStatus}
            />
          </div>

          <div className="flex items-center gap-2">
            <IoStatsChart className="text-xl" />

            <Select
              value={styling}
              onValueChange={(value) => setStyling(value)}
            >
              <SelectTrigger className="border-dark-blue/50 focus:border-dark-blue h-10 w-[130px] rounded-sm border text-xs shadow-none outline-none dark:border-gray-500/50 dark:bg-transparent">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>

              <SelectContent className="dark:bg-light-black bg-light-blue text-xs">
                {allStyles.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="data-[highlighted]:bg-dark-blue/20 text-xs dark:data-[highlighted]:text-white"
                  >
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="scrollBar grid h-[82vh] grid-cols-2 gap-7 overflow-auto px-8 pt-5 pb-20">
          {data?.length === 0 ? (
            <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center gap-2">
              <AiFillFolderOpen className="text-dark-blue text-4xl" />
              <p>No Evacuations Centers Found</p>
              <Link
                href={"/sub-evacuation-center/add-evac-form"}
                className="text-dark-blue cursor-pointer text-sm underline underline-offset-8 transition-all duration-300 hover:opacity-80"
              >
                Add Evacuation Centers
              </Link>
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <p className="absolute top-1/2 left-1/2 -translate-1/2 text-sm text-gray-500">
              No results found.
            </p>
          ) : (
            filteredAndSorted.map((evac) => (
              <EvacuationCard
                key={evac.id}
                id={evac.id}
                title={evac.name}
                location={evac.location}
                contact_person={evac.contact_person}
                contact_number={evac.contact_number}
                capacity={evac.capacity}
                evacuees={evac.current_evacuees ?? 0}
                chartStyle={styling}
                created_by={evac.created_by}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
