"use client";

import ContactInfoForm from "@/components/sub-admin/contact-info/contact-form";
import { useState } from "react";
import { FaPhone } from "react-icons/fa6";

export default function SubAdminBarangayContact() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <>
      <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
        <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>

        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <h1 className="text-dark-blue text-xl font-bold">
            Contact Information
          </h1>
        </div>

        {!isFormOpen && (
          <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center justify-center gap-3">
            <FaPhone className="text-dark-blue text-2xl" />
            <p className="text-center">
              No contact info added yet <br /> Set up your barangay’s contact
              information
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="text-dark-blue text-sm underline underline-offset-8 transition-all duration-300 hover:opacity-75"
            >
              Add Contact Details
            </button>
          </div>
        )}

        {isFormOpen && (
          <div className="">
            <h2 className="mt-8 text-center text-sm">
              Please fill out the form below with your barangay's official
              contact information.
            </h2>
            <ContactInfoForm onclose={() => setIsFormOpen(false)} />
          </div>
        )}
      </div>
    </>
  );
}
