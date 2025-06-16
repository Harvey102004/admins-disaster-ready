"use client";

import { HiOutlineX } from "react-icons/hi";
import {
  GetAdvisoryDetails,
  GetWeatherProps,
  GetRoadProps,
} from "../../../types";
import { useState, useEffect } from "react";
import Loader from "../loading";
import axios from "axios";

export const WeatherAdvisoryDetails = ({ onclick, id }: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetWeatherProps>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetWeatherProps[]>(
          "http://localhost/Disaster-backend/public/getAdvisories.php?type=weather",
        );

        const advisoryDetail = response.data.find((data) => data.id === id);

        setFetchAdvisory(advisoryDetail);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

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

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-white/30">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] max-w-[600px] flex-col gap-7 overflow-hidden rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className="absolute top-6 right-6 text-xl transition-colors duration-300 hover:text-red-500"
          onClick={onclick}
        />

        <h1 className="text-dark-blue border-dark-blue/50 border-b pb-5 text-center text-lg font-semibold dark:border-gray-500/30">
          Weather Advisory Details
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 flex-col items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            {" "}
            <p className="border-dark-blue/50 border-b pb-7 text-center text-xl font-bold dark:border-gray-500/30">
              {fetchAdvisory?.title}
            </p>
            <div className="scrollBar border-dark-blue/50 max-h-[300px] overflow-auto border-b pr-3 pb-7 dark:border-gray-500/30">
              <p>{fetchAdvisory?.details}</p>
            </div>
            <div className="flex items-center justify-between gap-36">
              <p>{formatDateTime(fetchAdvisory?.date_time ?? "")}</p>

              <div className="flex items-center gap-3">
                <button className="bg-dark-blue text-puti cursor-pointer rounded-sm px-6 py-2 text-xs transition-all duration-300 hover:opacity-80">
                  Edit
                </button>
                <button className="text-puti cursor-pointer rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300 hover:opacity-80">
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const RoadAdvisoryDetails = ({ onclick, id }: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetRoadProps>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetRoadProps[]>(
          "http://localhost/Disaster-backend/public/getAdvisories.php?type=road",
        );

        const advisoryDetail = response.data.find((data) => data.id === id);

        setFetchAdvisory(advisoryDetail);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

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

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-white/30">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] max-w-[600px] flex-col gap-7 overflow-hidden rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className="absolute top-6 right-6 text-xl transition-colors duration-300 hover:text-red-500"
          onClick={onclick}
        />

        <h1 className="text-dark-blue border-dark-blue/50 border-b pb-5 text-center text-lg font-semibold dark:border-gray-500/30">
          Road Advisory Details
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 flex-col items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            <p className="border-dark-blue/50 border-b pb-7 text-center text-xl font-bold dark:border-gray-500/30">
              {fetchAdvisory?.title}
            </p>
            <div className="scrollBar border-dark-blue/50 max-h-[300px] overflow-auto border-b pr-3 pb-7 dark:border-gray-500/30">
              <p>{fetchAdvisory?.details}</p>
            </div>
            <div className="flex items-center justify-between gap-36">
              <div>
                <p className="mb-3 font-bold">{fetchAdvisory?.status}</p>
                <p className="text-sm">
                  {formatDateTime(fetchAdvisory?.date_time ?? "")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-dark-blue text-puti cursor-pointer rounded-sm px-6 py-2 text-xs transition-all duration-300 hover:opacity-80">
                  Edit
                </button>
                <button className="text-puti cursor-pointer rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300 hover:opacity-80">
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
