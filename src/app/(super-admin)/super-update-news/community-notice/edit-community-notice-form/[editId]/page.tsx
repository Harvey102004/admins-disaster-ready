"use client";

import { FaClock, FaHeading, FaUsers } from "react-icons/fa6";
import { HiOutlineX } from "react-icons/hi";
import { MdOutlineNotes } from "react-icons/md";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { showEditConfirmation } from "@/lib/toasts";

import {
  getCommunityDetails,
  CommunityType,
  editCommunityNotice,
} from "@/server/api/advisories";
import { communityNoticeSchema } from "@/lib/schema/updateNews";

import { toast } from "sonner";
import Loader from "@/components/loading";
import { DateTimeInput, TextAreaInput, TextInput } from "@/components/Inputs";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function EditCommunityNoticeForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams() as { editId: string };
  const { editId } = params;

  const [noClose, setNoClose] = useState(false);
  const [barangay, setBarangay] = useState("");

  const { data, error, isLoading, isRefetching } = useQuery({
    queryKey: ["communityDetails"],
    queryFn: () => getCommunityDetails({ id: editId }),
  });

  const {
    register,
    handleSubmit,
    reset,
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
      return await toast.promise(editCommunityNotice({ id: editId, data }), {
        loading: "Updating community notice...",
        success: () => "Community notice updated successfully!",
        error: (err) => err?.message || "Something went wrong!",
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["communityNotice"] });
      await queryClient.refetchQueries({ queryKey: ["communityNotice"] });
      router.back();
    },
  });

  const onSubmit = (formData: CommunityType) => {
    const isUnchanged =
      formData.title.trim() === data?.title.trim() &&
      formData.details.trim() === data?.details.trim() &&
      formData.dateTime.trim() === data?.date_time.trim();

    if (isUnchanged) {
      toast.error("No changes detected.");
      return;
    }

    showEditConfirmation({
      onConfirm: () => mutate(formData),
    });
  };

  useEffect(() => {
    if (data) {
      reset({
        title: data.title,
        details: data.details,
        dateTime: data.date_time,
      });
    }
  }, [data, reset]);

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

  return (
    <ProtectedRoute>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[45vw] flex-col gap-5 rounded-xl border bg-white px-10 py-8 backdrop-blur-sm"
        >
          <HiOutlineX
            onClick={() => router.back()}
            className={`${noClose ? "pointer-events-none" : "hover:text-red-500"} absolute top-5 right-5 text-xl transition-all duration-300`}
          />
          <div className="mx-auto flex items-center gap-4">
            <FaUsers className="text-dark-blue text-xl" />
            <h2>Edit Community Notice</h2>
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
            placeholder="Enter weather advisory title"
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
    </ProtectedRoute>
  );
}
