"use client";

import ProtectedRoute from "@/components/ProtectedRoutes";
import { getAllDonations } from "@/server/api/donation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { RiCoinsFill, RiFilter2Fill } from "react-icons/ri";
import { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface DonationProps {
  id: string | number;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at?: string;
}

export default function SuperAdminDonationManagement() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: getAllDonations,
  });

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatAmount = (amount: number) =>
    `₱ ${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;

  // ✅ Filter + Sort Logic
  const filteredData = useMemo(() => {
    let filtered = [...data];
    const safeStatusFilter = filterStatus.toLowerCase();
    const safeMethodFilter = filterMethod.toLowerCase();

    if (filterStatus !== "All") {
      filtered = filtered.filter((d) => {
        const status = d.status?.toLowerCase() || "";
        return status === safeStatusFilter;
      });
    }

    if (filterMethod !== "All") {
      filtered = filtered.filter((d) => {
        const method = d.payment_method?.toLowerCase() || "";
        return method === safeMethodFilter;
      });
    }

    filtered.sort((a, b) =>
      sortOrder === "Newest"
        ? new Date(b.created_at! ?? "").getTime() -
          new Date(a.created_at! ?? "").getTime()
        : new Date(a.created_at! ?? "").getTime() -
          new Date(b.created_at! ?? "").getTime(),
    );

    return filtered;
  }, [data, filterStatus, filterMethod, sortOrder]);

  const totalAmount = filteredData.reduce(
    (sum: number, donation: DonationProps) => sum + Number(donation.amount),
    0,
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen max-h-screen w-full flex-col overflow-auto px-14 py-10 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RiCoinsFill className="text-2xl" />
            <h2 className="text-xl font-semibold">Donations Management</h2>
          </div>

          {/* ✅ Filters Section */}
          <div>
            <div className="flex items-center justify-end gap-4">
              {/* Payment Method Filter */}
              <Select value={filterMethod} onValueChange={setFilterMethod}>
                <SelectTrigger className="min-w-[140px] text-xs">
                  <SelectValue placeholder="Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs">
                    All Methods
                  </SelectItem>
                  <SelectItem value="gcash" className="text-xs">
                    GCash
                  </SelectItem>
                  <SelectItem value="card" className="text-xs">
                    Card
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Sorting */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="min-w-[130px] text-xs">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newest" className="text-xs">
                    Newest First
                  </SelectItem>
                  <SelectItem value="Oldest" className="text-xs">
                    Oldest First
                  </SelectItem>
                </SelectContent>
              </Select>

              <RiFilter2Fill className="text-2xl" />
            </div>
          </div>
        </div>

        {/* ✅ Table */}
        <div className="scrollBar relative mt-6 max-h-[73vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Donor Name
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Payment Method
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-end text-sm font-semibold">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="p-3">
                        <Skeleton className="h-6 w-full rounded-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                <>
                  {filteredData.map((donation: DonationProps) => (
                    <tr key={donation.id} className="border-b">
                      <td className="p-3 text-[13px]">{donation.id}</td>
                      <td className="p-3 text-[13px]">
                        {donation.donor_name || "-"}
                      </td>
                      <td className="p-3 text-[13px]">
                        {donation.donor_email || "-"}
                      </td>
                      <td className="p-3 text-[13px] capitalize">
                        {donation.payment_method}
                      </td>

                      <td className="p-3 text-[13px]">
                        {donation.created_at
                          ? formatDate(donation.created_at)
                          : "-"}
                      </td>
                      <td className="p-3 text-right text-[13px]">
                        {formatAmount(donation.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* ✅ TOTAL ROW */}
                  <tr className="border-t">
                    <td colSpan={5} className="px-3 py-4 text-sm font-semibold">
                      Total:
                    </td>
                    <td className="px-3 py-4 text-right text-sm font-semibold">
                      {formatAmount(totalAmount)}
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={7} className="py-5 text-center text-gray-500">
                    No donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
