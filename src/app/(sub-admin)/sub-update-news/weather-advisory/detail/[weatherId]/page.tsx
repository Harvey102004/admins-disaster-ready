"use client";
import { IoClose, IoCloseCircleSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DateTimeDisplay from "@/components/DateConvertion";

import Loader from "@/components/loading";
import { showDeleteConfirmation } from "@/lib/toasts";
import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWeatherDetails, deleteWeather } from "@/server/api/advisories";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoIdFound from "@/components/NoIdFound";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function WeatherAdvisoryDetail() {
  const router = useRouter();
  const params = useParams() as { weatherId: string };
  const queryClient = useQueryClient();
  const { weatherId } = params;

  const [isToastOpen, setIsToastOpen] = useState(false);

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["weatherDetails"],
    queryFn: () => getWeatherDetails({ id: weatherId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteWeather({ id: weatherId }), {
        loading: "Deleting weather advisory...",
        success: () => {
          return "Weather advisory deleted successfully!";
        },
        error: (err) => {
          return err?.message || "Something went wrong!";
        },
      });
    },
    onSuccess: () => {
      router.back();
      queryClient.invalidateQueries({ queryKey: ["weatherAdvisory"] });
    },
  });

  // ===== GET CURRENT USER FROM LOCALSTORAGE =====
  let currentBarangay = "";
  if (typeof window !== "undefined") {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    currentBarangay = storedUser?.barangay
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  const addedBy = data?.added_by
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const canEditOrDelete = currentBarangay === addedBy;

  if (isLoading || isRefetching) {
    return (
      <ProtectedRoute>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Loader />
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <p>Error fetching Weather Advisory Details</p>
      </ProtectedRoute>
    );
  }

  if (
    !data ||
    (typeof data === "object" &&
      "message" in data &&
      data.message === "No records found.")
  ) {
    return <NoIdFound message="Disaster update" />;
  }

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <Card className="max-h-[80vh] w-[50vw]">
          <CardHeader>
            <CardTitle className="max-w-[80%] text-xl">{data?.title}</CardTitle>

            <CardDescription className="mt-2">
              <DateTimeDisplay value={data?.date_time ?? ""} />
            </CardDescription>

            <CardAction
              onClick={() => router.back()}
              className={`${isToastOpen ? "pointer-events-none opacity-80" : "hover:text-red-500"} text-2xl transition-all duration-300`}
            >
              <IoClose />
            </CardAction>
          </CardHeader>

          <CardContent className="scrollBar mr-2 max-h-[40%] overflow-auto leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
            <p>{data?.details}</p>
          </CardContent>

          <CardFooter className="mt-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-800 dark:text-gray-500">
              Added by:
              <Image
                src={`/logos/${
                  data?.added_by
                    ?.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .includes("municipal of los banos")
                    ? "lb-logo.png"
                    : data?.added_by
                        ?.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, "-") + "-logo.png"
                }`}
                alt={`${data?.added_by} logo`}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              {data?.added_by}
            </span>

            {canEditOrDelete && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/sub-update-news/weather-advisory/edit-weather-form/${weatherId}`}
                >
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
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
