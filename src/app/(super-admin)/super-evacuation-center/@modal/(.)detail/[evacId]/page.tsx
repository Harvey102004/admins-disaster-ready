"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import {
  deleteEvacuationCenter,
  getEvacuationDetails,
} from "@/server/api/evacuation";
import NoIdFound from "@/components/NoIdFound";
import Loader from "@/components/loading";
import { IoCloseCircleSharp, IoStatsChart } from "react-icons/io5";
import MapDetails from "@/components/maps/map-details";
import Link from "next/link";
import { LiaEditSolid } from "react-icons/lia";
import { AiFillDelete } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  EvacuationBarChart,
  EvacuationDoughnutChart,
  EvacuationLineChart,
  EvacuationPieChart,
  EvacuationPolarAreaChart,
} from "@/components/charts/evacuationCharts";
import { useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { FaPhone, FaUser } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import Image from "next/image";
import { toast } from "sonner";
import { showDeleteConfirmation } from "@/lib/toasts";

export default function EvacuationDetailModal() {
  const params = useParams() as { evacId: string };
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const { evacId } = params;

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["evacuationCenterDetail"],
    queryFn: () => getEvacuationDetails({ id: evacId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteEvacuationCenter({ id: evacId }), {
        loading: "Deleting evacuation center",
        success: () => {
          return "Evacuation center deleted successfully!";
        },
        error: (err: any) => {
          return err?.message || "Something went wrong";
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuationCenter"] });
      queryClient.refetchQueries({ queryKey: ["evacuationsCenter"] });
      router.back();
    },
  });

  if (isLoading || isRefetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching Weather Advisory Details</p>;
  }

  if (
    !data ||
    (typeof data === "object" &&
      "message" in data &&
      data.message === "No records found.")
  ) {
    return <NoIdFound message="Evacuation Center" />;
  }

  const cap = Number(data.capacity) || 0;
  const evacs = Number(data.current_evacuees) || 0;
  const vacancy = cap - evacs;

  let chartDesign =
    (typeof window !== "undefined" && sessionStorage.getItem("chartStyle")) ||
    data.chartStyle ||
    "line";

  switch (chartDesign) {
    case "bar":
      chartDesign = "bar";
      break;
    case "line":
      chartDesign = "line";
      break;
    case "doughnut":
      chartDesign = "doughnut";
      break;
    case "pie":
      chartDesign = "pie";
      break;
    case "polar":
      chartDesign = "polar";
      break;
    default:
      break;
  }

  const vacancyRate = (vacancy / cap) * 100;

  let statusLabel = "Unknown";
  let statusColor = "bg-gray-400";

  if (cap === 0) {
    statusLabel = "No capacity data";
    statusColor = "bg-gray-400";
  } else if (vacancy === 0) {
    statusLabel = "Not Available  (Full) ";
    statusColor = "bg-red-600";
  } else if (vacancyRate < 50) {
    statusLabel = "Almost full";
    statusColor = "bg-yellow-400";
  } else {
    statusLabel = "Plenty of space";
    statusColor = "bg-green-500";
  }

  const barangayOnly = data.created_by
    ? data.created_by.split(",").pop()?.trim()
    : "Unknown";

  const barangayLogo = barangayOnly
    ? barangayOnly.toLowerCase().includes("municipality of los baños")
      ? "lb-logo.png"
      : barangayOnly.toLowerCase().replace(/\s+/g, "-") + "-logo.png"
    : "default-logo.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="dark:bg-light-black relative flex h-[80vh] w-[65vw] justify-between rounded-md bg-white">
        <div className="flex h-full w-[45%] flex-col gap-5 p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className={`h-5 w-5 rounded-full ${statusColor}`}></div>
            <p>{statusLabel}</p>
          </div>

          <div className="flex h-full w-full flex-col gap-5">
            <div className="flex w-full items-center gap-5">
              <GoHomeFill className="text-dark-blue text-2xl" />
              <p>{data.name}</p>
            </div>

            <div className="flex items-center gap-5">
              <HiLocationMarker className="text-dark-blue text-2xl" />
              <p className="">{data.location}</p>
            </div>

            <div className="flex items-center gap-5">
              <FaUser className="text-dark-blue text-2xl" />
              <p>{data.contact_person}</p>
            </div>

            <div className="flex items-center gap-5">
              <FaPhone className="text-dark-blue text-2xl" />
              <p>{data.contact_number}</p>
            </div>

            <div className="mt-5 flex items-center gap-5">
              <div className="bg-dark-blue h-5 w-5 rounded-full"></div>
              <p className="text-sm">
                Capacity: <span className="ml-5">{cap}</span>
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="h-5 w-5 rounded-full bg-[#C10000]"></div>
              <p className="text-sm">
                Evacuees: <span className="ml-5">{evacs}</span>
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="h-5 w-5 rounded-full bg-[#4CAF50]"></div>
              <p className="text-sm">
                Vacancy: <span className="ml-5">{vacancy}</span>
              </p>
            </div>

            <div className="mt-auto flex items-center gap-5">
              <Image
                src={`/logos/${barangayLogo}`}
                alt={`${barangayOnly} logo`}
                width={60}
                height={60}
                className="rounded-full"
              />
              <p className="text-[13px] text-nowrap text-gray-500">
                Added by: {barangayOnly || "Unknown"}
              </p>
            </div>
          </div>
        </div>

        <div className="h-full w-[55%] p-8">
          <div className="h-full w-full">
            <IoCloseCircleSharp
              onClick={() => router.back()}
              className={`absolute top-5 right-5 z-50 text-2xl transition-colors duration-300 ${
                isToastOpen
                  ? "pointer-events-none opacity-80"
                  : "hover:text-red-500"
              }`}
            />

            <p className="mb-5 text-center text-sm dark:text-zinc-300">
              {isMapOpen ? "Map View" : "Graph View"}
            </p>

            <div className="h-[80%] w-full min-w-[400px]">
              {isMapOpen ? (
                <MapDetails
                  name={data.name}
                  lat={Number(data.lat)}
                  lng={Number(data.long)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  {chartDesign === "bar" && (
                    <EvacuationBarChart capacity={cap} evacuees={evacs} />
                  )}
                  {chartDesign === "line" && (
                    <EvacuationLineChart capacity={cap} evacuees={evacs} />
                  )}
                  {chartDesign === "doughnut" && (
                    <EvacuationDoughnutChart capacity={cap} evacuees={evacs} />
                  )}
                  {chartDesign === "pie" && (
                    <EvacuationPieChart
                      capacity={cap}
                      evacuees={evacs}
                      classname="h-[300px] w-[300px]"
                    />
                  )}
                  {chartDesign === "polar" && (
                    <EvacuationPolarAreaChart capacity={cap} evacuees={evacs} />
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Link href={`/super-evacuation-center/edit-evac-form/${evacId}`}>
                <button
                  disabled={isPending || isToastOpen}
                  className={`bg-dark-blue text-puti flex cursor-pointer items-center gap-1 rounded-sm px-6 py-2 text-xs transition-all duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80`}
                >
                  <LiaEditSolid className="text-sm" />
                  Edit
                </button>
              </Link>

              <button
                disabled={isPending || isToastOpen}
                onClick={() => {
                  setIsToastOpen(true);
                  showDeleteConfirmation({
                    onConfirm: () => mutate(),
                    onClose: () => setIsToastOpen(false),
                  });
                  setTimeout(() => {
                    setIsToastOpen(false);
                  }, 5000);
                }}
                className={`text-puti flex cursor-pointer items-center gap-1 rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80`}
              >
                <AiFillDelete className="text-sm" />
                {isPending ? "Deleting..." : "Delete"}
              </button>

              <button
                disabled={isPending || isToastOpen}
                onClick={() => setIsMapOpen((prev) => !prev)}
                className={`bg-dark-blue text-puti flex cursor-pointer items-center gap-1 rounded-sm px-6 py-2 text-xs transition-all duration-300 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-80`}
              >
                {isMapOpen ? (
                  <>
                    <IoStatsChart />
                    View Graph
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="text-[10px]" />
                    View map
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
