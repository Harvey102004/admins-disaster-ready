"use client";

import { FaDonate } from "react-icons/fa";

export default function DonationSection() {
  const donations = [
    {
      donorName: "Juan Dela Cruz",
      contact: "09123456789",
      donationType: "Cash",
      amount: 5000,
    },
    {
      donorName: "Maria Santos",
      contact: "maria.santos@gmail.com",
      donationType: "Goods",
      amount: null,
    },
    {
      donorName: "Barangay San Isidro Youth Org",
      contact: "N/A",
      donationType: "Food Packs",
      amount: null,
    },
    {
      donorName: "Pedro Bautista",
      contact: "09127894561",
      donationType: "Cash",
      amount: 1200,
    },
    {
      donorName: "Pedro Bautista",
      contact: "09127894561",
      donationType: "Cash",
      amount: 1200,
    },
    {
      donorName: "Pedro Bautista",
      contact: "09127894561",
      donationType: "Cash",
      amount: 1200,
    },
    {
      donorName: "Pedro Bautista",
      contact: "09127894561",
      donationType: "Cash",
      amount: 1200,
    },
  ];

  const totalCash = donations
    .filter((d) => d.donationType.toLowerCase() === "cash" && d.amount)
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  return (
    <div className="border-dark-blue/50 rounded-xl border bg-gradient-to-tr from-blue-700 to-sky-500 p-6 shadow-lg dark:brightness-90">
      <h1 className="mb-6 ml-4 flex items-center gap-4 text-lg font-semibold text-white">
        <FaDonate /> Recently Received Donations
      </h1>

      <div className="scrollBar max-h-[200px] overflow-auto pr-3">
        <table className="w-full overflow-auto text-sm text-white">
          <thead className="sticky top-0 backdrop-blur-3xl">
            <tr className="border-b border-white/20 text-left">
              <th className="px-4 py-2 font-medium">Donor Name</th>
              <th className="px-4 py-2 font-medium">Contact</th>
              <th className="px-4 py-2 font-medium">Donation Type</th>
              <th className="px-4 py-2 text-right font-medium">Amount (₱)</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation, index) => (
              <tr
                key={index}
                className="border-b border-white/10 transition hover:bg-white/10"
              >
                <td className="px-4 py-2">{donation.donorName}</td>
                <td className="px-4 py-2">{donation.contact}</td>
                <td className="px-4 py-2">{donation.donationType}</td>
                <td className="px-4 py-2 text-right">
                  {donation.amount ? donation.amount.toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
