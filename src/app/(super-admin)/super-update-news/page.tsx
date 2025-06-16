"use client";

import { CgMenuGridR } from "react-icons/cg";
import { FaCloud, FaRoad } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import {
  EmptyUpdatesProps,
  GetWeatherProps,
  GetRoadProps,
  GetDisasterProps,
  GetCommunityProps,
} from "../../../../types";
import axios from "axios";
import {
  WeatherAdvisoryForm,
  RoadAdvisoryForm,
  DisasterUpdatesForm,
  CommunityNoticeForm,
} from "@/components/update-news/updates-forms";
import { FaUsers } from "react-icons/fa6";
import {
  RoadAdvisoryCard,
  WeatherAdvisoryCard,
  DisasterUpdatesCard,
} from "@/components/update-news/update-card";

import {
  RoadAdvisoryDetails,
  WeatherAdvisoryDetails,
} from "@/components/update-news/details";

const EmptyUpdates = ({ text, icon, onclick }: EmptyUpdatesProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="absolute top-1/2 flex flex-col items-center gap-3">
        <div className="text-dark-blue text-5xl">{icon}</div>
        <p>No {text}</p>
        <button
          className="text-dark-blue cursor-pointer text-xs underline underline-offset-8 hover:opacity-70"
          onClick={onclick}
        >
          Add {text}
        </button>
      </div>
    </div>
  );
};

