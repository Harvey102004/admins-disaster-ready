"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getEvacuationCenters } from "@/server/api/evacuation";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

export default function EvacuationPage() {
  // ✅ Fetch evacuation data from DB
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  // ✅ Prepare chart data dynamically
  const labels = data.map((item) => item.name || "Unnamed Center");
  const evacueesData = data.map((item) => item.current_evacuees || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Evacuees",
        data: evacueesData,
        borderColor: "rgba(255, 255, 255, 0.9)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "white",
        pointBorderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1.5,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        titleColor: "white",
        bodyColor: "white",
        backgroundColor: "rgba(30, 58, 138, 0.8)",
        titleFont: { family: "Poppins" },
        bodyFont: { family: "Poppins" },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          font: { family: "Poppins", size: 9 },
          maxRotation: 60,
          minRotation: 40,
        },
      },
      y: {
        ticks: {
          color: "white",
          font: { family: "Poppins", size: 10 },
        },
        title: {
          display: true,
          text: "Number of Evacuees",
          color: "white",
          font: { family: "Poppins", size: 11 },
          padding: 10,
        },
        beginAtZero: true,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // ✅ Handle loading & error states
  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center text-white">
        Loading chart...
      </div>
    );

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center text-red-200">
        Failed to load data.
      </div>
    );

  return (
    <div className="flex h-full w-full flex-col items-center justify-around gap-1 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 p-6 shadow-lg dark:brightness-90">
      <h1 className="text-center text-sm text-white">
        Total Number of Evacuees per Evacuation Center
      </h1>

      <div className="mx-auto flex h-full w-full items-end justify-center rounded-xl p-6 backdrop-blur-sm">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
