"use client";

import { FaPhone } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function SubAdminBarangayContact() {
  const router = useRouter();

  return (
    <>
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 flex-col items-center justify-center gap-3">
        <FaPhone className="text-dark-blue text-2xl" />
        <p className="text-center">
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
    </>
  );
}
