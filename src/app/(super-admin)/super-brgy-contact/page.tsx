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
        <div className="scrollBar relative max-h-[85vh] overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-background sticky top-0 z-50">
              <tr>
                <th className="p-2 text-left font-semibold">Barangay</th>
                <th className="p-2 text-left font-semibold">Captain</th>
                <th className="p-2 text-left font-semibold">Secretary</th>
                <th className="p-2 text-left font-semibold">Contact no.</th>
                <th className="p-2 text-left font-semibold">Landline</th>
                <th className="p-2 text-left font-semibold">Email</th>
                <th className="p-2 text-left font-semibold">Facebook</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                data.map((item: BarangayContact) => (
                  <tr
                    key={item.id}
                    className="hover:bg-dark-blue/5 cursor-pointer border-b text-sm"
                    onClick={() => {
                      setSelectedContact(item);
                      setIsDetailOpen(true);
                    }}
                  >
                    <td className="flex items-center gap-4 p-2 capitalize">
                      <Image
                        src={`/logos/${item.barangay_name.toLowerCase()}-logo.png`}
                        height={30}
                        width={30}
                        alt={item.barangay_name}
                      />
                      {item.barangay_name}
                    </td>
                    <td className="p-2">{item.captain_name}</td>
                    <td className="p-2">{item.secretary_name}</td>
                    <td className="p-2">{item.contact_number}</td>
                    <td className="p-2">{item.landline}</td>
                    <td className="max-w-[150px] truncate p-2">
                      <a href={`mailto:${item.email}`}>{item.email}</a>
                    </td>
                    <td className="max-w-[150px] truncate p-2">
                      <a
                        href={item.facebook_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 transition-all duration-300 hover:underline hover:underline-offset-8 hover:opacity-85"
                      >
                        Facebook Page
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {isDetailOpen && selectedContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black col relative max-h-[80vh] overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="mb-5 h-40 w-full bg-red-300">
                  <MapDetails
                    name={selectedContact.barangay_name}
                    lat={selectedContact.lat}
                    lng={selectedContact.long}
                  />
                </div>

                <div className="absolute top-30 left-1/2 mb-5 flex -translate-x-1/2 items-center gap-4">
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

                <div className="mx-12 mb-12 flex items-center gap-16">
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

                    <div className="flex items-center gap-3">
                      <FaPhone className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.contact_number || "N/A"}</p>
                        <p className="text-xs text-nowrap">Contact Number</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <ImPhoneHangUp className="text-dark-blue text-xl" />
                      <div className="text-lg">
                        <p>{selectedContact.landline || "N/A"}</p>
                        <p className="text-xs text-nowrap">Landline</p>
                      </div>
                    </div>

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
