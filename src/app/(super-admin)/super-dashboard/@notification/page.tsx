import { TbMessage2Filled } from "react-icons/tb";
import Image from "next/image";

interface NotifTypes {
  name: string;
  date: string;
  description: string;
  image: string;
}

export const RecentCards = ({ name, date, description, image }: NotifTypes) => {
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
          alt="sample"
          fill
          className="object-cover object-center"
        />
      </div>
    </div>
  );
};

export default function NotificationPage() {
  const sampleReports = [
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
    {
      name: "Harvey Adorco",
      date: "Oct 20 2025 | 10:00 PM ",
      image: "/logos/sample.jpg",
      description: " Meron po ditong natumbang puno sa may bandang lakewood",
    },
  ];

  return (
    <div className="border-dark-blue/50 h-full w-full rounded-lg border py-4 shadow-lg">
      <h1 className="border-dark-blue/50 flex items-center gap-2 border-b px-6 pb-4 text-sm">
        {" "}
        <TbMessage2Filled className="text-xl" />
        Recent Reports
      </h1>
      <div className="scrollBar mt-5 flex h-[85%] flex-col gap-2 overflow-auto pr-5 pl-6">
        {sampleReports.map((reports, i) => (
          <RecentCards
            key={i}
            image={reports.image}
            name={reports.name}
            description={reports.description}
            date={reports.date}
          />
        ))}
      </div>
    </div>
  );
}
