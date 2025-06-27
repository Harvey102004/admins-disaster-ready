"use client";

import { CgMenuGridR } from "react-icons/cg";
import { FaCloud, FaRoad } from "react-icons/fa";
import { PiWarningFill } from "react-icons/pi";
import { MdOutlineAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../../reusable-function";
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
} from "@/components/super-admin/update-news/updates-forms";
import { FaUsers } from "react-icons/fa6";
import {
  RoadAdvisoryCard,
  WeatherAdvisoryCard,
  DisasterUpdatesCard,
  CommunityNoticeCard,
} from "@/components/super-admin/update-news/update-card";

import {
  RoadAdvisoryDetails,
  WeatherAdvisoryDetails,
  DisasterUpdatesDetails,
  CommunityNoticeDetails,
} from "@/components/super-admin/update-news/details";

import {
  WeatherAdvisoryEdit,
  RoadAdvisoryEdit,
  CommunityNoticeEdit,
  DisasterUpdatesEdit,
} from "@/components/super-admin/update-news/updates-edit";

// ---------- EMPTY UPDATES COMPONENT ---------- //

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
  // ------ TOGGLE SA BUTTON NG ADD UPDATES -------- //

  const [isHide, setIsHide] = useState<boolean>(false);

  // ------ PANGSHOW NG FORM ------- //

  const [addUpdates, setAddUpdates] = useState<number | null>(null);

  // -----  PANG SHOW NG EDIT FORM ------- //

  const [isEdit, setIsEdit] = useState<number | null>(null);

  // ----- TOGGLE PARA MASHOW YUNG ADVISORY ------ //

  const [isActive, setIsActive] = useState<number>(0);

  // ----- LAGAYAN TO NG MGA DATA NG ADVISORY ------ //

  const [updatesWeather, setUpdatesWeather] = useState<GetWeatherProps[]>([]);
  const [updatesRoad, setUpdatesRoad] = useState<GetRoadProps[]>([]);
  const [updatesDisaster, setUpdatesDisaster] = useState<GetDisasterProps[]>(
    [],
  );
  const [updatesCommunity, setUpdatesCommunity] = useState<GetCommunityProps[]>(
    [],
  );

  // ----- STATE PARA SA POPUP NG DETAILS CONTAINER --------- //

  const [detailWeatherPopUp, setDetailWeatherPopUp] = useState<boolean>(false);
  const [detailRoadPopUp, setDetailRoadPopUp] = useState<boolean>(false);
  const [detailCommunityPopUp, setDetailCommunityPopUp] =
    useState<boolean>(false);
  const [detailDisasterPopUp, setDetailDisasterPopUp] =
    useState<boolean>(false);

  // ----- STATE PARA SA DETAIL ID PANG FETCH NG SPECIFIC NA DATA ------- //

  const [detailId, setDetailId] = useState<string | undefined>("0");

  // ----- LOADING TOGGLE ------- //

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ----- REFRESH STATE PARA MAG RELOAD -------- //

  const [refreshKey, setRefreshKey] = useState(0);

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

  // ----------- FETCHING NG MGA ADVISORY ------------ //

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
  }, [addUpdates, refreshKey]);

  return (
    <>
      <div
        className={`relative h-screen w-full px-8 pt-10 transition-all duration-300 ${
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
              className="bg-dark-blue text-puti flex cursor-pointer items-center gap-2 rounded-full px-4 py-3 pl-6 text-xs transition-all duration-300 hover:opacity-75"
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

        {/* ------------ WEATHER ADVISORY PAGE --------------- */}

        {isActive === 0 && (
          <div className="scrollBar flex h-[65vh] flex-wrap justify-start gap-5 overflow-auto px-6 pt-5">
            {(!updatesWeather ||
              !Array.isArray(updatesWeather) ||
              updatesWeather.length < 1) && (
              <EmptyUpdates
                text="Weather Advisory"
                icon={<FaCloud />}
                onclick={() => setAddUpdates(0)}
              />
            )}

            {Array.isArray(updatesWeather) &&
              updatesWeather.map((data) => (
                <WeatherAdvisoryCard
                  key={data.id}
                  id={data.id}
                  title={data.title}
                  details={data.details}
                  date_time={formatDateTime(data.date_time)}
                  onclick={() => {
                    setDetailWeatherPopUp((prev) => !prev);
                    setDetailId(data.id);
                  }}
                  onedit={() => {
                    setIsEdit(1);
                    setDetailId(data.id);
                  }}
                />
              ))}
          </div>
        )}

        {/* ------------ ROAD ADVISORY PAGE --------------- */}

        {isActive === 1 && (
          <div className="scrollBar flex h-[65vh] flex-wrap justify-start gap-5 overflow-auto px-6 pt-5">
            {(!updatesRoad ||
              !Array.isArray(updatesRoad) ||
              updatesRoad.length < 1) && (
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
                  onedit={() => {
                    setIsEdit(2);
                    setDetailId(data.id);
                  }}
                />
              ))}
          </div>
        )}

        {/* ------------ DISASTER UPDATES PAGE --------------- */}

        {isActive === 2 && (
          <div className="scrollBar flex h-[65vh] flex-wrap justify-start gap-5 overflow-auto px-6 pt-5">
            {(!updatesDisaster ||
              !Array.isArray(updatesDisaster) ||
              updatesDisaster.length < 1) && (
              <EmptyUpdates
                text="Disaster Updates"
                icon={<PiWarningFill />}
                onclick={() => setAddUpdates(2)}
              />
            )}
            {Array.isArray(updatesDisaster) &&
              updatesDisaster.map((data) => (
                <DisasterUpdatesCard
                  key={data.id}
                  title={data.title}
                  details={data.details}
                  date_time={formatDateTime(data.date_time)}
                  disaster_type={data.disaster_type}
                  onclick={() => {
                    setDetailDisasterPopUp((prev) => !prev);
                    setDetailId(data.id);
                  }}
                  onedit={() => {
                    setIsEdit(3);
                    setDetailId(data.id);
                  }}
                />
              ))}
          </div>
        )}

        {/* ------------ COMMUNITY NOTICE PAGE --------------- */}

        {isActive === 3 && (
          <div className="scrollBar flex h-[65vh] flex-wrap justify-start gap-5 overflow-auto px-6 pt-5">
            {(!updatesCommunity ||
              !Array.isArray(updatesCommunity) ||
              updatesCommunity.length < 1) && (
              <EmptyUpdates
                text="Community Notice"
                icon={<FaUsers />}
                onclick={() => setAddUpdates(3)}
              />
            )}

            {Array.isArray(updatesCommunity) &&
              updatesCommunity.map((data) => (
                <CommunityNoticeCard
                  key={data.id}
                  title={data.title}
                  details={data.details}
                  date_time={formatDateTime(data.date_time)}
                  onclick={() => {
                    setDetailCommunityPopUp((prev) => !prev);
                    setDetailId(data.id);
                  }}
                  onedit={() => {
                    setIsEdit(4);
                    setDetailId(data.id);
                  }}
                />
              ))}
          </div>
        )}
      </div>

      {/* ------------ WEATHER ADVISORY FORM --------------- */}

      {addUpdates === 0 && (
        <WeatherAdvisoryForm onclick={() => setAddUpdates(null)} />
      )}

      {/* ------------ ROAD ADVISORY FORM --------------- */}

      {addUpdates === 1 && (
        <RoadAdvisoryForm onclick={() => setAddUpdates(null)} />
      )}

      {/* ------------ DISASTER UPDATES FORM --------------- */}

      {addUpdates === 2 && (
        <DisasterUpdatesForm onclick={() => setAddUpdates(null)} />
      )}

      {/* ------------ COMMUNITY NOTICE FORM --------------- */}

      {addUpdates === 3 && (
        <CommunityNoticeForm onclick={() => setAddUpdates(null)} />
      )}

      {/* ------------ WEATHER ADVISORY DETAILS --------------- */}

      {detailWeatherPopUp && (
        <WeatherAdvisoryDetails
          id={detailId}
          onclick={() => setDetailWeatherPopUp((prev) => !prev)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
          onEdit={() => {
            setIsEdit(1);
            setDetailWeatherPopUp(false);
          }}
        />
      )}

      {/* ------------ ROAD ADVISORY DETAILS --------------- */}

      {detailRoadPopUp && (
        <RoadAdvisoryDetails
          id={detailId}
          onclick={() => setDetailRoadPopUp((prev) => !prev)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
          onEdit={() => {
            setIsEdit(2);
            setDetailRoadPopUp(false);
          }}
        />
      )}

      {/* ------------ COMMUNITY NOTICE DETAILS --------------- */}

      {detailCommunityPopUp && (
        <CommunityNoticeDetails
          id={detailId}
          onclick={() => setDetailCommunityPopUp((prev) => !prev)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
          onEdit={() => {
            setIsEdit(4);
            setDetailCommunityPopUp(false);
          }}
        />
      )}

      {/* ------------ DISASTER UPDATES DETAILS --------------- */}

      {detailDisasterPopUp && (
        <DisasterUpdatesDetails
          id={detailId}
          onclick={() => setDetailDisasterPopUp((prev) => !prev)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
          onEdit={() => {
            setIsEdit(3);
            setDetailDisasterPopUp(false);
          }}
        />
      )}

      {/* ------------ WEATHER ADVISORY EDIT FORM --------------- */}

      {isEdit === 1 && detailId && (
        <WeatherAdvisoryEdit
          id={detailId}
          onclick={() => setIsEdit(null)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* ------------ ROAD ADVISORY EDIT FORM --------------- */}

      {isEdit === 2 && detailId && (
        <RoadAdvisoryEdit
          id={detailId}
          onclick={() => setIsEdit(null)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* ------------ DISASTER UPDATES EDIT FORM --------------- */}

      {isEdit === 3 && detailId && (
        <DisasterUpdatesEdit
          id={detailId}
          onclick={() => setIsEdit(null)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* ------------ COMMUNITY NOTICE EDIT FORM --------------- */}

      {isEdit === 4 && detailId && (
        <CommunityNoticeEdit
          id={detailId}
          onclick={() => setIsEdit(null)}
          triggerRefresh={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </>
  );
}
