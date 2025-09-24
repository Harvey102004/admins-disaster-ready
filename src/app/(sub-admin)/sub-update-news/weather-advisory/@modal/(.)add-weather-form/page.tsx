"use client";

import { FaClock, FaCloud, FaHeading } from "react-icons/fa6";
import { HiOutlineX } from "react-icons/hi";
import { MdOutlineNotes } from "react-icons/md";

import { DateTimeInput, TextAreaInput, TextInput } from "@/components/Inputs";
import { toast } from "sonner";

import { addWeatherAdvisory, WeatherType } from "@/server/api/advisories";
import { weatherAdvisorySchema } from "@/lib/schema/updateNews";

import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddWeatherFormModal() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [barangay, setBarangay] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WeatherType>({
    resolver: zodResolver(weatherAdvisorySchema),
  });

  // ✅ kunin barangay from localStorage
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
    mutationFn: async (data: WeatherType) => {
      return await toast.promise(addWeatherAdvisory(data), {
        loading: "Posting weather advisory...",
        success: () => "Weather advisory posted successfully!",
        error: (err) => err?.message || "Something went wrong!",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["weatherAdvisory"] });
      await queryClient.refetchQueries({ queryKey: ["weatherAdvisory"] });

      router.back();
    },
  });

  const onSubmit = (data: WeatherType) => {
    data.added_by = barangay;
    console.log("Submitting data:", data);
    mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[45vw] flex-col gap-5 rounded-xl border bg-white px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          onClick={() => router.back()}
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
        />
        <div className="mx-auto flex items-center gap-4">
          <FaCloud className="text-dark-blue text-xl" />
          <h2>Add Weather Advisory</h2>
        </div>

        <input
          type="hidden"
          {...register("added_by")}
          value={barangay}
          readOnly
        />

        <TextInput
          name="title"
          label="Title"
          icon={<FaHeading />}
          placeholder="Enter weather advisory title"
          register={register}
          errors={errors}
        />

        <TextAreaInput
          name="details"
          label="Details"
          icon={<MdOutlineNotes />}
          placeholder="Enter details maximum of (25000 characters)"
          register={register}
          errors={errors}
        />

        <DateTimeInput
          name="dateTime"
          label="Date & Time"
          icon={<FaClock />}
          register={register}
          errors={errors}
        />

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
