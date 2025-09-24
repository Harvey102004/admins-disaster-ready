"use client";

import { DisasterCard } from "@/components/cards/AdvisoryCards";
import { SearchInput } from "@/components/Inputs";
import { useState, useMemo, useEffect } from "react";
import { DisasterUpdatesSkeleton } from "@/components/skeleton/Skeleton-update-news";
import {
  FilteringDisaster,
  SortDropdown,
} from "@/components/sort-filter/update-news";
import { Skeleton } from "@/components/ui/skeleton";
import { getDisaster } from "@/server/api/advisories";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AiFillFolderOpen } from "react-icons/ai";

import {
  filterDisasterData,
  sortDisasterData,
  type SortBy,
} from "@/lib/sort-filter-update-news";

export default function DisasterUpdates() {
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [filterBrgy, setFilterBrgy] = useState("default");
  const [filterDate, setFilterDate] = useState("all");
  const [filterDisaster, setFilterDisaster] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setCurrentUser(parsed.barangay);
      } catch (e) {
        console.error("Invalid JSON sa localStorage:", e);
      }
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["disasterUpdates"],
    queryFn: getDisaster,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const filteredAndSorted = useMemo(() => {
    const filtered = filterDisasterData(
      data ?? [],
      filterDisaster,
      filterBrgy,
      filterDate,
    );

    const searched = filtered.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    return sortDisasterData(searched, sortBy);
  }, [data, sortBy, filterBrgy, filterDate, filterDisaster, searchText]);

  if (isLoading) {
    return (
      <>
        <div className="w-ful h-14 px-8">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="scrollBar grid max-h-[80vh] grid-cols-3 gap-7 overflow-auto px-8 pt-5 pb-20">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <DisasterUpdatesSkeleton key={index} />
            ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <p>Error fetching disaster updates</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <SortDropdown
            value={sortBy}
            onChange={(value) => setSortBy(value as SortBy)}
            options={[
              {
                label: "Default",
                value: "default",
              },
              {
                label: "Title",
                value: "title",
              },
              {
                label: "Added by",
                value: "added_by",
              },
              {
                label: "Disaster type",
                value: "disasterType",
              },
              {
                label: "Date & Time",
                value: "dateTime",
              },
            ]}
          />

          <FilteringDisaster
            selectedBrgy={filterBrgy}
            onBrgyChange={setFilterBrgy}
            selectedDate={filterDate}
            onDateChange={setFilterDate}
            selectedDisasterType={filterDisaster}
            onDisasterTypeChange={setFilterDisaster}
          />
        </div>

        <SearchInput
          classname="min-w-[300px]"
          value={searchText}
          onchange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title..."
        />
      </div>{" "}
      <div className="scrollBar grid max-h-[80vh] grid-cols-3 gap-7 overflow-auto px-8 pt-5 pb-20">
        {data?.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center gap-2">
            <AiFillFolderOpen className="text-dark-blue text-4xl" />
            <p>No Disaster Updates Found</p>
            <Link
              href={"disaster-updates/add-disaster-form"}
              className="text-dark-blue cursor-pointer text-sm underline underline-offset-8 transition-all duration-300 hover:opacity-80"
            >
              Add Disaster Updates
            </Link>
          </div>
        ) : filteredAndSorted && filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((item) => (
            <DisasterCard
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image_url}
              disasterType={item.disaster_type}
              desc={item.details}
              addedBy={item.added_by}
              dateTime={item.date_time}
              currentUser={currentUser ?? ""}
            />
          ))
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-1/2 text-sm text-gray-500">
            No results found.
          </p>
        )}
      </div>
    </div>
  );
}
