"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FaBuildingShield, FaPowerOff } from "react-icons/fa6";
import { EvacuationCenterProps } from "../../../../types";
import axios from "axios";
import { successToast, errorToast } from "@/components/toast";
import { MobileEvacuationLineChart } from "@/components/charts/evacuationCharts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  editEvacuationCenterSchema,
  EditEvacuationCenterSchema,
} from "@/lib/schema/evacuation";
import { useMutation } from "@tanstack/react-query";
import { editEvacuationCenter } from "@/server/api/evacuation";
import { useRouter } from "next/navigation";
import { HiddenInput } from "@/components/Inputs";
import { LuMinus, LuPlus } from "react-icons/lu";

export default function MobileEvacPage() {
  const [evacList, setEvacList] = useState<EvacuationCenterProps[]>([]);
  const [filteredList, setFilteredList] = useState<EvacuationCenterProps[]>([]);
  const [selectedEvac, setSelectedEvac] =
    useState<EvacuationCenterProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogout, setIsLogout] = useState(false);
  const [operation, setOperation] = useState<"add" | "deduct">("add");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingFormData, setPendingFormData] =
    useState<EditEvacuationCenterSchema | null>(null);

  const [isMobile, setIsMobile] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || "";

      const mobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
      setIsMobile(mobile);

      if (!mobile) {
        router.push("/login");
      }
    }
  }, [router]);

  const [inputNumber, setInputNumber] = useState<string>("");

  // Fetch evacuation centers
  useEffect(() => {
    const fetchEvac = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php",
          { withCredentials: true },
        );

        const allEvacs = res.data || [];

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const barangay = user.barangay?.toLowerCase();

        const filtered = allEvacs.filter((ev: any) => {
          const parts =
            ev.created_by
              ?.split(",")
              .map((p: string) => p.trim().toLowerCase()) || [];
          return parts.includes(barangay);
        });

        setEvacList(allEvacs);
        setFilteredList(filtered);
      } catch (err: any) {
        console.error(
          "Failed to fetch evacuation centers:",
          err.response || err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvac();
  }, []);

  if (!isMobile) {
    return null; // prevents showing mobile UI before redirect
  }

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EditEvacuationCenterSchema>({
    resolver: zodResolver(editEvacuationCenterSchema),
  });

  // Reset form when selectedEvac changes
  useEffect(() => {
    if (selectedEvac) {
      reset({
        name: selectedEvac.name,
        location: selectedEvac.location,
        capacity: selectedEvac.capacity,
        current_evacuees: selectedEvac.current_evacuees,
        contact_person: selectedEvac.contact_person,
        contact_number: selectedEvac.contact_number,
        lat: selectedEvac.lat ?? undefined,
        long: selectedEvac.long ?? undefined,
        created_by: selectedEvac.created_by,
      });
      setInputNumber("");
    }
  }, [selectedEvac, reset]);

  // Mutation for editing evacuation center
  const { mutate, isPending } = useMutation({
    mutationKey: ["editEvacuationCenter"],
    mutationFn: async (formData: EditEvacuationCenterSchema) => {
      return await editEvacuationCenter({
        id: selectedEvac?.id?.toString() || "",
        data: formData,
      });
    },
    onSuccess: (_, variables) => {
      // Update selectedEvac immediately
      if (selectedEvac) {
        const updated = {
          ...selectedEvac,
          ...variables, // contains updated fields
        };

        setSelectedEvac(updated);

        // Update filteredList
        setFilteredList((prev) =>
          prev.map((ev) => (ev.id === updated.id ? updated : ev)),
        );

        // Update full list
        setEvacList((prev) =>
          prev.map((ev) => (ev.id === updated.id ? updated : ev)),
        );
      }

      successToast("Success!", "Evacuation center updated successfully!");
    },
    onError: (error: any) => {
      errorToast("Oops!", error?.message || "Something went wrong");
    },
  });

  const onSubmit = (formData: EditEvacuationCenterSchema) => {
    const current = selectedEvac?.current_evacuees ?? 0;
    const input = Number(inputNumber) || 0;
    const capacity = selectedEvac?.capacity ?? 0;

    if (input <= 0) {
      errorToast("Oops!", "Please enter a number greater than 0.");
      return;
    }

    // ADD VALIDATION
    if (operation === "add" && current + input > capacity) {
      errorToast("Oops!", `Cannot add ${input}. Capacity exceeded.`);
      return;
    }

    // DEDUCT VALIDATION
    if (operation === "deduct" && current - input < 0) {
      errorToast(
        "Oops!",
        `Cannot deduct ${input}. Evacuees cannot go below 0.`,
      );
      return;
    }

    // APPLY NEW VALUE MANUALLY
    const newEvacCount =
      operation === "add" ? current + input : Math.max(0, current - input);

    setValue("current_evacuees", newEvacCount);

    setPendingFormData({ ...formData, current_evacuees: newEvacCount });
    setShowConfirm(true);
  };

  const handleSelect = (id: string) => {
    const evac = filteredList.find((e) => e.id!.toString() === id);
    setSelectedEvac(evac || null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  const cap = Number(selectedEvac?.capacity) || 0;
  const evacs = Number(selectedEvac?.current_evacuees) || 0;
  const vacancy = cap - evacs;
  const vacancyRate = cap > 0 ? (vacancy / cap) * 100 : 0;

  let statusLabel = "Unknown";
  let statusTextColor = "text-gray-400";
  if (cap === 0) statusLabel = "No capacity data";
  else if (vacancy === 0) {
    statusLabel = "Not Available (Full)";
    statusTextColor = "text-red-600";
  } else if (vacancyRate < 50) {
    statusLabel = "Almost full";
    statusTextColor = "text-yellow-400";
  } else {
    statusLabel = "Plenty of space";
    statusTextColor = "text-green-500";
  }

  const confirmMessage =
    operation === "add" ? (
      <>
        Are you sure you want to{" "}
        <span className="text-green-600">add {inputNumber}</span> evacuees ?
      </>
    ) : (
      <>
        Are you sure you want to{" "}
        <span className="text-red-600">deduct {inputNumber}</span> evacuees ?
      </>
    );

  return (
    <div className="relative flex min-h-screen flex-col gap-5 p-4">
      <FaPowerOff
        onClick={() => setIsLogout(true)}
        className="absolute top-5 right-5 text-xl dark:text-white"
      />

      {filteredList.length === 0 ? (
        <div className="flex min-h-screen items-center justify-center p-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-500">
            No evacuation centers have been added for your account.
          </p>
        </div>
      ) : (
        <div className="mt-16">
          <h2 className="mb-5 text-center text-sm font-semibold">
            Your Evacuation Center
          </h2>

          {/* SELECT DROPDOWN */}
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="mx-auto w-[90%] !p-5 text-xs">
              <SelectValue placeholder="Select evacuation center" />
            </SelectTrigger>
            <SelectContent>
              {filteredList
                .filter((ev) => ev.id !== undefined)
                .map((ev) => (
                  <SelectItem
                    key={ev.id}
                    value={ev.id!.toString()}
                    className="p-2 text-[10px]"
                  >
                    {ev.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* If no evacuation center selected yet */}
          {!selectedEvac && (
            <div className="absolute top-1/2 left-1/2 flex w-3/4 -translate-1/2 flex-col items-center justify-center gap-4">
              <FaBuildingShield className="text-3xl" />
              <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Please select an evacuation center from the dropdown above to
                display its information{" "}
              </p>
            </div>
          )}

          {/* DISPLAY DETAILS */}
          {selectedEvac && (
            <div className="mt-5">
              <div className="mt-8 flex items-center justify-center gap-3">
                <p className={`text-xs ${statusTextColor}`}>{statusLabel}</p>
                <div
                  className={`h-3 w-3 rounded-full ${statusTextColor.replace(
                    "text-",
                    "bg-",
                  )}`}
                />
              </div>

              <div className="mt-8 flex h-[160px] items-center justify-center px-4">
                <MobileEvacuationLineChart
                  capacity={selectedEvac.capacity}
                  evacuees={selectedEvac.current_evacuees ?? 0}
                />
              </div>

              <div className="mt-4 grid grid-cols-3">
                <p className="flex flex-col items-center gap-2 text-xs">
                  <span>Capacity</span>
                  {selectedEvac.capacity}
                </p>
                <p className="flex flex-col items-center gap-2 text-xs">
                  <span>Vacancy</span>
                  {(selectedEvac.capacity ?? 0) -
                    (selectedEvac.current_evacuees ?? 0)}
                </p>
                <p className="flex flex-col items-center gap-2 text-xs">
                  <span>Evacuees</span>
                  {selectedEvac.current_evacuees}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center gap-8 rounded-xl px-10 py-8"
              >
                <p className="text-dark-blue/70 dark:text-puti/60 mb-3 text-center text-[10px]">
                  Input a number and choose Add or Deduct to update the evacuee
                  count.
                </p>

                {/* Hidden inputs */}
                <HiddenInput name="name" register={register} errors={errors} />
                <HiddenInput
                  name="capacity"
                  register={register}
                  errors={errors}
                />
                <HiddenInput
                  name="location"
                  register={register}
                  errors={errors}
                />
                <HiddenInput name="lat" register={register} errors={errors} />
                <HiddenInput name="long" register={register} errors={errors} />
                <HiddenInput
                  name="contact_person"
                  register={register}
                  errors={errors}
                />
                <HiddenInput
                  name="contact_number"
                  register={register}
                  errors={errors}
                />
                <HiddenInput
                  name="current_evacuees"
                  register={register}
                  errors={errors}
                />

                {/* User input number */}
                <input
                  type="number"
                  placeholder="Enter number"
                  value={inputNumber}
                  onChange={(e) => {
                    // Remove leading zeros automatically
                    const val = e.target.value.replace(/^0+/, "");
                    setInputNumber(val);
                  }}
                  className="w-full rounded-md border border-gray-500/50 p-3 text-xs outline-none"
                />

                <div className="flex w-full items-center justify-center gap-4">
                  {/* ADD */}
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-6 py-2 text-xs transition ${
                      operation === "add"
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="add"
                      checked={operation === "add"}
                      onChange={() => setOperation("add")}
                      className="hidden"
                    />
                    Add
                    <LuPlus className="text-sm" />
                  </label>

                  {/* DEDUCT */}
                  <label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs transition ${
                      operation === "deduct"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="deduct"
                      checked={operation === "deduct"}
                      onChange={() => setOperation("deduct")}
                      className="hidden"
                    />
                    Deduct
                    <LuMinus className="text-sm" />
                  </label>
                </div>

                <div className="flex w-full items-center gap-8">
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`bg-dark-blue text-puti mt-4 w-full rounded-md border py-2.5 text-xs transition-all duration-300 ${
                      isPending
                        ? "cursor-not-allowed opacity-60"
                        : "hover:opacity-90"
                    }`}
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Save Changes Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="dark:bg-light-black relative w-[80%] rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              Confirm Save
            </h3>
            <p className="mb-6 text-center text-[10px] text-gray-600 dark:text-gray-300">
              {confirmMessage}
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[10px] text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>

              <button
                className="rounded-md bg-blue-600 px-4 py-1.5 text-[10px] text-white transition hover:bg-blue-700"
                onClick={() => {
                  if (pendingFormData) mutate(pendingFormData);
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout modal */}
      {isLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setIsLogout(false)}
        >
          <div
            className="dark:bg-light-black relative w-[80%] rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              Confirm Logout
            </h3>
            <p className="mb-6 text-center text-[10px] text-gray-600 dark:text-gray-300">
              Are you sure you want to logout? You will need to login again to
              access your account.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[10px] text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={() => setIsLogout(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-red-600 px-4 py-1.5 text-[10px] text-white transition hover:bg-red-700"
                onClick={async () => {
                  try {
                    await axios.get(
                      "https://greenyellow-lion-623632.hostingersite.com/public/logout.php",
                      {
                        withCredentials: true,
                      },
                    );
                    successToast("Success!", "Logout completed successfully");
                  } catch (error) {
                    console.error(
                      "Logout failed (maybe already logged out):",
                      error,
                    );
                  } finally {
                    localStorage.removeItem("user");
                    setIsLogout(false);
                    router.push("/mobile-login");
                    router.refresh();
                  }
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
