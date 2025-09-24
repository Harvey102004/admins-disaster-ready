"use client";

import { AiFillFolderOpen } from "react-icons/ai";

import {
  filterWeatherData,
  sortWeatherData,
} from "@/lib/sort-filter-update-news";
import type { SortBy } from "@/lib/sort-filter-update-news";

import { WeatherCards } from "@/components/cards/AdvisoryCards";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";

import { getWeather } from "@/server/api/advisories";

import { WeatherAdvisorySkeleton } from "@/components/skeleton/Skeleton-update-news";

import Link from "next/link";

import {
  SortDropdown,
  FilteringWeather,
} from "@/components/sort-filter/update-news";
import { SearchInput } from "@/components/Inputs";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeatherAdvisory() {
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [filterBrgy, setFilterBrgy] = useState("default");
  const [filterDate, setFilterDate] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["weatherAdvisory"],
    queryFn: getWeather,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

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
  const filteredAndSorted = useMemo(() => {
    const filtered = filterWeatherData(data ?? [], filterBrgy, filterDate);

    const searched = filtered.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()),
    );

    return sortWeatherData(searched, sortBy);
  }, [data, sortBy, filterBrgy, filterDate, searchText]);

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
              <WeatherAdvisorySkeleton key={index} />
            ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center">
        <p>Error fetching weather advisory</p>
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
                label: "Date & Time",
                value: "dateTime",
              },
            ]}
          />

          <FilteringWeather
            selectedBrgy={filterBrgy}
            onBrgyChange={setFilterBrgy}
            selectedDate={filterDate}
            onDateChange={setFilterDate}
          />
        </div>

        <SearchInput
          value={searchText}
          onchange={(e) => setSearchText(e.target.value)}
          placeholder="Search by title..."
          classname="min-w-[300px]"
        />
      </div>

      <div className="scrollBar grid max-h-[80vh] grid-cols-3 gap-7 overflow-auto px-8 pt-5 pb-20">
        {data?.length === 0 ? (
          <div className="absolute top-1/2 left-1/2 flex w-full -translate-1/2 flex-col items-center justify-center gap-2">
            <AiFillFolderOpen className="text-dark-blue text-4xl" />
            <p>No Weather Advisory Found</p>
            <Link
              href={"weather-advisory/add-weather-form"}
              className="text-dark-blue cursor-pointer text-sm underline underline-offset-8 transition-all duration-300 hover:opacity-80"
            >
              Add Weather Advisory
            </Link>
          </div>
        ) : filteredAndSorted && filteredAndSorted.length > 0 ? (
          filteredAndSorted?.map((item) => (
            <WeatherCards
              key={item.id}
              id={item.id}
              title={item.title}
              desc={item.details}
              dateTime={item.date_time}
              addedBy={item.added_by}
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
