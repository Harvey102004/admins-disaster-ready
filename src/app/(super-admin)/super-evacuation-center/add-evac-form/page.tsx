"use client";

import {
  FaHouseCircleCheck,
  FaUsers,
  FaUser,
  FaPhone,
  FaHeading,
} from "react-icons/fa6";
import { HiOutlineX, HiLocationMarker } from "react-icons/hi";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { evacuationCenterSchema } from "@/lib/schema/evacuation";
import { zodResolver } from "@hookform/resolvers/zod";

import { NumberInput, TextInput } from "@/components/Inputs";
import { EvacuationCenterFormData } from "@/server/api/evacuation";

import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvacuationCenter } from "@/server/api/evacuation";
import { toast } from "sonner";
import { useEffect } from "react";

const EvacuationMap = dynamic(() => import("@/components/maps/evac-map-add"), {
  ssr: false,
});

export default function AddEvacForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(evacuationCenterSchema),
    defaultValues: {
      lat: 14.1717,
      long: 121.2436,
      created_by: "",
    },
  });

  const lat = watch("lat");
  const long = watch("long");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.username && userObj.barangay) {
          setValue("created_by", `${userObj.username}, ${userObj.barangay}`);
        } else if (userObj.username) {
          setValue("created_by", userObj.username);
        }
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
  }, [setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EvacuationCenterFormData) => {
      await toast.promise(addEvacuationCenter(data), {
        loading: "Adding evacuation center",
        success: () => "Evacuation center added successfully!",
        error: (error: any) => error?.message || "Something went wrong",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["evacuationsCenter"] });
      await queryClient.refetchQueries({ queryKey: ["evacuationsCenter"] });
      router.back();
    },
  });

  const onSubmit = (data: EvacuationCenterFormData) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      if (!data.created_by && userObj.username && userObj.barangay) {
        data.created_by = `${userObj.username}, ${userObj.barangay}`;
      } else if (!data.created_by && userObj.username) {
        data.created_by = userObj.username;
      }
    }
    mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] w-[80vw] flex-col gap-8 rounded-xl border bg-white p-10 backdrop-blur-sm"
      >
        <HiOutlineX
          onClick={() => router.back()}
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
        />

        <div className="flex gap-8">
          <div className="flex flex-1 flex-col justify-between gap-7">
            <div className="mx-auto flex w-full items-center justify-center gap-2">
              <FaHouseCircleCheck className="text-dark-blue text-lg" />
              <h2 className="text-sm">Add Evacuation Center</h2>
            </div>

            <div className="flex justify-between gap-5">
              <input type="hidden" {...register("created_by")} />

              <TextInput
                name="evac_name"
                icon={<FaHeading />}
                label="Title"
                register={register}
                errors={errors}
                placeholder="Enter evacuation name..."
              />

              <NumberInput
                name="evac_capacity"
                icon={<FaUsers />}
                label="Capacity"
                register={register}
                errors={errors}
                placeholder="Enter evacuation capacity..."
              />
            </div>

            <div className="flex justify-between gap-5">
              <TextInput
                name="evac_location"
                icon={<HiLocationMarker />}
                label="Location"
                register={register}
                errors={errors}
                placeholder="Enter evacuation location..."
              />

              <NumberInput
                name="evac_evacuees"
                icon={<FaUsers />}
                label="Evacuees"
                register={register}
                errors={errors}
                placeholder="Enter total number of evacuees..."
              />
            </div>

            <div className="flex justify-between gap-5">
              <TextInput
                name="evac_contact_person"
                icon={<FaUser />}
                label="Contact person"
                register={register}
                errors={errors}
                placeholder="Enter contact person name..."
              />

              <TextInput
                name="evac_contact_number"
                icon={<FaPhone />}
                label="Contact number"
                register={register}
                errors={errors}
                placeholder="Enter contact person number..."
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className={`bg-dark-blue text-puti mt-3 rounded-md border py-3 text-sm transition-all duration-300 ${
                isPending ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {isPending ? "Adding Evacuation..." : "Add Evacuation Center"}
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <HiLocationMarker className="text-dark-blue text-lg" />
              <p className="text-xs">Pin Location on Map</p>
            </div>

            {/* Map Component */}
            <div className="border-dark-blue h-[400px] w-full overflow-hidden rounded-lg border shadow-xl">
              <input type="hidden" {...register("lat", { required: true })} />
              <input type="hidden" {...register("long", { required: true })} />
              <EvacuationMap
                lat={lat}
                lng={long}
                onChange={({ lat, lng }) => {
                  setValue("lat", lat, { shouldValidate: true });
                  setValue("long", lng, { shouldValidate: true });
                }}
              />
              {errors.lat || errors.long ? (
                <p className="absolute z-40 mt-2 text-xs text-red-500">
                  {errors.lat?.message || errors.long?.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
