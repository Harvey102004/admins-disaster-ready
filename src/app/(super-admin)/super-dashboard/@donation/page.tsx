"use client";

import { getAllDonations } from "@/server/api/donation";
import { useQuery } from "@tanstack/react-query";
import { FaDonate } from "react-icons/fa";

interface Donation {
  id: number;
  payment_intent_id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  status: string;
  created_at: string;
}

export default function DonationSection() {
  const {
    data: donations = [],
    isLoading,
    error,
  } = useQuery<Donation[]>({
    // 2️⃣ Type the query result
    queryKey: ["donations"],
    queryFn: getAllDonations,
  });

  // Only show the 10 most recent donations
  const recentDonations = donations.slice(0, 10);

  // Calculate total amount for "paid" donations
  const totalCash = donations
    .filter((d) => d.status === "paid" && d.amount)
    .reduce((sum: number, d: Donation) => sum + (d.amount ?? 0), 0); // 3️⃣ Type sum & donation

  if (isLoading) return <div>Loading donations...</div>;
  if (error) return <div>Error loading donations</div>;

  return (
    <div className="border-dark-blue/50 rounded-xl border bg-gradient-to-tr from-blue-700 to-sky-500 p-6 shadow-lg dark:brightness-90">
      <div>
        <h1 className="mb-6 ml-4 flex items-center gap-4 text-lg font-semibold text-white">
          <FaDonate /> Recently Received Donations
        </h1>
      </div>

      <div className="scrollBar max-h-[200px] overflow-auto pr-3">
        <table className="w-full overflow-auto text-sm text-white">
          <thead className="sticky top-0 backdrop-blur-3xl">
            <tr className="border-b border-white/20 text-left">
              <th className="px-4 py-2 font-medium">Donor Name</th>
              <th className="px-4 py-2 font-medium">Donor Email</th>
              <th className="px-4 py-2 font-medium">Payment Method</th>
              <th className="px-4 py-2 text-right font-medium">Amount (₱)</th>
            </tr>
          </thead>

          <tbody>
            {recentDonations.map((donation: Donation) => (
              <tr
                key={donation.id}
                className="border-b border-white/10 transition hover:bg-white/10"
              >
                <td className="px-4 py-2">{donation.donor_name || "-"}</td>
                <td className="px-4 py-2">{donation.donor_email || "-"}</td>
                <td className="px-4 py-2">{donation.payment_method || "-"}</td>
                <td className="px-4 py-2 text-right">
                  {donation.amount?.toLocaleString() || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
