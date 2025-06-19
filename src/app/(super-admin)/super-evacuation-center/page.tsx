"use client";

import { MdOutlineAdd } from "react-icons/md";
import { FaHouseCircleCheck, FaUsers, FaUser, FaPhone } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { HiOutlineX, HiLocationMarker } from "react-icons/hi";
import { PiUsersFourFill } from "react-icons/pi";

import { useState } from "react";

import SearchInput from "@/components/search-input";
import { EvacuationCenterProps } from "../../../../types";

export default function SuperAdminEvacuationCenter() {
  const [search, setSearch] = useState<string>("");

  const [evaucations, setEvaucations] = useState([]);

  const [isEvacOpen, setisEvacOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<EvacuationCenterProps>({
    evac_name: "",
    evac_capacity: 0,
    evac_location: "",
    evac_evacuees: 0,
    evac_contact_person: "",
    evac_contact_number: "",
  });

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

      {isEvacOpen && (
        <div className="bg-itim/70 fixed inset-0 z-50 flex items-center justify-center">
          <form className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-8 rounded-xl border px-10 py-8 backdrop-blur-sm">
            <HiOutlineX
              className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
              onClick={() => setisEvacOpen(false)}
            />

            <div className="border-dark-blue/50 mx-auto flex w-full items-center justify-center gap-4 border-b pb-5 dark:border-gray-500/30">
              <FaHouseCircleCheck className="text-dark-blue text-2xl" />
              <h2>Add Evacuation Center</h2>
            </div>

            <div className="mt-5 flex items-center justify-between gap-5">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <GoHomeFill className="text-dark-blue text-lg" />
                  <p className="text-xs">Evacuation Center name</p>
                </div>
                <input
                  type="text"
                  name="evac_name"
                  value={formData.evac_name ?? ""}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter Evacuation center name"
                />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <FaUsers className="text-dark-blue text-lg" />
                  <p className="text-xs">Capacity</p>
                </div>
                <input
                  type="number"
                  name="evac_capacity"
                  value={formData.evac_capacity ?? 0}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter Evacuation center capacity"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <HiLocationMarker className="text-dark-blue text-lg" />
                  <p className="text-xs">Location</p>
                </div>
                <input
                  type="text"
                  name="evac_location"
                  value={formData.evac_location ?? ""}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter Evacuation center location"
                />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <PiUsersFourFill className="text-dark-blue text-lg" />
                  <p className="text-xs">Current number of evacuees</p>
                </div>
                <input
                  type="number"
                  name="evac_contact_person"
                  value={formData.evac_evacuees ?? 0}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter current number of evacuees"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <FaUser className="text-dark-blue" />
                  <p className="text-xs">Contact person</p>
                </div>
                <input
                  type="text"
                  name="evac_contact_person"
                  value={formData.evac_contact_person ?? ""}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <FaPhone className="text-dark-blue" />
                  <p className="text-xs">Contact person number #</p>
                </div>
                <input
                  type="number"
                  name="evac_contact_number"
                  value={formData.evac_contact_number ?? ""}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter contact person number"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-4 text-sm transition-all hover:opacity-80"
            >
              Add Evacuation Center
            </button>
          </form>
        </div>
      )}
    </>
  );
}
