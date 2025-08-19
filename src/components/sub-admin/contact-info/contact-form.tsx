"use client";

import { useState, useEffect } from "react";
import { TextInput, FacebookInput } from "./inputs";
import { HiLocationMarker } from "react-icons/hi";
import { FaUser, FaPhone } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { ImPhoneHangUp } from "react-icons/im";
import { GoHomeFill } from "react-icons/go";
import { SubContact } from "../../../../types";

import { SuccessPostForm, CompleteFormAlert } from "@/components/pop-up";

import dynamic from "next/dynamic";
import axios from "axios";
import gsap from "gsap";
import { RiErrorWarningFill } from "react-icons/ri";

const BrgyMap = dynamic(() => import("@/components/sub-admin/map"), {
  ssr: false,
});
export default function ContactInfoForm({ onclose }: { onclose: () => void }) {
  const [isMapTouched, setisMapTouched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notComplete, setNotComplete] = useState<boolean>(false);
  const [mapNotMove, setMapNotMove] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<SubContact>({
    barangay: "",
    email: "",
    captain: "",
    secretary: "",
    facebook: "",
    landline: "",
    contact: "",
    lat: 14.17,
    long: 121.241,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formValidation =
      formData.barangay.trim() === "" ||
      formData.email.trim() === "" ||
      formData.captain.trim() === "" ||
      formData.secretary.trim() === "" ||
      formData.facebook.trim() === "" ||
      formData.landline.trim() === "" ||
      formData.contact.trim() === "";

    if (formValidation) {
      setNotComplete(true);

      setTimeout(() => {
        setNotComplete(false);
      }, 1800);
      return;
    }

    if (!isMapTouched) {
      setMapNotMove(true);
      setTimeout(() => {
        setMapNotMove(false);
      }, 1800);
      return;
    }

    try {
      setIsLoading(true);

      await axios.post("API DITO", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 1800);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ------------- GSAP ANIMATION -------------- //

  useEffect(() => {
    gsap.fromTo(
      ".bounce",
      {
        opacity: 0,
        scale: 0,
        duration: 300,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.inOut",
      },
    );
  }, [isSubmitted, notComplete, mapNotMove]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 flex h-[75vh] justify-center gap-5"
    >
      <div className="mt-5 flex gap-5">
        <div className="flex flex-col gap-8">
          <div className="flex w-[250px] flex-col gap-2">
            <div className="flex items-center gap-2">
              <GoHomeFill className="text-dark-blue" />
              <label htmlFor="barangay " className="text-xs">
                Barangay *
              </label>
            </div>

            <div className="relative">
              <select
                name="barangay"
                id="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="border-dark-blue dark:bg-light-black relative w-full rounded border p-3 text-sm outline-none dark:border-gray-500/50"
              >
                <option value="">-- Select Barangay --</option>
                <option value="anos">Brgy. Anos</option>
                <option value="bambang">Brgy. Bambang</option>
                <option value="batong-malake">Brgy. Batong Malake</option>
                <option value="baybayin">Brgy. Baybayin</option>
                <option value="bagong-silang">Brgy. Bagong Silang</option>
                <option value="bayog">Brgy. Bayog</option>
                <option value="lalakay">Brgy. Lalakay</option>
                <option value="maahas">Brgy. Maahas</option>
                <option value="malinta">Brgy. Malinta</option>
                <option value="mayondon">Brgy. Mayondon</option>
                <option value="san-antonio">Brgy. San Antonio</option>
                <option value="tadlac">Brgy. Tadlac</option>
                <option value="tuntungin-putho">Brgy. Tuntungin-Putho</option>
                <option value="timugan">Brgy. Timugan</option>
              </select>
              <IoMdArrowDropdown className="text-dark-blue dark:text-puti pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xl" />
            </div>
          </div>

          <TextInput
            type="email"
            name="email"
            label="Email"
            onchange={handleChange}
            value={formData.email}
            placeholder="Enter brgy @email"
            icon={<MdEmail />}
          />

          <TextInput
            type="text"
            name="captain"
            label="Brgy Captain"
            onchange={handleChange}
            value={formData.captain}
            placeholder="Enter brgy captain"
            icon={<FaUser />}
          />

          <TextInput
            type="text"
            name="secretary"
            label="Brgy Secretary"
            onchange={handleChange}
            value={formData.secretary}
            placeholder="Enter brgy secretary"
            icon={<FaUser />}
          />
        </div>

        <div className="flex flex-col gap-8">
          <FacebookInput value={formData.facebook} onChange={handleChange} />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ImPhoneHangUp className="text-dark-blue" />
              <label htmlFor="landline" className="text-xs">
                Brgy Landline *
              </label>
            </div>
            <input
              type="tel"
              id="landline"
              name="landline"
              value={formData.landline}
              onChange={handleChange}
              placeholder="e.g. 0491234567"
              pattern="^(\d{7}|\d{3}-\d{3}-\d{4}|\d{10,11})$"
              autoComplete="off"
              className="border-dark-blue dark:bg-light-black w-[250px] rounded border p-3 text-sm outline-none placeholder:text-xs placeholder:text-gray-600 dark:border-gray-500/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FaPhone className="text-dark-blue text-sm" />
              <label htmlFor="contactNumber" className="text-xs">
                Brgy Contact Number *
              </label>
            </div>
            <input
              type="tel"
              id="contactNumber"
              onChange={handleChange}
              value={formData.contact}
              name="contact"
              pattern="^09\d{9}$"
              maxLength={11}
              autoComplete="off"
              className="border-dark-blue dark:bg-light-black w-[250px] rounded border p-3 text-sm outline-none placeholder:text-xs placeholder:text-gray-600 dark:border-gray-500/50"
              placeholder="Enter contact person number"
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="mt-5 mb-2 flex items-center gap-2">
          <HiLocationMarker className="text-dark-blue text-lg" />
          <p className="text-xs">Pin Location in map</p>
        </div>
        <div className="relative h-[360px] max-h-[360px] w-[500px] overflow-hidden rounded-lg shadow-2xl">
          {mapNotMove && (
            <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-x-1/2">
              <div className="flex h-16 items-center justify-center gap-2 rounded-md border border-red-500 bg-red-500/50 px-10 py-2 backdrop-blur-sm dark:bg-red-800/70">
                <RiErrorWarningFill className="text-2xl" />
                <p className="text-sm text-nowrap">Locate location in Map</p>
              </div>
            </div>
          )}
          <BrgyMap
            lat={Number(formData.lat ?? 14.17)}
            lng={Number(formData.long ?? 121.241)}
            onChange={({ lat, lng }) => {
              setisMapTouched(true);

              setFormData((prev) => ({
                ...prev,
                lat,
                long: lng,
              }));
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-5">
        <button
          type="submit"
          className="bg-dark-blue text-puti cursor-pointer rounded px-10 py-2 text-sm hover:opacity-75"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={onclose}
          className="text-puti cursor-pointer rounded bg-red-500 px-10 py-2 text-sm hover:opacity-75"
        >
          Close
        </button>
      </div>
    </form>
  );
}
