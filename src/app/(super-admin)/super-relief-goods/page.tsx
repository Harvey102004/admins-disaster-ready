"use client";
import React, { useState, useMemo } from "react";
import { IoClose } from "react-icons/io5";
import { RiTruckFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { addRelief, getHistory } from "@/server/api/relief";
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
import { FaBoxOpen } from "react-icons/fa6";
import Image from "next/image";
import { MdHistory, MdOutlineHistory } from "react-icons/md";
import { TiArrowBack } from "react-icons/ti";

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
  const [basedOn, setBasedOn] = useState<"population" | "families" | undefined>(
    undefined,
  );

  const [isHistory, setIsHistory] = useState(false);

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
    data: history,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ["reliefHistory"],
    queryFn: getHistory,
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
        "https://greenyellow-lion-623632.hostingersite.com/public/reliefDistribution.php",
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
        queryClient.invalidateQueries({ queryKey: ["reliefHistory"] });
      } else {
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || "Server Error ❌";

      toast.error(msg);
    }
  };

  const handleDistributeEqually = () => {
    if (selectedBrgys.length === 0) {
      return toast.error("Select at least 1 barangay!");
    }

    const perBrgy = Math.floor(
      reliefDetails.total_packs / selectedBrgys.length,
    );

    const updatedAllocations: { [key: string]: number } = {};
    selectedBrgys.forEach((id) => {
      updatedAllocations[id] = perBrgy;
    });

    setManualAllocations(updatedAllocations);
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
          {isHistory ? (
            <>
              <div className="flex items-center gap-3">
                <MdOutlineHistory className="text-2xl" />
                <h2 className="text-2xl font-semibold">Distribution History</h2>
              </div>

              <p
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsHistory(false)}
              >
                {" "}
                <span onClick={() => setIsHistory(true)}>
                  <TiArrowBack />
                </span>
                Back
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <RiTruckFill className="text-2xl" />
                <h2 className="text-2xl font-semibold">Relief Goods</h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsAddFormOpen(true);
                    setServerError("");
                  }}
                  className="bg-dark-blue flex cursor-pointer items-center gap-2 rounded-full py-2.5 pr-4 pl-6 text-xs text-white hover:opacity-90"
                >
                  Add Relief <IoAddSharp />
                </button>

                <button
                  onClick={() => {
                    setIsHistory(true);
                  }}
                  className="bg-dark-blue flex cursor-pointer items-center gap-2 rounded-full py-2.5 pr-4 pl-6 text-xs text-white hover:opacity-90"
                >
                  History <MdHistory />
                </button>
              </div>
            </>
          )}
        </div>

        {isHistory ? (
          // ✅ HISTORY TABLE
          <div className="scrollBar relative mt-10 max-h-[78vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Relief Pack
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Barangay
                  </th>

                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Date Distributed
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-end text-sm font-semibold">
                    Allocated Packs
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoadingHistory
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="p-3">
                            <Skeleton className="h-6 w-full rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : history?.listOfBarangays?.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3 text-[13px]">{item.id}</td>
                        <td className="p-3 text-[13px] capitalize">
                          {item.relief_pack_id}
                        </td>
                        <td className="p-3 text-[13px] capitalize">
                          {item.barangay_id}
                        </td>

                        <td className="p-3 text-[13px]">
                          {new Date(item.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="p-3 text-end text-[13px]">
                          {item.allocated_packs}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ) : (
          // ✅ YOUR ORIGINAL RELIEF PACKS TABLE (UNCHANGED)
          <>
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
                          {Array.from({ length: 5 }).map((_, j) => (
                            <td key={j} className="p-3">
                              <Skeleton className="h-6 w-full rounded-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : data.relief_packs.map((user: any) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3 text-[13px]">{user.id}</td>
                          <td className="p-3 text-[13px]">
                            {user.description}
                          </td>
                          <td className="p-3 text-[13px]">
                            {new Date(user.date_input).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="p-3 text-[13px]">
                            {user.total_packs}
                          </td>
                          <td className="p-3 text-end text-xs">
                            <button
                              disabled={user.total_packs <= 0}
                              onClick={() => {
                                setDistributeForm(true);
                                setReliefDetails({
                                  id: user.id,
                                  name: user.description,
                                  total_packs: user.total_packs,
                                });
                              }}
                              className="bg-dark-blue rounded-full px-3 py-1.5 text-[10px] text-white disabled:bg-gray-400"
                            >
                              Distribute
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* MODAL DISTRIBUTE FORM */}
        {distributeForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="dark:bg-light-black relative w-[70vw] rounded-md bg-white px-10 py-6 shadow-md">
              <IoClose
                onClick={() => setDistributeForm(false)}
                className="absolute top-3 right-3"
              />

              <div className="flex items-center gap-5">
                <FaBoxOpen className="text-3xl" />
                <div className="flex flex-col gap-1">
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
              </div>

              <form className="flex">
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

                <div className="mt-8 flex h-[500px] w-[40%] flex-col gap-8 overflow-hidden rounded-3xl border border-gray-300 p-6 dark:border-none dark:bg-[#1b1c29]">
                  <p className="text-center text-sm font-semibold">
                    Choose a Barangay Recipient
                  </p>

                  {isLoadingBrgyContacts ? (
                    <p className="text-xs text-gray-500">
                      Loading barangays...
                    </p>
                  ) : brgyContacts && brgyContacts.length > 0 ? (
                    <div className="reliefScroll flex flex-col gap-7 overflow-y-auto">
                      {brgyContacts.map((brgy: any) => (
                        <div
                          key={brgy.id}
                          className="flex cursor-pointer items-center gap-4"
                          onClick={() => handleBrgySelection(brgy.id)}
                        >
                          <label className="flex items-center gap-2 text-sm capitalize">
                            <input
                              type="checkbox"
                              value={brgy.id}
                              checked={selectedBrgys.includes(brgy.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleBrgySelection(brgy.id);
                              }}
                              className="h-4 w-4"
                            />
                          </label>

                          <div className="flex items-center gap-4">
                            <Image
                              src={`/logos/${brgy.barangay_name
                                ?.toLowerCase()
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/\s+/g, "-")}-logo.png`}
                              alt={`${brgy.barangay_name} logo`}
                              width={20}
                              height={20}
                              className="h-10 w-10 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />

                            <div className="flex flex-col">
                              <p className="mb-1 text-sm capitalize">
                                Barangay {brgy.barangay_name}
                              </p>
                              <span className="flex items-center gap-2 text-[10px]">
                                <span>Families: {brgy.total_families}</span>
                                <span>
                                  Population:{" "}
                                  {brgy.total_female + brgy.total_male}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="col-span-4 text-center text-sm text-nowrap text-gray-500">
                      No barangays found.
                    </p>
                  )}
                </div>

                <div className="relative mt-10 flex h-[500px] w-[60%] flex-col gap-3 overflow-hidden pr-4 pl-8">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">List of Selected Barangay's : </p>

                    {allocationMode === "manual" && (
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleDistributeEqually}
                          className="bg-dark-blue mx-auto cursor-pointer rounded-lg px-4 py-2 text-center text-[10px] text-white transition-opacity duration-300 hover:opacity-80"
                        >
                          Allocate equally
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="">
                    <div className="absolute bottom-24 flex flex-col gap-3">
                      <p className="text-sm">Allocation Mode :</p>

                      <div className="flex justify-center gap-5">
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
                  </div>

                  <div className="">
                    {/* ✅ Dropdown when AUTOMATIC selected */}
                    {allocationMode === "automatic" && (
                      <>
                        <div className="mt-5">
                          {selectedBrgys.length === 0 ? (
                            <p className="absolute top-[40%] left-1/2 -translate-1/2 text-center text-xs text-gray-500">
                              No Barangay selected
                            </p>
                          ) : (
                            <div className="reliefScroll grid max-h-[250px] grid-cols-2 gap-y-10 overflow-auto overflow-x-hidden">
                              {selectedBrgys.map((id) => {
                                const brgy = brgyContacts.find(
                                  (b: any) => b.id === id,
                                );
                                return (
                                  <div
                                    key={id}
                                    className="flex items-center gap-3 text-sm"
                                  >
                                    <Image
                                      src={`/logos/${brgy.barangay_name
                                        ?.toLowerCase()
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, "")
                                        .replace(/\s+/g, "-")}-logo.png`}
                                      alt={`${brgy.barangay_name} logo`}
                                      width={20}
                                      height={20}
                                      className="h-10 w-10 object-contain"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                    <div className="flex flex-col">
                                      <p className="mb-1 text-sm capitalize">
                                        Barangay {brgy.barangay_name}
                                      </p>
                                      <span className="flex items-center gap-2 text-[10px]">
                                        <span>
                                          Families: {brgy.total_families}
                                        </span>
                                        <span>
                                          Population:{" "}
                                          {brgy.total_female + brgy.total_male}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="absolute right-0 bottom-24">
                          <Select
                            value={basedOn}
                            onValueChange={(value: "population" | "families") =>
                              setBasedOn(value)
                            }
                          >
                            <SelectTrigger className="w-[280px] text-sm">
                              <SelectValue placeholder="Select Distribution Basis" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="population">
                                Population
                              </SelectItem>
                              <SelectItem value="families">Families</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    {/* ✅ Display extra inputs if manual mode */}
                    {allocationMode === "manual" && (
                      <div className="mt-5">
                        {selectedBrgys.length === 0 ? (
                          <p className="absolute top-[40%] left-1/2 -translate-1/2 text-center text-xs text-gray-500">
                            No Barangay selected
                          </p>
                        ) : (
                          <div className="reliefScroll grid max-h-[250px] grid-cols-2 gap-y-10 overflow-auto overflow-x-hidden">
                            {selectedBrgys.map((id) => {
                              const brgy = brgyContacts.find(
                                (b: any) => b.id === id,
                              );
                              return (
                                <div
                                  key={id}
                                  className="flex items-center gap-3 text-sm"
                                >
                                  <Image
                                    src={`/logos/${brgy.barangay_name
                                      ?.toLowerCase()
                                      .normalize("NFD")
                                      .replace(/[\u0300-\u036f]/g, "")
                                      .replace(/\s+/g, "-")}-logo.png`}
                                    alt={`${brgy.barangay_name} logo`}
                                    width={20}
                                    height={20}
                                    className="h-10 w-10 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                  <div className="flex flex-col">
                                    <span className="w-max text-sm capitalize">
                                      Barangay {brgy?.barangay_name}
                                    </span>
                                    <div className="flex items-center">
                                      <p className="text-[11px]">Allocated:</p>
                                      <input
                                        type="number"
                                        min={0}
                                        className="p-1 px-4 text-[11px] outline-none"
                                        value={manualAllocations[id] || ""}
                                        onChange={(e) =>
                                          handleManualAllocationChange(
                                            id,
                                            Number(e.target.value),
                                          )
                                        }
                                        placeholder="Enter Allocation Qty"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleDistribute}
                    className="bg-dark-blue absolute bottom-0 left-1/2 ml-3 w-[95%] -translate-1/2 rounded-md py-3 text-sm text-white duration-300 hover:opacity-85"
                  >
                    Distribute Now
                  </button>
                </div>
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