export default function SuperAdminUpdateNews() {
  const [isHide, setIsHide] = useState<boolean>(false);

  const [addUpdates, setAddUpdates] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<number>(0);

  const advisories = [
    { name: "Weather", icon: <FaCloud /> },
    { name: "Road", icon: <FaRoad /> },
    { name: "Disaster", icon: <PiWarningFill /> },
    { name: "Community Notice", icon: <FaUsers /> },
  ];

  const dropdownTitle = [
    "Weather Advisory",
    "Road Advisory",
    "Disaster Updates",
    "Community Notice",
  ];

  const [updatesWeather, setUpdatesWeather] = useState<GetWeatherProps[]>([]);
  const [updatesRoad, setUpdatesRoad] = useState<GetRoadProps[]>([]);
  const [updatesDisaster, setUpdatesDisaster] = useState<GetDisasterProps[]>(
    [],
  );
  const [updatesCommunity, setUpdatesCommunity] = useState<GetCommunityProps[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);

        const [weatherRes, roadRes, disasterRes, communityRes] =
          await Promise.all([
            axios.get(
              "http://localhost/Disaster-backend/public/getAdvisories.php?type=weather",
            ),
            axios.get(
              "http://localhost/Disaster-backend/public/getAdvisories.php?type=road",
            ),
            axios.get(
              "http://localhost/Disaster-backend/public/getAdvisories.php?type=disaster",
            ),
            axios.get(
              "http://localhost/Disaster-backend/public/getAdvisories.php?type=community",
            ),
          ]);

        setUpdatesWeather(weatherRes.data);
        setUpdatesRoad(roadRes.data);
        setUpdatesDisaster(disasterRes.data);
        setUpdatesCommunity(communityRes.data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [addUpdates]);

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const [detailWeatherPopUp, setDetailWeatherPopUp] = useState<boolean>(false);
  const [detailRoadPopUp, setDetailRoadPopUp] = useState<boolean>(false);

  const [detailId, setDetailId] = useState<string | undefined>("0");

  return (
    <>
      <div
        className={`relative h-screen w-full px-8 py-10 transition-all duration-300 ${
          addUpdates !== null ? "overflow-hidden" : "overflow-auto"
        }`}
      >
        <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>
        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <h1 className="text-dark-blue text-xl font-bold">Update & News</h1>
        </div>
        <div className="mt-10 flex items-center gap-6 border-b pb-8">
          <div className="flex items-center gap-2 pr-3">
            <CgMenuGridR className="text-dark-blue text-3xl" />
            <p>Active Updates</p>
          </div>

          <div className="flex items-center gap-2">
            {advisories.map((updates, i) => (
              <div
                key={i}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 ${isActive === i ? "bg-dark-blue text-puti" : ""}`}
                onClick={() => setIsActive(i)}
              >
                {updates.icon}
                <p className="text-sm">{updates.name}</p>
              </div>
            ))}
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setIsHide((prev) => !prev)}
              className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs"
            >
              Add Updates <MdOutlineAdd />
            </button>

            <div
              className={`dark:bg-light-black bg-dark-blue text-puti absolute top-full z-50 mt-2 flex ${isHide ? "h-[142px] border" : "h-0"} w-max flex-col gap-1 overflow-hidden rounded-md text-xs transition-all duration-500`}
            >
              {dropdownTitle.map((name, i) => (
                <p
                  key={i}
                  onClick={() => (setAddUpdates(i), setIsHide((prev) => !prev))}
                  className="dark:hover:bg-dark-blue hover:text-puti cursor-pointer px-4 py-2 transition-all duration-300 hover:bg-white/30"
                >
                  {name}
                </p>
              ))}
            </div>
          </div>
        </div>

        {isActive === 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 px-10">
            {updatesWeather.length === 0 && (
              <EmptyUpdates
                text="Weather Advisory"
                icon={<FaCloud />}
                onclick={() => setAddUpdates(0)}
              />
            )}

            {updatesWeather.map((data) => (
              <WeatherAdvisoryCard
                key={data.id}
                title={data.title}
                details={data.details}
                date_time={formatDateTime(data.date_time)}
                onclick={() => {
                  setDetailWeatherPopUp((prev) => !prev);
                  setDetailId(data.id);
                }}
              />
            ))}
          </div>
        )}

        {isActive === 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 px-10">
            {updatesRoad.length === 0 && (
              <EmptyUpdates
                text="Road Advisory"
                icon={<FaRoad />}
                onclick={() => setAddUpdates(1)}
              />
            )}

            {Array.isArray(updatesRoad) &&
              updatesRoad.map((data) => (
              <RoadAdvisoryCard
                key={data.id}
                title={data.title}
                details={data.details}
                date_time={formatDateTime(data.date_time)}
                status={data.status}
                onclick={() => {
                  setDetailRoadPopUp((prev) => !prev);
                  setDetailId(data.id);
                }}
              />
            ))}
          </div>
        )}

        {isActive === 2 && (
          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 px-10">
            {updatesDisaster.length === 0 && (
              <EmptyUpdates
                text="Disaster Updates"
                icon={<PiWarningFill />}
                onclick={() => setAddUpdates(2)}
              />
            )}
            {updatesDisaster.map((data) => (
              <DisasterUpdatesCard
                key={data.id}
                title={data.title}
                details={data.details}
                date_time={formatDateTime(data.date_time)}
                disaster_type={data.disaster_type}
              />
            ))}
          </div>
        )}
        {isActive === 3 && (
          <div className="mt-10 flex flex-wrap items-center justify-start gap-6 px-10">
            {updatesCommunity.length === 0 && (
              <EmptyUpdates
                text="Community Notice"
                icon={<FaUsers />}
                onclick={() => setAddUpdates(3)}
              />
            )}

            {updatesCommunity.map((data) => (
              <WeatherAdvisoryCard
                key={data.id}
                title={data.title}
                details={data.details}
                date_time={formatDateTime(data.date_time)}
                onclick={() => console.log("Hello World")}
              />
            ))}
          </div>
        )}
      </div>

      {addUpdates === 0 && (
        <WeatherAdvisoryForm onclick={() => setAddUpdates(null)} />
      )}

      {addUpdates === 1 && (
        <RoadAdvisoryForm onclick={() => setAddUpdates(null)} />
      )}

      {addUpdates === 2 && (
        <DisasterUpdatesForm onclick={() => setAddUpdates(null)} />
      )}

      {addUpdates === 3 && (
        <CommunityNoticeForm onclick={() => setAddUpdates(null)} />
      )}

      {detailWeatherPopUp && (
        <WeatherAdvisoryDetails
          id={detailId}
          onclick={() => setDetailWeatherPopUp((prev) => !prev)}
        />
      )}

      {detailRoadPopUp && (
        <RoadAdvisoryDetails
          id={detailId}
          onclick={() => setDetailRoadPopUp((prev) => !prev)}
        />
      )}
    </>
  );
}
