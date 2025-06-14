import { LiaEditSolid } from "react-icons/lia";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import {
  GetWeatherProps,
  GetRoadProps,
  GetDisasterProps,
} from "../../../types";

// -------------- WEATHER ADVISORY CARD --------------- //

export const WeatherAdvisoryCard = ({
  title,
  details,
  date_time,
  onclick,
}: GetWeatherProps) => {
  return (
    <div className="dark:bg-itim bg-light-blue border-dark-blue relative flex h-[300px] max-w-[300px] min-w-[300px] flex-1 flex-col gap-5 overflow-hidden rounded-md border p-7 dark:border-gray-500/20">
      <div className="bg-dark-blue absolute -bottom-3 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full blur-[50px]"></div>

      <div className="border-dark-blue/30 flex items-center justify-between border-b pb-3 dark:border-gray-500/20">
        <h1 className="text-dark-blue dark:text-puti max-w-[200px] overflow-hidden font-bold text-nowrap text-ellipsis">
          {title}
        </h1>

        <LiaEditSolid className="text-2xl" />
      </div>

      <div className="border-dark-blue/30 h-[60%] border-b pb-5 dark:border-gray-500/20">
        <p className="line-clamp-8 text-xs">{details}</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[10px]">{date_time}</p>

        <button
          className="text-dark-blue flex cursor-pointer items-center gap-2 text-xs"
          onClick={onclick}
        >
          View More
          <MdOutlineArrowRightAlt />
        </button>
      </div>
    </div>
  );
};

// ------------- ROAD ADVISORY CARD ------------------ //

export const RoadAdvisoryCard = ({
  title,
  details,
  date_time,
  status,
  onclick,
}: GetRoadProps) => {
  return (
    <div className="dark:bg-itim bg-light-blue border-dark-blue relative flex h-[300px] max-w-[300px] min-w-[300px] flex-1 flex-col gap-5 overflow-hidden rounded-md border p-7 dark:border-gray-500/20">
      <div className="bg-dark-blue absolute -bottom-3 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full blur-[50px]"></div>

      <div className="border-dark-blue/30 flex items-center justify-between border-b pb-3 dark:border-gray-500/20">
        <h1 className="text-dark-blue dark:text-puti max-w-[200px] overflow-hidden font-bold text-nowrap text-ellipsis">
          {title}
        </h1>

        <LiaEditSolid className="text-2xl" />
      </div>

      <div className="border-dark-blue/30 h-[60%] border-b pb-5 dark:border-gray-500/20">
        <p className="line-clamp-8 text-xs">{details}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="">
          <p className="mb-2 text-xs">{status}</p>
          <p className="text-[10px]">{date_time}</p>
        </div>

        <button
          className="text-dark-blue flex cursor-pointer items-center gap-2 text-xs"
          onClick={onclick}
        >
          View More
          <MdOutlineArrowRightAlt />
        </button>
      </div>
    </div>
  );
};

// ------------- DISASTER UPDATES CARD ------------------ //

export const DisasterUpdatesCard = ({
  title,
  details,
  date_time,
  disaster_type,
}: GetDisasterProps) => {
  return (
    <div className="dark:bg-itim bg-light-blue border-dark-blue relative flex h-[300px] max-w-[300px] min-w-[300px] flex-1 flex-col gap-5 overflow-hidden rounded-md border p-7 dark:border-gray-500/20">
      <div className="bg-dark-blue absolute -bottom-3 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full blur-[50px]"></div>

      <div className="border-dark-blue/30 flex items-start justify-between border-b pb-3 dark:border-gray-500/20">
        <div className="flex flex-col gap-2">
          <p className="text-dark-blue max-w-[200px] overflow-hidden font-bold text-nowrap text-ellipsis">
            {disaster_type}
          </p>
          <p className="max-w-[190px] overflow-hidden text-xs font-semibold text-nowrap text-ellipsis">
            {title}
          </p>
        </div>

        <LiaEditSolid className="text-2xl" />
      </div>

      <div className="border-dark-blue/30 h-[60%] border-b pb-5 dark:border-gray-500/20">
        <p className="line-clamp-6 text-xs">{details}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="">
          <p className="text-[10px]">{date_time}</p>
        </div>

        <button className="text-dark-blue flex cursor-pointer items-center gap-2 text-xs">
          View More
          <MdOutlineArrowRightAlt />
        </button>
      </div>
    </div>
  );
};
