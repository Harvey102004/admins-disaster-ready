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
  ChartData,
  Chart as ChartType,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PopulationPage() {
  const chartRef = useRef<ChartType<"bar">>(null);
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ Fetch barangay data
  const { data: barangays = [], isLoading } = useQuery({
    queryKey: ["barangayContacts"],
    queryFn: async () => {
      const res = await axios.get(
        "http://localhost/Disaster-backend/public/barangayContact.php",
      );
      return res.data;
    },
  });

  const brgyArray = Array.isArray(barangays) ? barangays : [];

  // ✅ Extract correct label field: barangay_name
  const labels = brgyArray.map((b: any) => b.barangay_name);

  // ✅ Compute population (even if some are zero)
  const values = brgyArray.map(
    (b: any) => (parseInt(b.total_male) || 0) + (parseInt(b.total_female) || 0),
  );

  console.log("📌 RAW RESPONSE:", barangays);

  // ✅ Dynamic chart color gradient
  const getGradient = () => {
    const chart = chartRef.current;
    if (!chart) return "#1E3A8A";
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.9)");
    gradient.addColorStop(1, "rgba(29, 78, 216, 0.9)");
    return gradient;
  };

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Total Population",
        data: values,
        backgroundColor: () => getGradient(),
        borderColor: "rgba(255,255,255,0.9)",
        borderWidth: 1,
        borderRadius: 6,
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
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "dark" ? "white" : "black",
          font: { family: "Poppins", size: 9 },
          maxRotation: 60,
          minRotation: 40,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === "dark" ? "white" : "black",
          font: { family: "Poppins", size: 10 },
        },
        title: {
          display: true,
          text: "Population",
          color: theme === "dark" ? "white" : "black",
        },
      },
    },
  };

  useEffect(() => {
    chartRef.current?.update();
  }, [theme, barangays]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xs opacity-50">Loading chart…</p>
      </div>
    );
  }

  return (
    <div className="border-dark-blue/50 flex h-full w-full flex-col items-center justify-around rounded-xl border bg-transparent p-6 shadow-lg">
      <h1
        className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}
      >
        Total Population per Barangay in Los Baños
      </h1>
      <div className="mx-auto flex h-full w-full items-end justify-center rounded-xl p-6">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
