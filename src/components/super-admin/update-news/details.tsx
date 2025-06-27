"use client";

import { HiOutlineX } from "react-icons/hi";
import { FaImage, FaUsers } from "react-icons/fa6";
import { AiFillDelete } from "react-icons/ai";
import { LiaEditSolid } from "react-icons/lia";
import { PiWarningFill } from "react-icons/pi";
import { FaCloud, FaRoad } from "react-icons/fa";
import Image from "next/image";

import {
  GetAdvisoryDetails,
  GetDisasterProps,
  GetWeatherProps,
  GetRoadProps,
  GetCommunityProps,
} from "../../../../types";

import { DeleteSuccessfully } from "../../pop-up";
import { formatDateTime } from "../../../../reusable-function";

import { useState, useEffect } from "react";
import Loader from "../../loading";
import axios from "axios";
import gsap from "gsap";

// --------------- DELETE POP UP COMPONENT ------------- //

const DeletePopUp = ({
  advisory,
  ondelete,
  oncancel,
}: {
  advisory: string;
  ondelete: () => void;
  oncancel: () => void;
}) => {
  return (
    <div className="dark:bg-light-black/90 bg-dark-blue flex flex-col items-center justify-center gap-5 rounded-md border p-10 backdrop-blur-sm">
      <p className="text-puti text-center text-sm leading-7 text-nowrap">
        This action cannot be undone. <br /> Are you sure you want to delete
        this {advisory}?
      </p>
      <div className="text-puti flex gap-3 text-sm">
        <button
          className="dark:bg-dark-blue bg-light-blue text-itim dark:text-puti cursor-pointer rounded-sm px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={ondelete}
        >
          Yes
        </button>
        <button
          className="cursor-pointer rounded-sm bg-red-500 px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={oncancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

// ----------- WEATHER DETAILS ---------------- //

export const WeatherAdvisoryDetails = ({
  onclick,
  id,
  triggerRefresh,
  onEdit,
}: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetWeatherProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetWeatherProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=weather&id=${id}`,
        );

        setFetchAdvisory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  const handleDelete = (id?: string) => {
    if (!id) {
      return;
    }

    const formData = new FormData();
    formData.append("_method", "DELETE");

    axios
      .post(
        `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=weather&id=${id}`,
        formData,
      )
      .then(() => {
        triggerRefresh();

        setTimeout(() => {
          onclick();
        }, 1800);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("Failed to delete (Network Error or Backend Error)");
      });
  };

  // ---------- GSAP ANIMATION ------------ //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        scale: 0,
        duration: 300,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.inOut",
      },
    );
  }, [isDeleted]);

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black relative flex max-h-[80vh] max-w-[800px] flex-col gap-7 rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className={`absolute ${isDeleted ? "pointer-events-none opacity-80" : "hover:text-red-500"} top-6 right-6 text-xl transition-colors duration-300`}
          onClick={onclick}
        />

        {isDeleted && (
          <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
            <DeletePopUp
              advisory="Weather Advisory"
              ondelete={() => {
                setIsDeleted(false);
                setIsSuccessDelete(true);
                handleDelete(fetchAdvisory?.id);
              }}
              oncancel={() => setIsDeleted(false)}
            />
          </div>
        )}

        {isSuccessDelete && (
          <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
            <DeleteSuccessfully />
          </div>
        )}

        <h1 className="text-dark-blue border-dark-blue/50 flex items-center justify-center gap-4 border-b pb-5 text-lg font-semibold dark:border-gray-500/30">
          <FaCloud className="text-2xl" /> Weather Advisory Details
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 flex-col items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold">{fetchAdvisory?.title}</p>
            <div className="scrollBar border-dark-blue/50 max-h-[300px] overflow-auto border-b pr-3 pb-7 dark:border-gray-500/30">
              <p className="text-sm">{fetchAdvisory?.details}</p>
            </div>
            <div className="flex items-center justify-between gap-36 text-xs">
              <p>{formatDateTime(fetchAdvisory?.date_time ?? "")}</p>

              <div className="flex items-center gap-3">
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`bg-dark-blue flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} text-puti rounded-sm px-6 py-2 text-xs transition-all duration-300`}
                  onClick={onEdit}
                >
                  <LiaEditSolid className="text-sm" />
                  Edit
                </button>
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`text-puti flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300`}
                  onClick={() => setIsDeleted((prev) => !prev)}
                >
                  <AiFillDelete className="text-sm" />
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

// ----------- ROAD DETAILS ---------------- //

export const RoadAdvisoryDetails = ({
  onclick,
  id,
  triggerRefresh,
  onEdit,
}: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetRoadProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetRoadProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=road&id=${id}`,
        );

        setFetchAdvisory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  const handleDelete = (id?: string) => {
    if (!id) {
      return;
    }

    const formData = new FormData();
    formData.append("_method", "DELETE");

    axios
      .post(
        `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=road&id=${id}`,
        formData,
      )
      .then(() => {
        triggerRefresh();

        setTimeout(() => {
          onclick();
        }, 1800);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("Failed to delete (Network Error or Backend Error)");
      });
  };

  // ---------- GSAP ANIMATION ------------ //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        scale: 0,
        duration: 300,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.inOut",
      },
    );
  }, [isDeleted]);

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] max-w-[600px] flex-col gap-7 rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className={`absolute ${isDeleted ? "pointer-events-none opacity-80" : "hover:text-red-500"} top-6 right-6 text-xl transition-colors duration-300`}
          onClick={onclick}
        />

        {isDeleted && (
          <div className="popUp absolute top-1/2 left-1/2 -translate-1/2">
            <DeletePopUp
              advisory="Road Advisory"
              ondelete={() => {
                setIsDeleted(false);
                setIsSuccessDelete(true);
                handleDelete(fetchAdvisory?.id);
              }}
              oncancel={() => setIsDeleted(false)}
            />
          </div>
        )}

        {isSuccessDelete && (
          <div className="popUp absolute top-1/2 left-1/2 -translate-1/2">
            <DeleteSuccessfully />
          </div>
        )}

        <h1 className="text-dark-blue border-dark-blue/50 flex items-center justify-center gap-4 border-b pb-5 text-lg font-semibold dark:border-gray-500/30">
          <FaRoad className="text-2xl" /> Road Advisory Details
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 flex-col items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold">{fetchAdvisory?.title}</p>
            <div className="scrollBar border-dark-blue/50 max-h-[300px] overflow-auto border-b pr-3 pb-7 text-sm dark:border-gray-500/30">
              <p>{fetchAdvisory?.details}</p>
            </div>
            <div className="flex items-center justify-between gap-36">
              <div>
                <p className="mb-3 font-bold">{fetchAdvisory?.status}</p>
                <p className="text-xs">
                  {formatDateTime(fetchAdvisory?.date_time ?? "")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`bg-dark-blue flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} text-puti rounded-sm px-6 py-2 text-xs transition-all duration-300`}
                  onClick={onEdit}
                >
                  <LiaEditSolid className="text-sm" />
                  Edit
                </button>
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`text-puti flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300`}
                  onClick={() => setIsDeleted((prev) => !prev)}
                >
                  <AiFillDelete className="text-sm" />
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

