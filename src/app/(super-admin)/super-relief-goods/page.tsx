"use client";
import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { RiTruckFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { addRelief } from "@/server/api/relief";
import { IoAddSharp } from "react-icons/io5";
import { toast } from "sonner";
import { getReliefs } from "@/server/api/relief";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { getBrgyContacts } from "@/server/api/brgyContacts";
import { useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoutes";

interface ReliefFormData {
  description: string;
  total_packs: number;
  date_input: string;
}

export default function ReliefGoods() {
  const queryClient = useQueryClient();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [reliefDetails, setReliefDetails] = useState({
    id: "",
    name: "",
    total_packs: 0,
  });
  const [distributeForm, setDistributeForm] = useState(false);
  const [selectedBrgys, setSelectedBrgys] = useState<string[]>([]);
  const [allocationMode, setAllocationMode] = useState<"automatic" | "manual">(
    "automatic",
  );
  const [manualAllocations, setManualAllocations] = useState<{
    [key: string]: number;
  }>({});
  const [basedOn, setBasedOn] = useState<"population" | "families">(
    "population",
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReliefFormData>({
    defaultValues: {
      description: "",
      total_packs: 0,
      date_input: new Date().toISOString().split("T")[0],
    },
  });

  // SUBMIT FORM LOGIC

  const onSubmit = async (data: ReliefFormData) => {
    try {
      setServerError("");

      const response = await addRelief(data);
      if (response?.success) {
        toast.success("Relief Goods Added ✅");
        reset();
        setIsAddFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ["reliefs"] });
      } else {
        // ✅ Show backend message in form
        setServerError(response?.message || "Failed to add relief");
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.error || "Server Error ❌");
      console.error(error);
    }
  };

  // DATA OF RELIEF GOODS

  const { data, isLoading, error } = useQuery({
    queryKey: ["reliefs"],
    queryFn: getReliefs,
  });

  const {
    data: brgyContacts,
    isLoading: isLoadingBrgyContacts,
    error: errorBrgyContacts,
  } = useQuery({
    queryKey: ["brgyContacts"],
    queryFn: getBrgyContacts,
  });

  const handleBrgySelection = (id: string) => {
    setSelectedBrgys((prev) =>
      prev.includes(id)
        ? prev.filter((brgyId) => brgyId !== id)
        : [...prev, id],
    );
  };

  const handleManualAllocationChange = (brgyId: string, value: number) => {
    setManualAllocations((prev) => ({
      ...prev,
      [brgyId]: value,
    }));
  };

  const handleDistribute = async () => {
    if (selectedBrgys.length === 0) {
      return toast.error("Select at least 1 barangay!");
    }

    let payload: any = {
      relief_pack_id: Number(reliefDetails.id),
      selected_barangays: selectedBrgys.map((id) => Number(id)),
      allocation_mode: allocationMode,
    };

    if (allocationMode === "manual") {
      const totalManual = Object.values(manualAllocations).reduce(
        (a, b) => a + b,
        0,
      );

      if (totalManual > reliefDetails.total_packs) {
        return toast.error("Total allocated packs exceeds available packs!");
      }

      payload.manual_allocations = manualAllocations;
    } else {
      payload.based_on = basedOn;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/public/reliefDistribution.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const result = response.data;

      let errorMsg =
        result.message ||
        result.error ||
        result.errors ||
        "Distribution Failed ❌";

      if (result.success) {
        toast.success("Distribution Successful ✅", {
          style: { marginLeft: "160px" },
        });
        setDistributeForm(false);
        setSelectedBrgys([]);
        setManualAllocations({});
        queryClient.invalidateQueries({ queryKey: ["reliefs"] });
      } else {
        toast.error(errorMsg, { style: { marginLeft: "160px" } });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Server Error ❌", { style: { marginLeft: "160px" } });
    }
  };

  const remainingPacks = useMemo(() => {
    const totalAllocated = Object.values(manualAllocations).reduce(
      (sum, val) => sum + val,
      0,
    );
    return Math.max(reliefDetails.total_packs - totalAllocated, 0);
  }, [manualAllocations, reliefDetails.total_packs]);

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-full overflow-auto px-10 py-8 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RiTruckFill className="text-2xl" />
            <h2 className="text-2xl font-semibold">Relief Goods</h2>
          </div>

          <button
            onClick={() => {
              setIsAddFormOpen(true);
              setServerError("");
            }}
            className="bg-dark-blue flex cursor-pointer items-center gap-2 rounded-full py-2.5 pr-4 pl-6 text-xs text-white hover:opacity-90"
          >
            Add Relief <IoAddSharp />
          </button>
        </div>

        {/* RELIEF GOODS TABLE */}
        <div className="scrollBar relative mt-10 max-h-[78vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Name
                </th>

                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Date added
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Total packs
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-end text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="p-3">
                          <Skeleton className="h-6 w-full rounded-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data.relief_packs.map((user: any) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3 text-[13px]">{user.id}</td>
                      <td className="p-3 text-[13px]">{user.description}</td>
                      <td className="p-3 text-[13px]">
                        {new Date(user.date_input).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-[13px]">{user.total_packs}</td>
                      <td className="p-3 text-end text-xs">
                        <button
                          disabled={remainingPacks < 0}
                          onClick={() => {
                            setDistributeForm(true);
                            setReliefDetails((prev) => ({
                              ...prev,
                              id: user.id,
                              name: user.description,
                              total_packs: user.total_packs,
                            }));
                          }}
                          className="bg-dark-blue rounded-full px-3 py-1.5 text-[10px] text-white"
                        >
                          Distribute
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* MODAL DISTRIBUTE FORM */}
        {distributeForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="dark:bg-light-black relative w-[800px] rounded-md bg-white px-10 py-6 shadow-md">
              <IoClose
                onClick={() => setDistributeForm(false)}
                className="absolute top-3 right-3"
              />

              <div className="flex flex-col gap-3">
                <h1 className="text-lg font-medium">
                  Distribute Relief
                  <span className="ml-2"> - </span>
                  <span className="ml-2 font-semibold">
                    {reliefDetails.name}
                  </span>
                </h1>
                <p>
                  Available packs:{" "}
                  <span className={remainingPacks <= 0 ? "text-red-500" : ""}>
                    {remainingPacks}{" "}
                    <span className="text-xs">
                      {remainingPacks === 0 && "( Out of stocks! )"}
                    </span>
                  </span>
                </p>{" "}
              </div>

              <form>
                <input
                  type="hidden"
                  name="relief_pack_id"
                  value={reliefDetails.id}
                />
                <input
                  type="hidden"
                  name="selected_barangays"
                  value={selectedBrgys}
                />

                <div className="mt-10 grid grid-cols-5 gap-3">
                  {isLoadingBrgyContacts ? (
                    <p className="text-xs text-gray-500">
                      Loading barangays...
                    </p>
                  ) : brgyContacts && brgyContacts.length > 0 ? (
                    brgyContacts.map((brgy: any) => (
                      <label
                        key={brgy.id}
                        className="flex items-center gap-2 text-sm capitalize"
                      >
                        <input
                          type="checkbox"
                          value={brgy.id}
                          checked={selectedBrgys.includes(brgy.id)}
                          onChange={() => handleBrgySelection(brgy.id)}
                          className="h-4 w-4"
                        />
                        {brgy.barangay_name}
                      </label>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-sm text-nowrap text-gray-500">
                      No barangays found.
                    </p>
                  )}
                </div>

                <div className="mt-14 flex gap-4">
                  <p className="text-sm">Allocation Mode :</p>

                  <div className="flex gap-5">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={allocationMode === "automatic"}
                        onChange={() => setAllocationMode("automatic")}
                      />
                      Automatic
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={allocationMode === "manual"}
                        onChange={() => setAllocationMode("manual")}
                      />
                      Manual
                    </label>
                  </div>
                </div>

                {/* ✅ Dropdown when AUTOMATIC selected */}
                {allocationMode === "automatic" && (
                  <div className="mt-14 flex items-center gap-4">
                    <p className="mb-1 text-sm">Based On :</p>
                    <Select
                      value={basedOn}
                      onValueChange={(value: "population" | "families") =>
                        setBasedOn(value)
                      }
                    >
                      <SelectTrigger className="w-48 text-sm">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="population">Population</SelectItem>
                        <SelectItem value="families">Families</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {/* ✅ Display extra inputs if manual mode */}
                {allocationMode === "manual" && (
                  <div className="mt-14">
                    <p className="mb-2 text-sm font-semibold">
                      Enter Manual Allocation per Barangay:
                    </p>

                    {selectedBrgys.length === 0 ? (
                      <p className="my-10 text-center text-sm text-gray-500">
                        No Barangay selected
                      </p>
                    ) : (
                      <div className="mt-7 grid grid-cols-3 gap-3">
                        {selectedBrgys.map((id) => {
                          const brgy = brgyContacts.find(
                            (b: any) => b.id === id,
                          );
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-28 capitalize">
                                {brgy?.barangay_name}
                              </span>
                              <input
                                type="number"
                                min={0}
                                className="w-full rounded border px-2 py-1"
                                value={manualAllocations[id] || ""}
                                onChange={(e) =>
                                  handleManualAllocationChange(
                                    id,
                                    Number(e.target.value),
                                  )
                                }
                                placeholder="Qty"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDistribute}
                  className="bg-dark-blue mt-8 w-full rounded-md py-3 text-sm text-white"
                >
                  Distribute Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MODAL ADD FORM */}
        {isAddFormOpen && (
          <div
            onClick={() => setIsAddFormOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit(onSubmit)}
              className="dark:bg-light-black relative flex w-max min-w-[600px] flex-col gap-6 rounded-lg bg-white px-10 py-6 shadow-xl"
            >
              <IoClose
                className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-700 hover:text-red-500"
                onClick={() => setIsAddFormOpen(false)}
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-center text-xl font-semibold">
                  Add New Relief
                </h2>
                <p className="text-center text-sm text-gray-500">
                  Enter details to add new relief goods.
                </p>
              </div>

              {/* Inputs */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-3 text-xs">Name *</p>
                  <input
                    {...register("description", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Too short name",
                      },
                    })}
                    type="text"
                    autoComplete="off"
                    placeholder="Enter relief goods name..."
                    className="focus:ring-dark-blue/50 w-full rounded border p-3 text-sm outline-none focus:ring"
                  />
                  {errors.description && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs">Total Quantity ( Packs ) *</p>

                  <input
                    {...register("total_packs", {
                      required: "Total packs is required",
                      min: { value: 1, message: "Minimum of 1 pack" },
                    })}
                    type="number"
                    autoComplete="off"
                    placeholder="Total Packs"
                    className="focus:ring-dark-blue/50 w-full rounded border p-3 text-sm outline-none focus:ring"
                  />
                  {errors.total_packs && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.total_packs.message}
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs">Date *</p>
                  <input
                    {...register("date_input", { required: true })}
                    type="date"
                    className="w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {serverError && (
                <p className="mt-1 text-center text-sm text-red-600">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-dark-blue rounded-md px-6 py-3 text-sm text-white disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Relief"}
              </button>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
