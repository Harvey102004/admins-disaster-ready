"use client";

import { FaClock, FaEarthAmericas, FaHeading, FaImages } from "react-icons/fa6";
import { MdOutlineNotes } from "react-icons/md";
import { PiWarningFill } from "react-icons/pi";

import {
  TextInput,
  TextAreaInput,
  DateTimeInput,
  FileInput,
} from "@/components/Inputs";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { disasterUpdatesEditSchema } from "@/lib/schema/updateNews";

import {
  DisasterType,
  editDisasterUpdates,
  getDisasterDetails,
} from "@/server/api/advisories";
import { HiOutlineX } from "react-icons/hi";
import { useEffect, useState } from "react";
import Loader from "@/components/loading";
import { showEditConfirmation } from "@/lib/toasts";
import NoIdFound from "@/components/NoIdFound";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function EditDisasterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const params = useParams() as { editId: string };

  const { editId } = params;

  const [barangay, setBarangay] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(disasterUpdatesEditSchema),
  });

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["disasterDetails"],
    queryFn: () => getDisasterDetails({ id: editId }),
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.barangay) {
          setBarangay(parsedUser.barangay);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: DisasterType) => {
      return await toast.promise(editDisasterUpdates({ id: editId, data }), {
        loading: "Updating Disaster Updates...",
        success: () => "Disaster updates updated successfully!",
        error: (err) => err.message || "Something went wrong",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["disasterUpdates"] });
      await queryClient.refetchQueries({ queryKey: ["disasterUpdates"] });
      router.back();
    },
  });

  const onSubmit = (formData: DisasterType) => {
    const newImage = formData.image;
    const hasImageChanged =
      newImage instanceof FileList
        ? newImage.length > 0
        : newImage instanceof File;

    const isUnchanged =
      formData.title.trim() === data?.title.trim() &&
      formData.details.trim() === data?.details.trim() &&
      formData.disasterType.trim() === data?.disaster_type.trim() &&
      formData.dateTime.trim() === data?.date_time.trim() &&
      !hasImageChanged;

    if (isUnchanged) {
      toast.error("No changes detected.");
      return;
    }

    showEditConfirmation({
      onConfirm: () =>
        mutate({
          ...formData,
          added_by: barangay,
        }),
    });
  };

  useEffect(() => {
    if (data && !isPending) {
      reset({
        title: data.title,
        disasterType: data.disaster_type,
        details: data.details,
        dateTime: data.date_time,
        added_by: barangay,
      });
    }
  }, [data, barangay, reset]);

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
        <p>{error.message}</p>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[60vw] flex-col gap-5 rounded-xl border bg-white px-10 py-8 backdrop-blur-sm"
        >
          <HiOutlineX
            onClick={() => router.back()}
            className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          />

          <div className="mx-auto mb-5 flex items-center gap-4">
            <PiWarningFill className="text-dark-blue text-xl" />
            <h2>Edit Disaster Updates</h2>
          </div>

          <div className="flex justify-between gap-8">
            <div className="flex w-1/2 flex-1 flex-col items-center justify-between gap-5">
              <FileInput
                name="image"
                icon={<FaImages />}
                label="Image"
                register={register}
                errors={errors}
              />

              <TextInput
                name="title"
                icon={<FaHeading />}
                label="Title"
                register={register}
                errors={errors}
                placeholder="Enter disaster updates title..."
              />

              <div className="w-full">
                <DateTimeInput
                  name="dateTime"
                  label="Date & Time"
                  icon={<FaClock />}
                  register={register}
                  errors={errors}
                />
              </div>

              <div className="w-full">
                <div className="mb-3 flex items-center gap-3 text-sm">
                  <FaEarthAmericas className="text-dark-blue" />
                  <p className="text-xs">Disaster Type</p>
                </div>
                <select
                  {...register("disasterType")}
                  className={` ${errors.disasterType ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} dark:bg-light-black w-full border px-4 py-3 text-xs outline-none`}
                >
                  <option value="">Select Disaster Type</option>
                  <option value="Flood">Flood</option>
                  <option value="Typhoon">Typhoon</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Volcanic Eruption">Volcanic Eruption</option>
                </select>
                {errors.disasterType && (
                  <p className="mt-1 text-xs text-red-500">
                    Disaster type is required
                  </p>
                )}
              </div>
            </div>

            <div className="mb-8 w-1/2">
              <TextAreaInput
                name="details"
                label="Details"
                icon={<MdOutlineNotes />}
                placeholder="Enter details maximum of (2500 characters)"
                register={register}
                errors={errors}
                classname="h-full"
              />
            </div>

            <input
              type="hidden"
              {...register("added_by")}
              value={barangay}
              readOnly
            />
          </div>

          <div className="flex items-center justify-between gap-8"></div>
          <button
            disabled={isPending}
            type="submit"
            className={`text-puti mt-3 rounded-md border px-4 py-3 transition-all duration-300 ${
              isPending
                ? "cursor-not-allowed bg-gray-500 opacity-70"
                : "bg-dark-blue cursor-pointer hover:opacity-90"
            } `}
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