// ----------- COMMUNITY DETAILS ---------------- //

export const CommunityNoticeDetails = ({
  onclick,
  id,
  triggerRefresh,
  onEdit,
}: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetCommunityProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetCommunityProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=community&id=${id}`,
        );

        setFetchAdvisory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  const handleDelete = (id?: string) => {
    if (!id) {
      return;
    }

    const formData = new FormData();
    formData.append("_method", "DELETE");

    axios
      .post(
        `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=community&id=${id}`,
        formData,
      )
      .then(() => {
        triggerRefresh();

        setTimeout(() => {
          onclick();
        }, 1800);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("Failed to delete (Network Error or Backend Error)");
      });
  };

  // ---------- GSAP ANIMATION ------------ //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        scale: 0,
        duration: 300,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.inOut",
      },
    );
  }, [isDeleted]);
  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] max-w-[600px] flex-col gap-7 rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className={`absolute ${isDeleted ? "pointer-events-none opacity-80" : "hover:text-red-500"} top-6 right-6 text-xl transition-colors duration-300`}
          onClick={onclick}
        />

        {isDeleted && (
          <div className="popUp absolute top-1/2 left-1/2 -translate-1/2">
            <DeletePopUp
              advisory="Community Notice"
              ondelete={() => {
                setIsDeleted(false);
                setIsSuccessDelete(true);
                handleDelete(fetchAdvisory?.id);
              }}
              oncancel={() => setIsDeleted(false)}
            />
          </div>
        )}

        {isSuccessDelete && (
          <div className="popUp absolute top-1/2 left-1/2 -translate-1/2">
            <DeleteSuccessfully />
          </div>
        )}

        <h1 className="text-dark-blue border-dark-blue/50 flex items-center justify-center gap-4 border-b pb-5 text-lg font-semibold dark:border-gray-500/30">
          <FaUsers className="text-2xl" /> Community Notice
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 flex-col items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            <p className="text-xl font-bold">{fetchAdvisory?.title}</p>
            <div className="scrollBar border-dark-blue/50 max-h-[300px] overflow-auto border-b pr-3 pb-7 text-sm dark:border-gray-500/30">
              <p>{fetchAdvisory?.details}</p>
            </div>
            <div className="flex items-center justify-between gap-36 text-xs">
              <p>{formatDateTime(fetchAdvisory?.date_time ?? "")}</p>

              <div className="flex items-center gap-3">
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`bg-dark-blue flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} text-puti rounded-sm px-6 py-2 text-xs transition-all duration-300`}
                  onClick={onEdit}
                >
                  <LiaEditSolid className="text-sm" />
                  Edit
                </button>
                <button
                  disabled={isDeleted || isSuccessDelete}
                  className={`text-puti flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300`}
                  onClick={() => setIsDeleted((prev) => !prev)}
                >
                  <AiFillDelete className="text-sm" />
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

// ----------- DISASTER DETAILS ---------------- //

export const DisasterUpdatesDetails = ({
  onclick,
  id,
  triggerRefresh,
  onEdit,
}: GetAdvisoryDetails) => {
  const [fetchAdvisory, setFetchAdvisory] = useState<GetDisasterProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await axios.get<GetDisasterProps>(
          `http://localhost/disaster-backend/public/getAdvisories.php?type=disaster&id=${id}`,
        );

        setFetchAdvisory(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

  const handleDelete = (id?: string) => {
    if (!id) {
      return;
    }

    const formData = new FormData();
    formData.append("_method", "DELETE");

    axios
      .post(
        `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=disaster&id=${id}`,
        formData,
      )
      .then(() => {
        triggerRefresh();

        setTimeout(() => {
          onclick();
        }, 1800);
      })
      .catch((err) => {
        console.error("Axios Error:", err);
        alert("Failed to delete (Network Error or Backend Error)");
      });
  };

  // ---------- GSAP ANIMATION ------------ //

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        scale: 0,
        duration: 300,
      },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.inOut",
      },
    );
  }, [isDeleted]);

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex max-h-[80vh] max-w-[800px] flex-col gap-7 rounded-xl border px-10 py-8 backdrop-blur-sm">
        <HiOutlineX
          className={`absolute ${isDeleted ? "pointer-events-none opacity-80" : "hover:text-red-500"} top-6 right-6 text-xl transition-colors duration-300`}
          onClick={onclick}
        />

        {isDeleted && (
          <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
            <DeletePopUp
              advisory="Disaster Updates"
              ondelete={() => {
                setIsDeleted(false);
                setIsSuccessDelete(true);
                handleDelete(fetchAdvisory?.id);
              }}
              oncancel={() => setIsDeleted(false)}
            />
          </div>
        )}

        {isSuccessDelete && (
          <div className="popUp absolute top-1/2 left-1/2 z-50 -translate-1/2">
            <DeleteSuccessfully />
          </div>
        )}

        <h1 className="text-dark-blue border-dark-blue/50 flex items-center justify-center gap-4 border-b pb-5 text-lg font-semibold dark:border-gray-500/30">
          <PiWarningFill className="text-2xl" /> Disaster Updates Details
        </h1>

        {loading ? (
          <div className="flex h-52 w-96 items-center justify-center gap-5">
            <Loader />
            <p> Loading ...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-10">
              {fetchAdvisory?.img_path ? (
                <div
                  className="relative h-[300px] w-[300px] min-w-[300px] overflow-hidden rounded-md transition-all duration-300 hover:opacity-70"
                  onClick={() => setIsImageOpen(true)}
                >
                  <Image
                    src={fetchAdvisory.image_url ?? ""}
                    alt=""
                    fill
                    className="object-cover object-center"
                  />
                </div>
              ) : (
                <div className="flex h-[300px] w-[300px] min-w-[300px] flex-col items-center justify-center gap-5 rounded-sm bg-gray-800/10 dark:bg-white/10">
                  <FaImage className="text-4xl" />
                  <p className="text-sm">No image</p>
                </div>
              )}

              <div className="flex flex-col justify-between self-stretch">
                <div>
                  <p className="pb-3 text-lg font-bold">
                    {fetchAdvisory?.title}
                  </p>
                  <div className="mb-5 flex items-center justify-between gap-30">
                    <p className="text-dark-blue text-sm font-semibold text-nowrap">
                      {fetchAdvisory?.disaster_type}
                    </p>
                    <p className="text-xs text-nowrap">
                      {formatDateTime(fetchAdvisory?.date_time ?? "")}
                    </p>
                  </div>
                  <div className="scrollBar mb-8 max-h-[250px] max-w-[400px] overflow-auto pr-3 text-sm">
                    {fetchAdvisory?.details}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={isDeleted || isSuccessDelete}
                    className={`bg-dark-blue flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} text-puti rounded-sm px-6 py-2 text-xs transition-all duration-300`}
                    onClick={onEdit}
                  >
                    <LiaEditSolid className="text-sm" />
                    Edit
                  </button>
                  <button
                    disabled={isDeleted || isSuccessDelete}
                    className={`text-puti flex items-center gap-1 ${isDeleted ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:opacity-80"} rounded-sm bg-red-500 px-6 py-2 text-xs transition-all duration-300`}
                    onClick={() => setIsDeleted((prev) => !prev)}
                  >
                    <AiFillDelete className="text-sm" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isImageOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className="absolute top-5 right-5 cursor-pointer text-3xl text-white"
            onClick={() => setIsImageOpen(false)}
          >
            <HiOutlineX />
          </div>
          <div className="relative max-h-[75vh] w-[80vw] max-w-[800px]">
            <Image
              src={fetchAdvisory?.image_url ?? ""}
              alt="Enlarged Image"
              width={800}
              height={600}
              className="h-auto max-h-[75vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
