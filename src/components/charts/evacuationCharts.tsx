"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  RadialLinearScale,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import { FC } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type EvacuationChartProps = {
  capacity: number;
  evacuees: number;
  classname?: string;
};

// BAR CHART

export const EvacuationBarChart: FC<EvacuationChartProps> = ({
  capacity,
  evacuees,
  classname,
}) => {
  const vacancy = capacity - evacuees;

  const data = {
    labels: ["Capacity", "Evacuees", "Vacancy"],
    datasets: [
      {
        data: [capacity, evacuees, vacancy],
        backgroundColor: ["#2563eb   ", "#C10000 ", "#4CAF50"],
        categoryPercentage: 0.9,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: capacity,
        ticks: {
          precision: 0,
          callback: function (value: string | number) {
            return Number.isInteger(Number(value)) ? value : null;
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// LINE CHART

export const EvacuationLineChart: FC<EvacuationChartProps> = ({
  capacity,
  evacuees,
}) => {
  const vacancy = capacity - evacuees;

  const data = {
    labels: ["Capacity", "Vacancy", "Evacuees"],
    datasets: [
      {
        data: [capacity, vacancy, evacuees],
        fill: true,
        borderColor: "#2563eb",
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: capacity,
        ticks: {
          precision: 0,
          callback: (value: string | number) =>
            Number.isInteger(Number(value)) ? value : null,
        },
        grid: { display: false },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return <Line data={data} options={options} />;
};

// DOUGHNUT CHART

export const EvacuationDoughnutChart: FC<EvacuationChartProps> = ({
  capacity,
  evacuees,
}) => {
  const vacancy = capacity - evacuees;

  const data = {
    labels: ["Capacity", "Evacuees", "Vacancy"],
    datasets: [
      {
        data: [capacity, evacuees, vacancy],
        backgroundColor: ["#2563eb   ", "#C10000 ", "#4CAF50"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 8,
        cornerRadius: 4,
      },
    },
  };

  return (
    <div className="relative z-50 ml-4 flex h-[70%] w-full items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

// PIE CHART

export const EvacuationPieChart: FC<EvacuationChartProps> = ({
  capacity,
  evacuees,
  classname,
}) => {
  const vacancy = capacity - evacuees;

  const data = {
    labels: ["Capacity", "Evacuees", "Vacancy"],
    datasets: [
      {
        data: [capacity, evacuees, vacancy],
        backgroundColor: ["#2563eb   ", "#C10000 ", "#4CAF50"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className={`ml-4 h-[130px] w-[130px] ${classname}`}>
      <Pie data={data} options={options} />
    </div>
  );
};

// POLAR AREA CHART

export const EvacuationPolarAreaChart: FC<EvacuationChartProps> = ({
  capacity,
  evacuees,
}) => {
  const vacancy = capacity - evacuees;

  const data = {
    labels: ["Capacity", "Evacuees", "Vacancy"],
    datasets: [
      {
        data: [capacity, evacuees, vacancy],
        backgroundColor: ["#2563eb   ", "#C10000 ", "#4CAF50"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 8,
        cornerRadius: 4,
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
        grid: {
          color: "#d1d5db",
          lineWidth: 0.1,
        },
        pointLabels: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="ml-4 flex h-[70%] w-full items-center justify-center">
      <PolarArea data={data} options={options} />
    </div>
  );
};
