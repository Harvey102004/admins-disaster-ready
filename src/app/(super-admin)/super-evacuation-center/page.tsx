"use client";

import { MdOutlineAdd } from "react-icons/md";
import { FaHouseCircleCheck, FaFilter } from "react-icons/fa6";

import { useState, useEffect } from "react";

import { GetEvacuationProps } from "../../../../types";

import SearchInput from "@/components/search-input";
import {
  EvacForm,
  EvacFormEdit,
} from "@/components/evacuation-center/evac-form";
import { EvacuationCard } from "@/components/evacuation-center/evac-card";
import EvacDetails from "@/components/evacuation-center/evac-details";

import axios from "axios";
import dynamic from "next/dynamic";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiOutlineX } from "react-icons/hi";

const EvacuationMapList = dynamic(
  () => import("@/components/evacuation-center/evacuationMapList"),
  { ssr: false },
);

export default function SuperAdminEvacuationCenter() {
  const [search, setSearch] = useState<string>("");

  const [evaucations, setEvacuations] = useState<GetEvacuationProps[]>([]);

  const [isEvacOpen, setisEvacOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isMapOpen, setisMapOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>("default");

  const sortedEvacuations = [...evaucations].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "capacity") {
      return Number(b.capacity) - Number(a.capacity);
    }

    if (sortBy === "evacuees") {
      return Number(b.current_evacuees) - Number(a.current_evacuees);
    }

    if (sortBy === "vacancy") {
      const aVacancy = Number(a.capacity) - Number(a.current_evacuees);
      const bVacancy = Number(b.capacity) - Number(b.current_evacuees);
      return bVacancy - aVacancy;
    }

    return 0;
  });

  const filteredEvacuation = sortedEvacuations.filter((evac) =>
    evac.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const fetchEvacuation = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get<GetEvacuationProps[]>(
          "http://localhost/Disaster-backend/controllers/evacuationCenterController.php",
        );

        setEvacuations(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvacuation();
  }, [triggerRefresh]);

  const [detailsId, setDetailsId] = useState<string>();

  return (
    <>
      <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
        <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>

        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <h1 className="text-dark-blue text-xl font-bold">
            Evacuation Center
          </h1>
        </div>

        <div className="mt-6 flex items-center justify-between gap-6 border-b pb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-lg" />
              <p className="text-sm">Sort By :</p>
            </div>

            <Select onValueChange={(value) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="capacity">
                  Capacity ( High to Low )
                </SelectItem>
                <SelectItem value="evacuees">
                  Evacuees ( High to Low )
                </SelectItem>
                <SelectItem value="vacancy">Vacancy ( High to Low )</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <SearchInput
              value={search}
              onchange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
          </div>

          <div className="">
            <button
              className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs transition-all duration-300 hover:opacity-80"
              onClick={() => setisEvacOpen(true)}
            >
              Add Evacuation Center <MdOutlineAdd />
            </button>
          </div>
        </div>

        <div className="scrollBar relative flex h-[70vh] flex-wrap justify-start gap-5 overflow-auto px-6 pt-4">
          {evaucations.length === 0 && (
            <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center gap-2">
              <FaHouseCircleCheck className="text-dark-blue text-4xl" />
              <p> No Evacuation Center Found</p>
              <button
                className="text-dark-blue cursor-pointer text-xs underline underline-offset-8 hover:opacity-70"
                onClick={() => setisEvacOpen(true)}
              >
                Add Evacuation Center
              </button>
            </div>
          )}

          {evaucations.length > 0 && (
            <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start justify-start gap-12">
              {filteredEvacuation.length === 0 ? (
                <div className="absolute top-1/2 left-1/2 -translate-1/2 items-center justify-center">
                  <p>No Evacuation Center Found</p>
                </div>
              ) : (
                filteredEvacuation.map((evac) => (
                  <EvacuationCard
                    key={evac.id}
                    name={evac.name}
                    location={evac.location}
                    capacity={evac.capacity}
                    current_evacuees={evac.current_evacuees}
                    onclick={() => {
                      setIsDetailsOpen(true);
                      setDetailsId(evac.id);
                    }}
                  />
                ))
              )}
            </div>
          )}

          {filteredEvacuation.length !== 0 && (
            <div className="my-7 flex w-full items-center justify-center">
              <button
                className="bg-dark-blue text-puti cursor-pointer rounded-sm px-7 py-3 text-xs transition-all duration-300 hover:opacity-75"
                onClick={() => setisMapOpen(true)}
              >
                Open Map View
              </button>
            </div>
          )}
        </div>
      </div>

      {isEvacOpen && (
        <EvacForm
          onclose={() => setisEvacOpen(false)}
          triggerRefresh={() => setTriggerRefresh((prev) => prev + 1)}
        />
      )}

      {isDetailsOpen && (
        <EvacDetails
          onclick={() => setIsDetailsOpen(false)}
          id={detailsId ?? ""}
          onEdit={() => {
            setIsEditOpen(true);
            setIsDetailsOpen(false);
          }}
          triggerRefresh={() => setTriggerRefresh((prev) => prev + 1)}
        />
      )}

      {isMapOpen && (
        <div className="bg-itim/40 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
          <div
            className="absolute top-5 right-5 cursor-pointer text-3xl text-white"
            onClick={() => setisMapOpen(false)}
          >
            <HiOutlineX />
          </div>
          <EvacuationMapList evacCenters={evaucations} />
        </div>
      )}

      {isEditOpen && (
        <EvacFormEdit
          onclick={() => setIsEditOpen(false)}
          id={detailsId ?? ""}
          triggerRefresh={() => setTriggerRefresh((prev) => prev + 1)}
        />
      )}
    </>
  );
}
