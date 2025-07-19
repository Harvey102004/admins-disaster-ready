"use client";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import Loader from "@/components/loading";
import { showDeleteConfirmation } from "@/lib/toasts";
import { toast } from "sonner";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDisasterDetails, deleteDisaster } from "@/server/api/advisories";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { HiOutlineArrowsExpand, HiOutlineX } from "react-icons/hi";
import NoIdFound from "@/components/NoIdFound";
import DateTimeDisplay from "@/components/DateConvertion";

export default function DisasterUpdatesDetailModal() {
  const router = useRouter();
  const params = useParams() as { disasterId: string };
  const queryClient = useQueryClient();
  const { disasterId } = params;

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["disasterDetails"],
    queryFn: () => getDisasterDetails({ id: disasterId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteDisaster({ id: disasterId }), {
        loading: "Deleting Disaster updates...",
        success: () => {
          return "Disaster Updates deleted successfully!";
        },
        error: (err) => {
          return err?.message || "Something went wrong!";
        },
      });
    },
    onSuccess: () => {
      router.back();
      queryClient.invalidateQueries({ queryKey: ["disasterUpdates"] });
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
    return <p>{error.message}</p>;
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <Card className="relative max-h-[80vh] w-[70vw] py-10">
          <div className="flex justify-between">
            <div className="pl-5">
              <div
                onClick={() => setImageOpen(true)}
                className="group relative h-[450px] min-w-[500px] overflow-hidden rounded-md bg-transparent"
              >
                <Image
                  src={data?.image_url ?? ""}
                  alt=""
                  fill
                  className="object-cover object-center"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <HiOutlineArrowsExpand className="text-3xl text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[10px] text-gray-500">Tap to expand image</p>
                <p className="text-[10px] text-gray-500">
                  <DateTimeDisplay value={data?.date_time} />
                </p>
              </div>
            </div>
            <div className="flex max-w-[40vw] flex-col gap-5">
              <CardHeader className="flex flex-col">
                <CardTitle>{data?.title}</CardTitle>
                <h1 className="mt-2 text-sm">{data?.disaster_type}</h1>

                <CardAction
                  onClick={() => router.back()}
                  className={`${isToastOpen ? "pointer-events-none opacity-80" : "hover:text-red-500"} absolute top-3 right-3 text-2xl transition-all duration-300`}
                >
                  <IoCloseCircleSharp />
                </CardAction>
              </CardHeader>

              <CardContent className="scrollBar mr-2 max-h-[350px] overflow-auto text-sm leading-relaxed tracking-normal whitespace-pre-line text-gray-800 dark:text-gray-300">
                <p>{data?.details}</p>
              </CardContent>

              <CardFooter className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/super-update-news/disaster-updates/edit-disaster-form/${disasterId}`}
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
                <p className="text-xs text-gray-500">Added By: Brgy Wala pa</p>
              </CardFooter>
            </div>
          </div>
        </Card>
      </div>

      {imageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
          <div
            className="absolute top-5 right-5 cursor-pointer text-3xl text-white"
            onClick={() => setImageOpen(false)}
          >
            <HiOutlineX />
          </div>
          <Image
            src={data?.image_url ?? ""}
            alt="Full Preview"
            width={800}
            height={600}
            className="h-auto max-h-[80vh] w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
