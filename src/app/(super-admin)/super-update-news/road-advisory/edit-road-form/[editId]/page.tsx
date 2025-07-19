"use client";

import { FaClock, FaHeading, FaRoad } from "react-icons/fa6";
import { ImSpinner6 } from "react-icons/im";
import { MdOutlineNotes } from "react-icons/md";

import { TextInput, TextAreaInput, DateTimeInput } from "@/components/Inputs";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { roadAdvisorySchema } from "@/lib/schema/updateNews";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  editRoadAvisory,
  getRoadDetails,
  RoadType,
} from "@/server/api/advisories";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/loading";
import { showEditConfirmation } from "@/lib/toasts";
import { HiOutlineX } from "react-icons/hi";
import NoIdFound from "@/components/NoIdFound";

export default function RoadAdvisoryEditForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams() as { editId: string };

  const [noClose, setNoClose] = useState(false);

  const { editId } = params;

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["roadDetails"],
    queryFn: () => getRoadDetails({ id: editId }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roadAdvisorySchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        details: data.details,
        status: data.status,
        dateTime: data.date_time,
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RoadType) => {
      return await editRoadAvisory({ id: editId, data });
    },
    onSuccess: async () => {
      toast.success("Road advisory updated successfully!");
      await queryClient.invalidateQueries({ queryKey: ["roadAdvisory"] });
      await queryClient.refetchQueries({ queryKey: ["roadAdvisory"] });
      router.push("/super-update-news/road-advisory");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong!");
    },
  });

  const onSubmit = (formData: RoadType) => {
    const isUnchanged =
      formData.title.trim() === data?.title.trim() &&
      formData.details.trim() === data.details.trim() &&
      formData.status.trim() === data.status.trim() &&
      formData.dateTime.trim() === data?.date_time.trim();

    if (isUnchanged) {
      toast.error("No changes detected");
      return;
    }
    showEditConfirmation({ onConfirm: () => mutate(formData) });
  };

  if (isLoading || isRefetching) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p>Error fetching Road Advisory Details</p>;
  }

  if (
    !data ||
    (typeof data === "object" &&
      "message" in data &&
      data.message === "No records found.")
  ) {
    return <NoIdFound message="Road advisory" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[45vw] flex-col gap-5 rounded-xl border bg-white px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          onClick={() => router.push("/super-update-news/road-advisory")}
          className={`${noClose ? "pointer-events-none" : "hover:text-red-500"} absolute top-5 right-5 text-xl transition-all duration-300`}
        />

        <div className="mx-auto flex items-center gap-4">
          <FaRoad className="text-dark-blue text-xl" />
          <h2>Edit Road Advisory</h2>
        </div>

        <TextInput
          name="title"
          icon={<FaHeading />}
          label="Title"
          register={register}
          errors={errors}
          placeholder="Enter road advisory title..."
        />

        <TextAreaInput
          name="details"
          label="Details"
          icon={<MdOutlineNotes />}
          placeholder="Enter details maximum of (2500 characters)"
          register={register}
          errors={errors}
        />

        <div className="flex items-center justify-between gap-8">
          <div className="w-1/2">
            <DateTimeInput
              name="dateTime"
              label="Date & Time"
              icon={<FaClock />}
              register={register}
              errors={errors}
            />
          </div>

          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <ImSpinner6 className="text-dark-blue" />
              <p className="text-xs">Status</p>
            </div>
            <select
              {...register("status")}
              className={` ${errors.status ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} dark:bg-light-black w-full border px-4 py-3 text-xs outline-none`}
            >
              <option value="">Select status</option>
              <option value="Open">Open</option>
              <option value="Partially Open">Partially Open</option>
              <option value="Closed">Closed</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-500">Status is required</p>
            )}
          </div>
        </div>
        <button
          disabled={isPending}
          type="submit"
          onClick={() => {
            setNoClose(true);

            setTimeout(() => {
              setNoClose(false);
            }, 5000);
          }}
          className={`text-puti mt-3 rounded-md border px-4 py-3 transition-all duration-300 ${
            isPending
              ? "cursor-not-allowed bg-gray-500 opacity-70"
              : "bg-dark-blue cursor-pointer hover:opacity-90"
          } `}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
