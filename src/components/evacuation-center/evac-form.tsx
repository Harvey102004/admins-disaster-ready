"use client";

import { FaHouseCircleCheck, FaUsers, FaUser, FaPhone } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { HiOutlineX, HiLocationMarker } from "react-icons/hi";
import { PiUsersFourFill } from "react-icons/pi";

import { EvacuationCenterProps } from "../../../types";

import Loader from "@/components/loading";
import {
  CompleteFormAlert,
  EditNotChange,
  SuccessPostEvac,
} from "@/components/pop-up";

import dynamic from "next/dynamic";
import gsap from "gsap";
import axios from "axios";

import { useState, useEffect } from "react";

const EvacuationMap = dynamic(
  () => import("@/components/evacuation-center/evacuationMap"),
  {
    ssr: false,
  },
);

export const EvacForm = ({
  onclose,
  triggerRefresh,
}: {
  onclose: () => void;
  triggerRefresh: () => void;
}) => {
  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<EvacuationCenterProps>({
    evac_name: "",
    evac_capacity: 0,
    evac_location: "",
    evac_evacuees: 0,
    evac_contact_person: "",
    evac_contact_number: "",
    lat: null,
    long: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const isNumberField = name === "evac_capacity" || name === "evac_evacuees";

    if (isNumberField) {
      if (value === "") {
        setFormData((prev) => ({
          ...prev,
          [name]: "",
        }));
        return;
      }

      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) return;

      if (name === "evac_capacity" && parsed > 5000) return;
      if (
        name === "evac_evacuees" &&
        parsed > (Number(formData.evac_capacity) || 0)
      )
        return;

      setFormData((prev) => ({
        ...prev,
        [name]: parsed,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      evac_name,
      evac_location,
      evac_capacity,
      evac_evacuees,
      evac_contact_person,
      evac_contact_number,
      lat,
      long,
    } = formData;

    const isFormValid =
      evac_name !== "" &&
      evac_location !== "" &&
      evac_capacity !== null &&
      evac_evacuees !== null &&
      evac_contact_person !== "" &&
      evac_contact_number !== "" &&
      lat !== null &&
      long !== null;

    if (isFormValid) {
      try {
        setisLoading(true);

        await axios.post(
          "http://localhost/Disaster-backend/controllers/evacuationCenterController.php",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        setisPosted(true);
        triggerRefresh();
        setTimeout(() => {
          setisPosted(false);
          onclose();
          setFormData({
            evac_name: "",
            evac_capacity: 0,
            evac_location: "",
            evac_evacuees: 0,
            evac_contact_person: "",
            evac_contact_number: "",
            lat: null,
            long: null,
          });
        }, 1800);
      } catch (err) {
        console.error(err);
      } finally {
        setisLoading(false);
      }
    } else {
      setisComplete(true);
      setTimeout(() => {
        setisComplete(false);
      }, 1500);
    }
  };

  // ------------- GSAP ANIMATION -------------- //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isComplete, isPosted]);
  return (
    <div className="bg-itim/70 fixed inset-0 z-50 flex items-center justify-center">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {isPosted && (
        <div className="popUp absolute top-8 z-50">
          <SuccessPostEvac text=" Evacuation center added successfully." />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[1000px] flex-col gap-8 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={() => onclose()}
        />

        <div className="border-dark-blue/50 mx-auto flex w-full items-center justify-center gap-4 border-b pb-5 dark:border-gray-500/30">
          <FaHouseCircleCheck className="text-dark-blue text-2xl" />
          <h2>Add Evacuation Center</h2>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-1 flex-col justify-evenly">
            <div className="flex items-center justify-between gap-5">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <GoHomeFill className="text-dark-blue text-lg" />
                  <p className="text-xs">Evacuation Center name</p>
                </div>
                <input
                  type="text"
                  name="evac_name"
                  autoComplete="off"
                  onChange={handleChange}
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
                  onChange={handleChange}
                  value={
                    formData.evac_capacity === 0 ? "" : formData.evac_capacity
                  }
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Capacity maximum of 5000"
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
                  onChange={handleChange}
                  autoComplete="off"
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
                  name="evac_evacuees"
                  onChange={handleChange}
                  value={formData.evac_evacuees || ""}
                  min={0}
                  max={formData.evac_capacity || 0}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Number of evacuees"
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
                  onChange={handleChange}
                  autoComplete="off"
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
                  type="tel"
                  name="evac_contact_number"
                  onChange={handleChange}
                  pattern="^09\d{9}$"
                  maxLength={11}
                  autoComplete="off"
                  value={formData.evac_contact_number ?? ""}
                  className="focus:border-dark-blue dark:focus:border-dark-blue/60 border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-[11px] dark:border-gray-500/30"
                  placeholder="Enter contact person number"
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <HiLocationMarker className="text-dark-blue text-lg" />
              <p className="text-xs">Pin Location on Map</p>
            </div>

            {/* Map Component */}
            <div className="h-[300px] w-full overflow-hidden rounded-lg shadow-xl">
              <EvacuationMap
                lat={formData.lat || 14.17}
                lng={formData.long || 121.2436}
                onChange={({ lat, lng }) =>
                  setFormData((prev) => ({ ...prev, lat, long: lng }))
                }
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Adding...
            </span>
          ) : (
            "Add Evacuation Center"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------- CONFIRMATION EDIT COMPONENT ------------ //

const ConfirmationEdit = ({
  onUpdate,
  oncancel,
}: {
  onUpdate: (e: React.FormEvent) => Promise<void>;
  oncancel: () => void;
}) => {
  return (
    <div className="dark:bg-light-black/90 flex flex-col items-center justify-center gap-5 rounded-md border bg-blue-400/70 p-10 backdrop-blur-sm">
      <p className="text-center text-sm leading-7 text-nowrap">
        Are you sure you want to Update this Evacuation Center?
      </p>
      <div className="text-puti flex gap-3 text-sm">
        <button
          type="submit"
          className="bg-dark-blue cursor-pointer rounded-sm px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={onUpdate}
        >
          Yes
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-sm bg-red-500 px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={oncancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

export const EvacFormEdit = ({
  onclick,
  id,
  triggerRefresh,
}: {
  id: string;
  onclick: () => void;
  triggerRefresh: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: 0,
    current_evacuees: 0,
    contact_person: "",
    contact_number: "",
    lat: 0,
    long: 0,
  });

  const [originalData, setOriginalData] = useState(formData);

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isEditOpen, setisEditOpen] = useState<boolean>(false);
  const [isNotChange, setisNotChange] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvacDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?id=${id}`,
        );
        const data = response.data;

        const updatedForm = {
          name: data.name || "",
          location: data.location || "",
          capacity: Number(data.capacity || 0),
          current_evacuees: Number(data.current_evacuees || 0),
          contact_person: data.contact_person || "",
          contact_number: data.contact_number || "",
          lat: Number(data.lat || 0),
          long: Number(data.long || 0),
        };

        setFormData(updatedForm);
        setOriginalData(updatedForm);
      } catch (error) {
        console.error("Failed to fetch evac data", error);
      }
    };

    fetchEvacDetails();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "current_evacuees" ? parseInt(value || "0", 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.contact_person.trim() === "" ||
      formData.contact_number.trim() === ""
    ) {
      setisEditOpen(false);
      setisComplete(true);
      setTimeout(() => setisComplete(false), 1800);
      return;
    }

    const isFormUnchanged = () => {
      return (
        formData.current_evacuees === originalData.current_evacuees &&
        formData.contact_person === originalData.contact_person &&
        formData.contact_number === originalData.contact_number
      );
    };

    if (isFormUnchanged()) {
      setisEditOpen(false);
      setisNotChange(true);
      setTimeout(() => setisNotChange(false), 1800);
      return;
    }

    try {
      setisLoading(true);

      await axios.post(
        `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?id=${id}`,
        {
          _method: "PUT",
          ...formData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setisPosted(true);
      setisEditOpen(false);
      setTimeout(() => {
        setisPosted(false);
        onclick();
        triggerRefresh();
      }, 1800);
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setisLoading(false);
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
  }, [isComplete, isPosted, isEditOpen]);

  return (
    <div className="bg-itim/70 fixed inset-0 z-50 flex items-center justify-center">
      {isNotChange && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <EditNotChange />
        </div>
      )}
      {isComplete && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <CompleteFormAlert />
        </div>
      )}
      {isPosted && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <SuccessPostEvac text=" Evacuation center  successfully edited." />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-8 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={onclick}
        />

        <div className="border-dark-blue/50 mx-auto flex w-full items-center justify-center gap-4 border-b pb-5 dark:border-gray-500/30">
          <FaHouseCircleCheck className="text-dark-blue text-2xl" />
          <h2>Edit Evacuation Center</h2>
        </div>

        <p className="mx-auto mb-4 w-[80%] text-center text-xs">
          <span className="font-semibold text-red-500">Note:</span> Only the
          number of evacuees, contact person name, and contact number can be
          edited.
        </p>

        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="location" value={formData.location} />
        <input type="hidden" name="capacity" value={formData.capacity} />
        <input type="hidden" name="lat" value={formData.lat} />
        <input type="hidden" name="long" value={formData.long} />

        <input
          type="number"
          name="current_evacuees"
          value={
            formData.current_evacuees === 0 ? "" : formData.current_evacuees
          }
          min={0}
          max={formData.capacity}
          onFocus={(e) => {
            if (e.target.value === "0") e.target.value = "";
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setFormData((prev) => ({ ...prev, current_evacuees: 0 }));
            }
          }}
          onChange={(e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value)) value = 0;
            if (value > formData.capacity) value = formData.capacity;
            if (value < 0) value = 0;

            setFormData((prev) => ({
              ...prev,
              current_evacuees: value,
            }));
          }}
          className="dark:bg-light-black w-full border border-gray-300 px-4 py-2 text-sm outline-none dark:border-gray-500"
        />

        <div>
          <div className="mb-2 flex items-center gap-3">
            <FaUser className="text-dark-blue" />
            <p className="text-xs">Contact person</p>
          </div>
          <input
            type="text"
            name="contact_person"
            value={formData.contact_person}
            autoComplete="off"
            onChange={handleChange}
            className="dark:bg-light-black w-full border border-gray-300 px-4 py-2 text-sm outline-none dark:border-gray-500"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-3">
            <FaPhone className="text-dark-blue" />
            <p className="text-xs">Contact number</p>
          </div>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            maxLength={11}
            autoComplete="off"
            pattern="^09\d{9}$"
            className="dark:bg-light-black w-full border border-gray-300 px-4 py-2 text-sm outline-none dark:border-gray-500"
          />
        </div>

        <button
          type="button"
          disabled={isEditOpen || isLoading}
          onClick={() => setisEditOpen(true)}
          className={`bg-dark-blue text-puti mt-4 rounded-md border py-3 text-sm transition-all duration-300 ${
            isEditOpen || isLoading
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>

        {isEditOpen && (
          <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
            <ConfirmationEdit
              oncancel={() => setisEditOpen(false)}
              onUpdate={handleSubmit}
            />
          </div>
        )}
      </form>
    </div>
  );
};
