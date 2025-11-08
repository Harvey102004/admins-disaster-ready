"use client";

import { FaClock, FaUsers, FaHeading } from "react-icons/fa6";
import { HiOutlineX } from "react-icons/hi";
import { MdOutlineNotes } from "react-icons/md";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { addCommunityNotice, CommunityType } from "@/server/api/advisories";
import { communityNoticeSchema } from "@/lib/schema/updateNews";

import { DateTimeInput, TextAreaInput, TextInput } from "@/components/Inputs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function AddCommunityForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [barangay, setBarangay] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunityType>({
    resolver: zodResolver(communityNoticeSchema),
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
    mutationFn: async (data: CommunityType) => {
      return await toast.promise(addCommunityNotice(data), {
        loading: "Posting community notice...",
        success: () => "Community notice posted successfully!",
        error: (err) => err?.message || "Something went wrong!",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["communityNotice"] });
      await queryClient.refetchQueries({ queryKey: ["communityNotice"] });

      router.back();
    },
  });

  const onSubmit = (data: CommunityType) => {
    data.added_by = barangay;
    mutate(data);
  };

  return (
    <ProtectedRoute>
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
            <FaUsers className="text-dark-blue text-xl" />
            <h2>Add Community Notice</h2>
          </div>

          <input
            type="hidden"
            value={barangay}
            {...register("added_by")}
            readOnly
          />

          <TextInput
            name="title"
            label="Title"
            icon={<FaHeading />}
            placeholder="Enter community notice title"
            register={register}
            errors={errors}
          />

          <TextAreaInput
            name="details"
            label="Details"
            icon={<MdOutlineNotes />}
            placeholder="Enter details maximum of (2500 characters)"
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
    </ProtectedRoute>
  );
}
