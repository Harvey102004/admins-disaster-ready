"use client";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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

export default function WeatherAdvisoryDetailModal() {
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
    return <NoIdFound message="Disaster update" />;
  }

  return (
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
            <IoCloseCircleSharp />
          </CardAction>
        </CardHeader>

        <CardContent className="scrollBar mr-2 max-h-[40%] overflow-auto leading-relaxed tracking-normal text-gray-800 dark:text-gray-300">
          <p>{data?.details}</p>
        </CardContent>

        <CardFooter className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-400">Added By: Brgy Wala pa</p>
          <div className="flex items-center gap-3">
            <Link
              href={`/super-update-news/weather-advisory/edit-weather-form/${weatherId}`}
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
        </CardFooter>
      </Card>
    </div>
  );
}
