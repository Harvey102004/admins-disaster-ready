"use client";

import Image from "next/image";
import { getBrgyContacts } from "@/server/api/brgyContacts";
import { BarangayContact } from "@/app/(sub-admin)/sub-brgy-contact/page";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaFacebook, FaPhone, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { IoCloseCircleSharp } from "react-icons/io5";
import MapDetails from "@/components/maps/map-details";

export default function SuperAdminBarangayContact() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedContact, setSelectedContact] =
    useState<BarangayContact | null>(null);

  const [isMapOpen, setIsMapOpen] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["barangayContacts"],
    queryFn: getBrgyContacts,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden pl-8 transition-all duration-300">
      <div className="p-6">
        <div className="mb-3 flex items-center justify-center gap-3 border-b pb-4">
          <h1 className="text-dark-blue text-lg font-bold">
            All Barangay Contact Information
          </h1>
        </div>
        <div className="scrollBar relative overflow-auto">
          <div className="">
            <div className="flex h-[87vh] flex-wrap items-start gap-x-10">
              {isLoading ? (
                <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                  Loading...
                </p>
              ) : (
                data.map((item: BarangayContact) => (
                  <div
                    key={item.id}
                    className="group relative mt-7 w-[330px] cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 dark:border-gray-700 dark:bg-gray-900"
                    onClick={() => {
                      setSelectedContact(item);
                      setIsDetailOpen(true);
                    }}
                  >
                    {/* Logo + Name */}
                    <div className="flex flex-col items-center justify-center px-4 py-6">
                      <Image
                        src={`/logos/${item.barangay_name
                          ?.toLowerCase()
                          .replace(/\s+/g, "-")}-logo.png`}
                        height={90}
                        width={90}
                        alt={item.barangay_name}
                        className="mb-3 drop-shadow-md transition-all duration-500 group-hover:scale-90"
                      />

                      <h2 className="text-lg font-semibold tracking-wide text-gray-900 capitalize dark:text-gray-100">
                        {item.barangay_name
                          .replace(/-/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(" ")}
                      </h2>
                    </div>

                    {/* DETAILS PAG HINOVER (BABA LANG) */}
                    <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-60 group-hover:opacity-100">
                      <div className="flex flex-col items-center gap-2 px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex gap-8 px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex flex-col gap-3">
                            {/* Captain */}
                            <div className="flex items-center gap-2">
                              <FaUser />
                              <p className="flex flex-col text-xs leading-tight">
                                {item.captain_name || "N/A"}
                                <span className="mt-1 text-[10px] font-medium">
                                  Captain
                                </span>
                              </p>
                            </div>

                            {/* Secretary */}
                            <div className="flex items-center gap-2">
                              <FaUser />
                              <p className="flex flex-col text-xs leading-tight">
                                {item.secretary_name || "N/A"}
                                <span className="mt-1 text-[10px] font-medium">
                                  Secretary
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            {/* Contact */}
                            <div className="flex items-center gap-2">
                              <FaPhone />
                              <p className="flex flex-col text-xs leading-tight">
                                {item.contact_number || "N/A"}
                                <span className="mt-1 text-[10px] font-medium">
                                  Contact
                                </span>
                              </p>
                            </div>

                            {/* Landline */}
                            <div className="flex items-center gap-2">
                              <ImPhoneHangUp />
                              <p className="flex flex-col text-xs leading-tight">
                                {item.landline || "N/A"}
                                <span className="mt-1 text-[10px] font-medium">
                                  Landline
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs">Click to see full details</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {isDetailOpen && selectedContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black col relative max-h-[80vh] overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="relative mb-5 h-40 w-full bg-red-300">
                  <MapDetails
                    name={selectedContact.barangay_name}
                    lat={selectedContact.lat}
                    lng={selectedContact.long}
                  />

                  {/* Fade overlay  */}
                  <div className="pointer-events-none absolute bottom-0 left-0 z-40 h-full w-full bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="absolute top-30 left-1/2 z-50 mb-5 flex -translate-x-1/2 items-center gap-4">
                  <Image
                    src={`/logos/${selectedContact.barangay_name.toLowerCase()}-logo.png`}
                    height={80}
                    width={80}
                    alt={selectedContact.barangay_name}
                  />
                </div>

                <h1 className="mb-4 border-b pt-8 pb-5 text-center text-xl font-semibold">
                  Barangay{" "}
                  {selectedContact.barangay_name
                    .replace(/-/g, " ")
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                    )
                    .join(" ")}
                </h1>

                <div className="mx-12 mt-10 mb-12 flex items-center gap-16">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.captain_name || "N/A"}</p>
                        <p className="text-xs text-nowrap">Barangay Captain</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUser className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.secretary_name || "N/A"}</p>
                        <p className="text-xs text-nowrap">
                          Barangay Secretary
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <MdEmail className="text-dark-blue text-xl" />
                      <div>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="hover:underline"
                        >
                          {selectedContact.email || "N/A"}
                        </a>
                        <p className="text-xs text-nowrap">Email Address</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaFacebook className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <a
                          href={selectedContact.facebook_page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark-blue transition-all duration-300 hover:opacity-85"
                        >
                          Visit Facebook Page
                        </a>
                        <p className="text-xs text-nowrap">Facebook</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.contact_number || "N/A"}</p>
                        <p className="text-xs text-nowrap">Contact Number</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ImPhoneHangUp className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.landline || "N/A"}</p>
                        <p className="text-xs text-nowrap">Landline</p>
                      </div>
                    </div>
                  </div>
                </div>

                <IoCloseCircleSharp
                  className="absolute top-5 right-5 cursor-pointer text-xl text-black"
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsMapOpen(false);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
