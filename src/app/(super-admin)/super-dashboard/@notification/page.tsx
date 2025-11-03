"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { TbMessage2Filled } from "react-icons/tb";
import Image from "next/image";

interface Report {
  id: string;
  reporter_name: string;
  description: string;
  media: string;
  created_at: string;
}

interface RecentCardProps {
  name: string;
  date: string;
  description: string;
  image: string;
}

export const RecentCards = ({
  name,
  date,
  description,
  image,
}: RecentCardProps) => {
  return (
    <div className="border-b-dark-blue/40 flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-red-500"></div>
        <div className="flex flex-col gap-1 text-xs">
          <p>{name}</p>
          <p className="text-[9px] text-gray-600">{date}</p>
          <p className="max-w-[170px] truncate text-[11px]">{description}</p>
        </div>
      </div>
      <div className="relative h-10 w-10 overflow-hidden rounded shadow-md">
        <Image
          src={image}
          alt="report image"
          fill
          className="object-cover object-center"
        />
      </div>
    </div>
  );
};

export default function NotificationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Disaster-backend/pupblic/getIncidents.php",
        );
        setReports(res.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="border-dark-blue/50 h-full w-full rounded-lg border py-4 shadow-lg">
      <h1 className="border-dark-blue/50 flex items-center gap-2 border-b px-6 pb-4 text-sm">
        <TbMessage2Filled className="text-xl" />
        Recent Reports
      </h1>

      <div className="scrollBar mt-5 flex h-[85%] flex-col gap-2 overflow-auto pr-5 pl-6">
        {loading ? (
          <p className="text-center text-sm text-gray-500">
            Loading reports...
          </p>
        ) : reports.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No reports found</p>
        ) : (
          reports.map((r) => (
            <RecentCards
              key={r.id}
              image={`http://localhost/Disaster-backend/uploads/${r.media}`}
              name={r.reporter_name}
              description={r.description}
              date={new Date(r.created_at).toLocaleString()}
            />
          ))
        )}
      </div>
    </div>
  );
}
