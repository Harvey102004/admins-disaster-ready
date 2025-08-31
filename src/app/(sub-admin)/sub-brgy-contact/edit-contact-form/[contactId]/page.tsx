"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { brgyContactSchema } from "@/lib/schema/brgyContacts";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import {
  editBrgyContact,
  getBrgyContactDetails,
} from "@/server/api/brgyContacts";

import { GoHomeFill } from "react-icons/go";
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaPhone, FaUser } from "react-icons/fa6";
import { ImPhoneHangUp } from "react-icons/im";
import { HiLocationMarker } from "react-icons/hi";
import dynamic from "next/dynamic";

import { TextInput } from "@/components/Inputs";
import NoIdFound from "@/components/NoIdFound";
import { showEditConfirmation } from "@/lib/toasts";
import Loader from "@/components/loading";

type BrgyContactForm = z.infer<typeof brgyContactSchema>;

const BarangayMap = dynamic(() => import("@/components/maps/brgy-map-add"), {
  ssr: false,
});

export default function AddContactForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { contactId } = useParams() as { contactId: string };

  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ["brgyContactDetails", contactId],
    queryFn: () => getBrgyContactDetails({ id: contactId }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(brgyContactSchema) });

  // ✅ Single state variable for map position
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number }>({
    lat: 14.1717,
    lng: 121.2436,
  });

  // ✅ Initialize form and map position when data loads
  useEffect(() => {
    if (data) {
      const lat = Number(data.lat) || 14.1717;
      const lng = Number(data.long) || 121.2436;

      setMapPosition({ lat, lng });

      reset({
        barangay_name: data.barangay_name,
        captain_name: data.captain_name,
        secretary_name: data.secretary_name,
        email: data.email,
        contact_number: data.contact_number,
        facebook_page: data.facebook_page,
        landline: data.landline,
        lat,
        long: lng,
      });
    }
  }, [data, reset]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["editBrgyContact"],
    mutationFn: async (formData: BrgyContactForm) => {
      return await toast.promise(
        editBrgyContact({ id: contactId, data: formData }),
        {
          loading: "Updating barangay contact...",
          success: "Barangay contact updated successfully!",
          error: (error: any) => error?.message || "Something went wrong",
          position: "bottom-right",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brgyContacts"] });
      router.back();
    },
  });

  const onSubmit = (formData: BrgyContactForm) => {
    const unchanged =
      formData.barangay_name.trim() === data?.barangay_name.trim() &&
      formData.captain_name.trim() === data?.captain_name.trim() &&
      formData.secretary_name.trim() === data?.secretary_name.trim() &&
      formData.email.trim() === data?.email.trim() &&
      formData.contact_number.trim() === data?.contact_number.trim() &&
      formData.facebook_page.trim() === data?.facebook_page.trim() &&
      formData.landline.trim() === data?.landline.trim() &&
      Number(formData.lat) === Number(data?.lat) &&
      Number(formData.long) === Number(data?.long);

    if (unchanged) {
      toast.error("No changes detected.");
      return;
    }

    showEditConfirmation({ onConfirm: () => mutate(formData) });
  };

  if (isLoading || isRefetching) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center bg-black/30 backdrop-blur-sm">
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
    return <NoIdFound message="Barangay Contact" />;
  }

  return (
    <div className="flex h-[85vh] flex-col items-center gap-10 p-6">
      <form
        className="flex w-full flex-col gap-7 pb-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-10">
          {/* LEFT SIDE */}
          <div className="flex w-1/2 flex-col gap-4">
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
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-1/2 flex-col gap-5">
            <TextInput
              name="facebook_page"
              icon={<FaFacebook />}
              label="Facebook page"
              register={register}
              errors={errors}
              placeholder="Enter brgy facebook page..."
            />

            <div>
              <div className="mb-2 flex items-center gap-2">
                <HiLocationMarker className="text-dark-blue text-lg" />
                <p className="text-xs">Pin Location in map</p>
              </div>

              <div className="border-dark-blue relative h-[400px] w-full overflow-hidden rounded-lg border shadow-xl">
                {/* Hidden RHF inputs */}
                <input
                  type="hidden"
                  {...register("lat", { required: true, valueAsNumber: true })}
                />
                <input
                  type="hidden"
                  {...register("long", { required: true, valueAsNumber: true })}
                />

                {/* Map */}
                <BarangayMap
                  lat={mapPosition.lat}
                  lng={mapPosition.lng}
                  onChange={({ lat, lng }) => {
                    const numLat = Number(lat);
                    const numLng = Number(lng);

                    setMapPosition({ lat: numLat, lng: numLng }); // Update marker
                    setValue("lat", numLat, { shouldValidate: true }); // Update form
                    setValue("long", numLng, { shouldValidate: true });
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
