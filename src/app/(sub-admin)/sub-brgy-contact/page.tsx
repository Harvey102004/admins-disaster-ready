"use client";

import { useEffect, useState } from "react";
import {
  FaBook,
  FaChild,
  FaFacebook,
  FaPhone,
  FaUser,
  FaUsers,
} from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { getBrgyContacts } from "@/server/api/brgyContacts";
import { LiaEditSolid } from "react-icons/lia";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import Link from "next/link";
import dynamic from "next/dynamic";
import Loader from "@/components/loading";
import { FaFemale, FaMale } from "react-icons/fa";
import ProtectedRoute from "@/components/ProtectedRoutes";

const MapDetails = dynamic(() => import("@/components/maps/map-details"), {
  ssr: false,
});

export type BarangayContact = {
  id: string;
  barangay_name: string;
  email: string;
  captain_name: string;
  secretary_name: string;
  facebook_page: string;
  landline: string;
  contact_number: string;
  lat: number;
  long: number;
  total_male?: number;
  total_female?: number;
  total_families?: number;
  total_male_senior?: number;
  total_female_senior?: number;
  total_0_4_years?: number;
  source?: string;
};

export default function SubAdminBarangayContact() {
  const router = useRouter();
  const [contact, setContact] = useState<BarangayContact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        const barangayName = parsedUser.barangay;

        const contacts: BarangayContact[] = await getBrgyContacts();

        const found = contacts.find((c) => c.barangay_name === barangayName);

        if (found) {
          setContact(found);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center">
          <Loader />
        </div>
      </ProtectedRoute>
    );
  }

  if (!contact) {
    return (
      <ProtectedRoute>
        <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center justify-center gap-3">
          <FaPhone className="text-dark-blue text-2xl" />
          <p className="text-center leading-7 tracking-wide">
            No contact info added yet <br /> Set up your barangay’s contact
            information
          </p>
          <button
            onClick={() => router.push("/sub-brgy-contact/add-contact-form")}
            className="text-dark-blue text-sm underline underline-offset-8 transition-all duration-300 hover:opacity-75"
          >
            Add Contact Details
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-[85vh] justify-center gap-7">
        <div className="flex w-full flex-col gap-8">
          {/* Map Container */}
          <div className="relative h-60 w-full overflow-hidden rounded-lg shadow-lg">
            {/* Barangay Logo */}
            <div className="absolute top-1/2 left-20 z-50 h-35 w-35 -translate-y-1/2 overflow-hidden rounded-full">
              <Image
                src={`/logos/${contact.barangay_name.toLowerCase().replace(/\s+/g, "-")}-logo.png`}
                alt={`${contact.barangay_name} Logo`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Fade overlay  */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-40 h-full w-full bg-gradient-to-r from-black/70 to-transparent" />

            <MapDetails
              name={contact.barangay_name}
              lat={Number(contact.lat)}
              lng={Number(contact.long)}
            />
          </div>

          <div className="relative flex justify-center gap-10">
            <div className="flex gap-12">
              {/* Contact Details */}
              <div className="flex items-center gap-10">
                <div className="flex flex-col gap-10">
                  {/* Barangay Captain */}
                  <div className="flex items-center gap-3">
                    <FaUser className="text-dark-blue text-xl" />
                    <div className="text-lg">
                      <p>{contact.captain_name}</p>
                      <p className="text-xs text-nowrap">Barangay Captain</p>
                    </div>
                  </div>

                  {/* Barangay Secretary */}
                  <div className="flex items-center gap-3">
                    <FaUser className="text-dark-blue text-xl" />
                    <div className="text-lg">
                      <p>{contact.secretary_name}</p>
                      <p className="text-xs text-nowrap">Barangay Secretary </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <MdEmail className="text-dark-blue text-xl" />
                    <div className="text-lg">
                      <p>{contact.email}</p>
                      <p className="text-xs text-nowrap">Email </p>
                    </div>
                  </div>
                </div>

                <div className="10 flex flex-col gap-10">
                  {/* Facebook Page */}
                  <div className="flex items-center gap-3">
                    <FaFacebook className="text-dark-blue text-xl" />
                    <div className="items-center text-lg">
                      {contact.facebook_page ? (
                        <a
                          href={contact.facebook_page}
                          target="_blank"
                          className="text-blue-500 transition-all duration-300 hover:underline hover:underline-offset-8 hover:opacity-75"
                        >
                          Visit Facebook Page
                        </a>
                      ) : (
                        <span className="text-gray-500">No page available</span>
                      )}
                      <p className="text-xs whitespace-nowrap">Facebook Page</p>
                    </div>
                  </div>

                  {/* Landline */}
                  <div className="flex items-center gap-3">
                    <ImPhoneHangUp className="text-dark-blue text-xl" />
                    <div className="text-lg">
                      <p>{contact.landline}</p>
                      <p className="text-xs text-nowrap">Landline </p>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-dark-blue text-xl" />
                    <div className="text-lg">
                      <p>{contact.contact_number}</p>
                      <p className="text-xs text-nowrap">Contact Number </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Population Statistics */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-10 text-sm">
                  {/* Total Male */}
                  <div className="flex items-center gap-3">
                    <FaMale className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_male ?? 0}</p>
                      <p className="text-xs text-nowrap">Total Male</p>
                    </div>
                  </div>

                  {/* Total Female */}
                  <div className="flex items-center gap-3">
                    <FaFemale className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_female ?? 0}</p>
                      <p className="text-xs text-nowrap">Total Female</p>
                    </div>
                  </div>

                  {/* Total Families */}
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_families ?? 0}</p>
                      <p className="text-xs text-nowrap">Total Families</p>
                    </div>
                  </div>

                  {/* Male Seniors */}
                  <div className="flex items-center gap-3">
                    <FaMale className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_male_senior ?? 0}</p>
                      <p className="text-xs text-nowrap">Male Seniors</p>
                    </div>
                  </div>

                  {/* Female Seniors */}
                  <div className="flex items-center gap-3">
                    <FaFemale className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_female_senior ?? 0}</p>
                      <p className="text-xs text-nowrap">Female Seniors</p>
                    </div>
                  </div>

                  {/* Children 0-4 */}
                  <div className="flex items-center gap-3">
                    <FaChild className="text-dark-blue text-2xl" />
                    <div className="text-lg">
                      <p>{contact.total_0_4_years ?? 0}</p>
                      <p className="text-xs text-nowrap">Children (0-4 y/o)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Link */}
              <Link
                href={`/sub-brgy-contact/edit-contact-form/${contact.id}`}
                className="bg-dark-blue absolute -bottom-25 left-1/2 mt-4 flex w-max -translate-x-1/2 items-center gap-2 rounded-md px-6 py-3 text-sm text-white transition-all duration-300 hover:opacity-75"
              >
                <LiaEditSolid className="text-xl" />
                Edit Contact Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
