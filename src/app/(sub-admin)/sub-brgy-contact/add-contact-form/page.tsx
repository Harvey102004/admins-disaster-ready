"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brgyContactSchema } from "@/lib/schema/brgyContacts";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { addBrgyContact } from "@/server/api/brgyContacts";

import { GoHomeFill } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaPhone, FaUser } from "react-icons/fa6";
import { ImPhoneHangUp } from "react-icons/im";
import { HiLocationMarker } from "react-icons/hi";
import dynamic from "next/dynamic";

import { NumberInput, TextInput } from "@/components/Inputs";

type BrgyContactForm = z.infer<typeof brgyContactSchema>;

const BarangayMap = dynamic(() => import("@/components/maps/brgy-map-add"), {
  ssr: false,
});

export default function AddContactForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brgyContactSchema),
    defaultValues: {
      lat: 14.1717 as number,
      long: 121.2436 as number,
    },
  });

  const lat = watch("lat");
  const long = watch("long");

  // ✅ Auto-set barangay from localStorage.user.barangay
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.barangay) {
          setValue("barangay_name", parsed.barangay, { shouldValidate: true });
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  }, [setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BrgyContactForm) => {
      await toast.promise(addBrgyContact(data), {
        loading: "Adding barangay contact...",
        success: () => "Barangay contact added successfully!",
        error: (error: any) => error?.message || "Something went wrong",
        position: "bottom-right",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["brgyContacts"] });
      await queryClient.refetchQueries({ queryKey: ["brgyContacts"] });
      router.back();
    },
  });

  const onSubmit = (data: BrgyContactForm) => {
    // Ensure lat/long are numbers
    data.lat = Number(data.lat);
    data.long = Number(data.long);
    mutate(data);
  };

  return (
    <div className="flex h-[85vh] flex-col items-center gap-10 p-6">
      <form
        className="flex w-full flex-col gap-7 pb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-10">
          <div className="flex gap-10">
            {/* LEFT SIDE */}
            <div className="flex w-1/2 flex-col gap-5">
              <TextInput
                name="barangay_name"
                icon={<GoHomeFill className="text-dark-blue" />}
                label="Barangay"
                register={register}
                errors={errors}
              />

              <TextInput
                name="email"
                icon={<MdEmail />}
                label="Email"
                register={register}
                errors={errors}
                placeholder="Enter brgy email..."
              />

              <TextInput
                name="captain_name"
                icon={<FaUser />}
                label="Barangay Captain"
                register={register}
                errors={errors}
                placeholder="Enter brgy captain..."
              />

              <TextInput
                name="secretary_name"
                icon={<FaUser />}
                label="Barangay Secretary"
                register={register}
                errors={errors}
                placeholder="Enter brgy secretary..."
              />

              <TextInput
                name="contact_number"
                icon={<FaPhone />}
                label="Barangay contact number"
                register={register}
                errors={errors}
                placeholder="Enter brgy contact number..."
              />

              <TextInput
                name="landline"
                icon={<ImPhoneHangUp />}
                label="Landline"
                register={register}
                errors={errors}
                placeholder="Enter brgy landline..."
              />

              <TextInput
                name="facebook_page"
                icon={<FaFacebook />}
                label="Facebook page"
                register={register}
                errors={errors}
                placeholder="Enter brgy facebook page..."
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex w-1/2 flex-col gap-5">
              <NumberInput
                name="total_male"
                label="Total Male (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <NumberInput
                name="total_female"
                label="Total Female (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <NumberInput
                name="total_families"
                label="Total Families (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <NumberInput
                name="total_male_senior"
                label="Total Male Senior (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <NumberInput
                name="total_female_senior"
                label="Total Female Senior (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <NumberInput
                name="total_0_4_years"
                label="Total (0–4 years old) (Optional)"
                placeholder="0"
                register={register}
                errors={errors}
              />

              <TextInput
                name="source"
                label="Source (Optional)"
                placeholder="Enter source..."
                register={register}
                errors={errors}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <HiLocationMarker className="text-dark-blue text-lg" />
              <p className="text-xs">Pin Location in map</p>
            </div>
            <div className="border-dark-blue h-[400px] w-full overflow-hidden rounded-lg border shadow-xl">
              <input
                type="hidden"
                {...register("lat", { required: true, valueAsNumber: true })}
              />
              <input
                type="hidden"
                {...register("long", { required: true, valueAsNumber: true })}
              />

              <BarangayMap
                lat={lat}
                lng={long}
                onChange={({ lng, lat }) => {
                  const numLng = Number(lng);
                  const numLat = Number(lat);

                  setValue("long", numLng, { shouldValidate: true });
                  setValue("lat", numLat, { shouldValidate: true });
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

        {/* BUTTONS */}
        <div className="left-1/2 flex items-center justify-center gap-5">
          <button
            type="submit"
            disabled={isPending}
            className="bg-dark-blue text-puti cursor-pointer rounded px-10 py-2 text-sm hover:opacity-75 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-puti cursor-pointer rounded bg-red-500 px-10 py-2 text-sm hover:opacity-75"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
