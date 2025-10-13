"use client";

import { useForm } from "react-hook-form";
import { FaUser, FaPhone, FaUsers } from "react-icons/fa6";
import { useEffect } from "react";
import Loader from "@/components/loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  editEvacuationCenter,
  getEvacuationDetails,
} from "@/server/api/evacuation";
import { useParams, useRouter } from "next/navigation";
import { HiddenInput, NumberInput, TextInput } from "@/components/Inputs";
import { toast } from "sonner";
import { showEditConfirmation } from "@/lib/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { editEvacuationCenterSchema } from "@/lib/schema/evacuation";
import { z } from "zod";
import NoIdFound from "@/components/NoIdFound";

type EditEvacuationCenterSchema = z.infer<typeof editEvacuationCenterSchema>;

export default function SubEditEvacFormModal() {
  const { editId } = useParams() as { editId: string };
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: ["evacuationDetails", editId],
    queryFn: () => getEvacuationDetails({ id: editId }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditEvacuationCenterSchema>({
    resolver: zodResolver(editEvacuationCenterSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        location: data.location,
        capacity: data.capacity,
        current_evacuees: data.current_evacuees,
        contact_person: data.contact_person,
        contact_number: data.contact_number,
        lat: data.lat ?? undefined,
        long: data.long ?? undefined,
        created_by: data.created_by ?? "",
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["editEvacuationCenter"],
    mutationFn: async (formData: EditEvacuationCenterSchema) => {
      return await toast.promise(
        editEvacuationCenter({ id: editId, data: formData }),
        {
          loading: "Updating evacuation center...",
          success: "Evacuation center updated successfully!",
          error: (error: any) => error?.message || "Something went wrong",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evacuationsCenter"] });
      router.back();
    },
  });

  const onSubmit = (formData: EditEvacuationCenterSchema) => {
    const unchanged =
      Number(formData.current_evacuees) === Number(data?.current_evacuees) &&
      formData.contact_person.trim() === data?.contact_person.trim() &&
      formData.contact_number.trim() === data?.contact_number.trim();

    if (unchanged) {
      toast.error("No changes detected.");
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
    return <p>Error fetching evacuation center details</p>;
  }

  if (
    !data ||
    (typeof data === "object" &&
      "message" in data &&
      data.message === "No records found.")
  ) {
    return <NoIdFound message="Evacuation Center" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-background border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-8 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <p className="text-light-black dark:text-puti/60 mb-3 text-center text-sm">
          Only Evacuees, Contact Person, and Contact Number are editable.
        </p>
        {/* Hidden inputs */}
        <HiddenInput name="name" register={register} errors={errors} />
        <HiddenInput name="capacity" register={register} errors={errors} />
        <HiddenInput name="location" register={register} errors={errors} />
        <HiddenInput name="lat" register={register} errors={errors} />
        <HiddenInput name="long" register={register} errors={errors} />
        <HiddenInput
          name="created_by"
          register={register}
          errors={errors}
        />{" "}
        {/* ✅ preserve */}
        <NumberInput
          name="current_evacuees"
          icon={<FaUsers />}
          label="Evacuees"
          register={register}
          errors={errors}
          placeholder="Enter number of evacuees..."
        />
        <TextInput
          name="contact_person"
          icon={<FaUser />}
          label="Contact Person"
          register={register}
          errors={errors}
          placeholder="Enter contact person..."
        />
        <TextInput
          name="contact_number"
          icon={<FaPhone />}
          label="Contact Number"
          register={register}
          errors={errors}
          placeholder="Enter contact number..."
        />
        <div className="flex w-full items-center gap-8">
          <button
            type="submit"
            disabled={isPending}
            className={`bg-dark-blue text-puti mt-4 w-1/2 rounded-md border py-3 text-sm transition-all duration-300 ${
              isPending ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
            }`}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className={`text-puti mt-4 w-1/2 rounded-md border bg-red-500 py-3 text-sm transition-all duration-300 ${
              isPending ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
            }`}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
