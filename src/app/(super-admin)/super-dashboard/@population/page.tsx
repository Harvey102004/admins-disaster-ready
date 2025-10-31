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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PopulationPage() {
  const chartRef = useRef<ChartType<"bar">>(null);
  const { theme } = useTheme(); // ✅ detects current theme ("light" or "dark")

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to create gradient color for bars
  const getGradient = () => {
    const chart = chartRef.current;
    if (!chart) return "rgba(30, 58, 138, 0.8)";
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.9)"); // sky-400
    gradient.addColorStop(1, "rgba(29, 78, 216, 0.9)"); // blue-700
    return gradient;
  };

  const data: ChartData<"bar"> = {
    labels: [
      "Brgy. San Isidro",
      "Brgy. Mabini",
      "Brgy. Del Pilar",
      "Brgy. Malabanan",
      "Brgy. Poblacion",
      "Brgy. Sta. Cruz",
      "Brgy. San Pedro",
      "Brgy. San Juan",
      "Brgy. San Jose",
      "Brgy. Calumpang",
      "Brgy. Bagong Silang",
      "Brgy. San Antonio",
      "Brgy. San Vicente",
      "Brgy. Sto. Niño",
      "Brgy. San Rafael",
      "Brgy. San Roque",
      "Brgy. San Agustin",
    ],
    datasets: [
      {
        label: "Total Population",
        data: [
          2300, 1800, 2500, 1900, 3200, 2100, 2800, 1750, 3000, 2600, 2400,
          2200, 3100, 2000, 2700, 1850, 2950,
        ],
        backgroundColor: () => getGradient(),
        borderColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(56, 189, 248, 1)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        titleColor: theme === "dark" ? "white" : "black",
        bodyColor: theme === "dark" ? "white" : "black",
        backgroundColor:
          theme === "dark"
            ? "rgba(30, 58, 138, 0.9)"
            : "rgba(240, 240, 240, 0.9)",
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
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(128, 128, 128, 0.2)",
        },
      },
      y: {
        ticks: {
          color: theme === "dark" ? "white" : "black",
          font: { family: "Poppins", size: 10 },
        },
        title: {
          display: true,
          text: "Population",
          color: theme === "dark" ? "white" : "black",
          font: { family: "Poppins", size: 11 },
          padding: 10,
        },
        beginAtZero: true,
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(128, 128, 128, 0.2)",
        },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) chart.update();
  }, [theme]);

  if (!mounted) {
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
