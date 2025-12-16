"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getEvacuationCenters } from "@/server/api/evacuation";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EvacuationPage() {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  const labels = data.map((item) => item.name || "Unnamed Center");
  const evacueesData = data.map((item) => item.current_evacuees || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Evacuees",
        data: evacueesData,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 1.5,
        borderRadius: 6,
        barThickness: 28,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
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
        grid: { display: false },
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
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
