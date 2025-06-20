"use client";

import { MdOutlineAdd } from "react-icons/md";
import { FaHouseCircleCheck } from "react-icons/fa6";

import { useState } from "react";

import SearchInput from "@/components/search-input";
import { EvacForm } from "@/components/evacution-center/evac-form";

export default function SuperAdminEvacuationCenter() {
  const [search, setSearch] = useState<string>("");

  const [evaucations, setEvaucations] = useState([]);

  const [isEvacOpen, setisEvacOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
        <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>

        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <h1 className="text-dark-blue text-xl font-bold">
            Evacuation Center
          </h1>
        </div>

        <div className="mt-10 flex items-center justify-between gap-6 pb-8">
          <div className="">
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

        <div className="scrollBar relative flex h-[65vh] flex-wrap justify-start gap-5 overflow-auto px-6">
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
        </div>
      </div>

      {isEvacOpen && <EvacForm onclose={() => setisEvacOpen(false)} />}
    </>
  );
}
