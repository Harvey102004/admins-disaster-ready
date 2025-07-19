"use client";

import { AiFillDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";
import { IoCloseCircleSharp } from "react-icons/io5";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import DateTimeDisplay from "@/components/DateConvertion";

import { getCommunityDetails, deleteCommunity } from "@/server/api/advisories";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import Link from "next/link";
import Loader from "@/components/loading";
import { showDeleteConfirmation } from "@/lib/toasts";
import NoIdFound from "@/components/NoIdFound";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CommunityNoticeDetail() {
  const router = useRouter();
  const params = useParams() as { communityId: string };
  const queryClient = useQueryClient();
  const { communityId } = params;

  const [isToastOpen, setIsToastOpen] = useState(false);

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["communityDetails"],
    queryFn: () => getCommunityDetails({ id: communityId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await toast.promise(deleteCommunity({ id: communityId }), {
        loading: "Deleting community notice...",
        success: () => {
          return "Comunity notice deleted successfully!";
        },
        error: (err) => {
          return err?.message || "Something went wrong!";
        },
      });
    },
    onSuccess: () => {
      router.back();
      queryClient.invalidateQueries({ queryKey: ["communityNotice"] });
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
    return <p>Error fetching Community notice details</p>;
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
              href={`/super-update-news/community-notice/edit-community-notice-form/${communityId}`}
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
