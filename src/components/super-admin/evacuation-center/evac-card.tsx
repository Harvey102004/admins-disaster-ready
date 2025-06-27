import { GetEvacCard } from "../../../../types";
import { HiLocationMarker } from "react-icons/hi";
import { GoHomeFill } from "react-icons/go";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function EvacuationBarChart({
  capacity,
  evacuees,
}: {
  capacity: number;
  evacuees: number;
}) {
  const vacancy = capacity - evacuees || 0;

  const data = {
    labels: ["Capacity", "Vacancy", "Evacuees"],
    datasets: [
      {
        label: "Evacuation Stats",
        data: [capacity, vacancy, evacuees],
        backgroundColor: ["#6366f1", "#10b981", "#f59e0b"],
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
}

export const EvacuationCard = ({
  onclick,
  name,
  location,
  current_evacuees,
  capacity,
}: GetEvacCard) => {
  return (
    <div className="flex max-w-[280px] flex-col justify-center gap-4 p-5">
      <div>
        <div className="flex items-center gap-2">
          <GoHomeFill className="text-dark-blue text-xl" />
          <h2 className="max-w-[300px] overflow-hidden font-bold text-nowrap text-ellipsis">
            {name}
          </h2>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <HiLocationMarker className="text-xl text-red-500" />
          <p className="max-w-[300px] overflow-hidden text-xs text-nowrap text-ellipsis">
            {location}
          </p>
        </div>
      </div>
      <div className="mt-2">
        <EvacuationBarChart
          capacity={Number(capacity)}
          evacuees={Number(current_evacuees)}
        />
      </div>

      <p
        className="text-dark-blue mt-2 cursor-pointer text-center text-xs underline underline-offset-8"
        onClick={onclick}
      >
        View Details
      </p>
    </div>
  );
};
