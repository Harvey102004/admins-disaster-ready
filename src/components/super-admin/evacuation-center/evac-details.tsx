"use client";

import { HiOutlineX } from "react-icons/hi";
import { FaHouseCircleCheck, FaUser, FaPhone } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { useState, useEffect } from "react";
import { LiaEditSolid } from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";
import { GetEvacDetails } from "../../../../types";
import axios from "axios";
import { DeleteSuccessfully } from "../../pop-up";
import { GoHomeFill } from "react-icons/go";

import gsap from "gsap";
import dynamic from "next/dynamic";

const EvacuationMapDetails = dynamic(
  () =>
    import("@/components/super-admin/evacuation-center/evacuationMapDetails"),
  {
    ssr: false,
  },
);

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const EvacuationBarChart = ({
  capacity,
  evacuees,
}: {
  capacity: number;
  evacuees: number;
}) => {
  const vacancy = capacity - evacuees || 0;

  const data = {
    labels: ["Capacity", "Vacancy", "Evacuees"],
    datasets: [
      {
        label: "Evacuation Stats",
        data: [capacity, vacancy, evacuees],
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: capacity,
        ticks: {
          precision: 0,
          callback: function (value: string | number) {
            return Number.isInteger(Number(value)) ? value : null;
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const DeletePopUp = ({
  ondelete,
  oncancel,
}: {
  ondelete: () => void;
  oncancel: () => void;
}) => {
  return (
    <div className="dark:bg-light-black/90 bg-dark-blue flex flex-col items-center justify-center gap-5 rounded-md border p-10 backdrop-blur-sm">
      <p className="text-puti text-center text-sm leading-7 text-nowrap">
        This action cannot be undone. <br /> Are you sure you want to delete
        this Evacuation Center?
      </p>
      <div className="text-puti flex gap-3 text-sm">
        <button
          className="dark:bg-dark-blue bg-light-blue text-itim dark:text-puti cursor-pointer rounded-sm px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={ondelete}
        >
          Yes
        </button>
        <button
          className="cursor-pointer rounded-sm bg-red-500 px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={oncancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default function EvacDetails({
  onclick,
  id,
  triggerRefresh,
  onEdit,
}: {
  id: string;
  onclick: () => void;
  triggerRefresh: () => void;
  onEdit: () => void;
}) {
  const [evacDetails, setEvacDetails] = useState<GetEvacDetails>();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [IsSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvacDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?&id=${id}`,
        );

        setEvacDetails(response.data);
      } catch (error) {}
    };

    fetchEvacDetails();
  }, []);

  const capacity = Number(evacDetails?.capacity ?? 0);
  const evacuees = Number(evacDetails?.current_evacuees ?? 0);
  const vacancy = capacity - evacuees;

  const getEvacuationStatus = () => {
    const occupancyRate = capacity === 0 ? 0 : (evacuees / capacity) * 100;

    if (occupancyRate === 100) {
      return { text: "Not available (Full)", color: "bg-red-500" };
    } else if (occupancyRate >= 86) {
      return { text: "Almost full", color: "bg-orange-500" };
    } else if (occupancyRate >= 51) {
      return { text: "Fair Occupancy", color: "bg-yellow-400" };
    } else {
      return { text: "Plenty of space", color: "bg-green-500" };
    }
  };

  const evacStatus = getEvacuationStatus();

  const handleDelete = (id?: string) => {
    if (!id) return;

    axios
      .post(
        `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?&id=${id}`,
        {
          _method: "DELETE",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        setIsSuccessDelete(true);
        setIsDeleteOpen(false);
        setTimeout(() => {
          onclick();
          triggerRefresh();
        }, 1000);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("Failed to delete");
      });
  };

  // ---------- GSAP ANIMATION ------------ //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
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
  }, [isDeleteOpen]);

  return (
    <div className="bg-itim/50 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="dark:bg-light-black bg-light-blue relative max-h-[85vh] w-[1000px] rounded-md border px-10 py-8">
        <HiOutlineX
          className={`text-light-black absolute ${isDeleteOpen ? "pointer-events-none opacity-80" : "cursor-pointer hover:text-red-500"} top-5 right-5 text-2xl transition-all duration-300 dark:text-white`}
          onClick={onclick}
        />

        <div className="border-dark-blue/50 relative flex w-full items-center justify-center gap-2 border-b pb-4 dark:border-gray-500/50">
          <div className="absolute top-2 left-20 flex -translate-1/2 items-center gap-3">
            <div className={`h-5 w-5 rounded-full ${evacStatus.color}`}></div>
            <div className="flex flex-col gap-1">
              <p className="text-sm">{evacStatus.text}</p>
              <p className="text-[10px]">Evacuation Center Status</p>
            </div>
          </div>
          <div className="text-dark-blue flex items-center gap-3 text-center">
            <FaHouseCircleCheck className="text-2xl" />
            <p className="text-lg font-semibold">Evacuation Center Details</p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-8">
          <div className="w-1/2 flex-1">
            <div className="flex flex-col gap-3">
              <h2 className="flex items-center gap-3 font-semibold">
                <GoHomeFill className="text-dark-blue text-xl" />
                {evacDetails?.name}
              </h2>

              <div className="mb-5 flex flex-col gap-4">
                <p className="flex items-center gap-3 text-sm">
                  <HiLocationMarker className="text-xl text-red-500" />
                  {evacDetails?.location}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-5">
                      <FaUser className="text-dark-blue" />
                      <div className="flex flex-col gap-1">
                        <p className="flex gap-3 text-sm">
                          {evacDetails?.contact_person}
                        </p>
                        <p className="text-[10px]">Contact Person</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <FaPhone className="text-dark-blue" />
                      <div className="flex flex-col gap-1">
                        <p className="flex gap-3 text-sm">
                          {evacDetails?.contact_number}
                        </p>
                        <p className="text-[10px]">Contact Number</p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div className="h-3 w-3 rounded-full bg-[#6366f1]"></div>
                        <div className="flex w-[150px] items-center justify-between gap-4">
                          <p className="mr-2">Capacity</p>
                          <p>{capacity}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
                        <div className="flex w-[150px] items-center justify-between gap-4">
                          <p className="mr-2">Vacancy</p>
                          <p>{vacancy}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-[#f59e0b]"></div>
                        <div className="flex w-[150px] items-center justify-between gap-4">
                          <p className="mr-2">Evacuees</p>
                          <p>{evacuees}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <EvacuationBarChart capacity={capacity} evacuees={evacuees} />
            </div>
          </div>

          <div className="h-[350px] w-1/2 flex-1">
            <div className="h-full">
              {evacDetails?.lat && evacDetails?.long ? (
                <>
                  <EvacuationMapDetails
                    lat={Number(evacDetails.lat)}
                    lng={Number(evacDetails.long)}
                    name={evacDetails.name ?? ""}
                  />
                  <p className="text-g mt-3 text-xs text-gray-500">
                    Location in map
                  </p>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed text-center text-xs text-gray-400">
                  Map is loading or unavailable.
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                disabled={isDeleteOpen}
                onClick={onEdit}
                className={`bg-dark-blue text-puti flex cursor-pointer items-center gap-1 rounded-sm px-6 py-2 text-xs transition-all duration-300 hover:opacity-80`}
              >
                <LiaEditSolid className="text-sm" />
                Edit
              </button>
              <button
                disabled={isDeleteOpen}
                onClick={() => setIsDeleteOpen(true)}
                className={`text-puti flex items-center ${isDeleteOpen ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:opacity-80"} gap-1 rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300`}
              >
                <AiFillDelete className="text-sm" />
                Delete
              </button>
            </div>
          </div>

          {isDeleteOpen && (
            <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
              <DeletePopUp
                oncancel={() => setIsDeleteOpen(false)}
                ondelete={() => handleDelete(id)}
              />
            </div>
          )}

          {IsSuccessDelete && (
            <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
              <DeleteSuccessfully />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
