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
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { disasterUpdatesSchema } from "@/lib/schema/updateNews";

import { addDisasterUpdates, DisasterType } from "@/server/api/advisories";
import { HiOutlineX } from "react-icons/hi";

export default function DisasterUpdatesFormModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(disasterUpdatesSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: DisasterType) => {
      return await toast.promise(addDisasterUpdates(data), {
        loading: "Posting Disaster Updates...",
        success: () => "Disaster updates posted successfully!",
        error: (err) => err.message || "Something went wrong",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["disasterUpdates"] });
      await queryClient.refetchQueries({ queryKey: ["disasterUpdates"] });
      router.back();
    },
  });

  const onSubmit = (data: DisasterType) => {
    mutate(data);
  };

  return (
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
          <h2>Add Disaster Updates</h2>
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
              placeholder="Enter details maximum of (1000 characters)"
              register={register}
              errors={errors}
              classname="h-full"
            />
          </div>
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
  );
}
