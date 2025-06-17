"use client";

import { FaCloud, FaRoad, FaHeading, FaImages } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { FaClock, FaEarthAmericas, FaUsers } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { MdOutlineNotes } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import { useState, useEffect } from "react";
import { CompleteFormAlert, SuccessPost } from "../pop-up";
import Loader from "../loading";
import { WeatherProps } from "../../../types";
import axios from "axios";
import gsap from "gsap";

// ------------ FORM NG WEATHER ADVISORY UPDATES -------------- //

export const WeatherAdvisoryForm = ({ onclick }: { onclick: () => void }) => {
  const [formData, setFormData] = useState<WeatherProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title && formData.details && formData.dateTime) {
      try {
        setisLoading(true);

        await axios.post(
          "http://localhost/disaster-backend/controllers/advisoryController.php?type=weather",
          formData,
        );

        setisPosted(true);

        setTimeout(() => {
          setisPosted(false);
          onclick();
        }, 1500);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }

      setTimeout(() => {
        onclick();
      }, 2000);
    } else {
      setisComplete(true);

      setTimeout(() => {
        setisComplete(false);
      }, 2500);
    }
  };

  // ------------- GSAP ANIMATION -------------- //

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isComplete, isPosted]);

  return (
    <div className="dark:bg-itim/70 absolute inset-0 z-50 flex items-center justify-center bg-white/30">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {isPosted && (
        <div className="popUp absolute top-8 z-50">
          <SuccessPost advisory="Weather Advisory" />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-5 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={() => onclick()}
        />
        <div className="mx-auto flex items-center gap-4">
          <FaCloud className="text-dark-blue text-xl" />
          <h2>Add Weather Advisory</h2>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <FaHeading className="text-dark-blue" />
            <p>Title</p>
          </div>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData?.title}
            className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Advisory Title"
          />
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <MdOutlineNotes className="text-dark-blue text-lg" />
            <p>Details</p>
          </div>
          <textarea
            name="details"
            value={formData?.details}
            onChange={handleChange}
            maxLength={1000}
            className="focus:border-dark-blue scrollBar border-dark-blue/50 h-[150px] w-full resize-none border px-4 py-3 text-xs outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Advisory Details... ( up to 1000 characters )"
          ></textarea>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <FaClock className="text-dark-blue" />
            <p>Date & Time</p>
          </div>
          <input
            type="datetime-local"
            name="dateTime"
            onChange={handleChange}
            value={formData?.dateTime}
            className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Posting...
            </span>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG ROAD ADVISORY UPDATES -------------- //

import { RoadProps } from "../../../types";

export const RoadAdvisoryForm = ({ onclick }: { onclick: () => void }) => {
  const [formData, setFormData] = useState<RoadProps>({
    title: "",
    details: "",
    dateTime: "",
    status: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.title &&
      formData.details &&
      formData.status &&
      formData.dateTime
    ) {
      try {
        setisLoading(true);

        await axios.post(
          "http://localhost/disaster-backend/controllers/advisoryController.php?type=road",
          formData,
        );

        setisPosted(true);

        setTimeout(() => {
          setisPosted(false);
          onclick();
        }, 1500);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }

      setTimeout(() => {
        onclick();
      }, 2000);
    } else {
      setisComplete(true);

      setTimeout(() => {
        setisComplete(false);
      }, 2500);
    }
  };

  // ------------- GSAP ANIMATION -------------- //

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isComplete, isPosted]);

  return (
    <div className="dark:bg-itim/70 absolute inset-0 flex items-center justify-center bg-white/20 shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}

      {isPosted && (
        <div className="popUp absolute top-8 z-50">
          <SuccessPost advisory="Road Advisory" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-5 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={() => onclick()}
        />
        <div className="mx-auto flex items-center gap-4">
          <FaRoad className="text-dark-blue text-xl" />
          <h2>Add Road Advisory</h2>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <FaHeading className="text-dark-blue" />
            <p>Title</p>
          </div>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData?.title}
            className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Advisory Title"
          />
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <MdOutlineNotes className="text-dark-blue text-lg" />
            <p>Details</p>
          </div>
          <textarea
            name="details"
            value={formData?.details}
            onChange={handleChange}
            maxLength={1000}
            className="focus:border-dark-blue scrollBar border-dark-blue/50 h-[150px] w-full resize-none border px-4 py-3 text-xs outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Advisory Details... ( up to 1000 characters )"
          ></textarea>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <FaClock className="text-dark-blue" />
              <p>Date & Time</p>
            </div>
            <input
              type="datetime-local"
              name="dateTime"
              onChange={handleChange}
              value={formData?.dateTime}
              className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
            />
          </div>

          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <ImSpinner6 className="text-dark-blue" />
              <p>Status</p>
            </div>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="focus:border-dark-blue border-dark-blue/50 dark:bg-light-black w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Open">Open</option>
              <option value="Partially Open">Partially Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Posting...
            </span>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG DISASTER UPDATES -------------- //

import { DisasterProps } from "../../../types";

export const DisasterUpdatesForm = ({ onclick }: { onclick: () => void }) => {
  const [formData, setFormData] = useState<DisasterProps>({
    disasterType: "",
    title: "",
    details: "",
    dateTime: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    formData.title &&
    formData.details &&
    formData.dateTime &&
    formData.disasterType &&
    formData.image
  ) {
    try {
      setisLoading(true);

      // Create a FormData object for multipart/form-data
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("details", formData.details);
      formPayload.append("dateTime", formData.dateTime);
      formPayload.append("disasterType", formData.disasterType);
      formPayload.append("image", formData.image);

      await axios.post(
        "http://localhost/disaster-backend/controllers/advisoryController.php?type=disaster",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setisPosted(true);

      setTimeout(() => {
        setisPosted(false);
        onclick();
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setisLoading(false);
    }
  } else {
    setisComplete(true);

    setTimeout(() => {
      setisComplete(false);
    }, 2500);
  }
};

  // ------------- GSAP ANIMATION -------------- //

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isComplete, isPosted]);

  return (
    <div className="dark:bg-itim/70 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-white/20 shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}

      {isPosted && (
        <div className="popUp absolute top-8 z-50">
          <SuccessPost advisory="Disaster updates" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-5 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={() => onclick()}
        />
        <div className="mx-auto mb-3 flex items-center gap-4">
          <PiWarningFill className="text-dark-blue text-xl" />
          <h2>Add Disaster Updates </h2>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <FaImages className="text-dark-blue" />
              <p>Image</p>
            </div>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border-dark-blue/50 file:bg-dark-blue/10 w-full border px-4 py-3 text-sm outline-none file:rounded-xs file:p-1 file:px-2 file:text-xs dark:border-gray-500/30 dark:file:bg-gray-800"
            />
          </div>

          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <FaHeading className="text-dark-blue" />
              <p>Title</p>
            </div>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              value={formData?.title}
              className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-xs dark:border-gray-500/30"
              placeholder="Enter Disaster Updates Title"
            />
          </div>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <MdOutlineNotes className="text-dark-blue text-lg" />
            <p>Details</p>
          </div>
          <textarea
            name="details"
            value={formData?.details}
            onChange={handleChange}
            maxLength={1000}
            className="focus:border-dark-blue scrollBar border-dark-blue/50 h-[150px] w-full resize-none border px-4 py-3 text-xs outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Details... ( up to 1000 characters )"
          ></textarea>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <FaClock className="text-dark-blue" />
              <p>Date & Time</p>
            </div>
            <input
              type="datetime-local"
              name="dateTime"
              onChange={handleChange}
              value={formData?.dateTime}
              className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
            />
          </div>

          <div className="w-1/2">
            <div className="mb-3 flex items-center gap-3 text-sm">
              <FaEarthAmericas className="text-dark-blue" />
              <p>Disaster Type</p>
            </div>
            <select
              name="disasterType"
              value={formData.disasterType}
              onChange={handleChange}
              className="focus:border-dark-blue border-dark-blue/50 dark:bg-light-black w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
            >
              <option value="" disabled>
                Select Disaster Type
              </option>
              <option value="Flood">Flood</option>
              <option value="Typhoon">Typhoon</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Landslide">Landslide</option>
              <option value="Volcanic Eruption">Volcanic Eruption</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Posting...
            </span>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG COMMUNITY NOTICE UPDATES -------------- //

import { CommunityNoticeProps } from "../../../types";

export const CommunityNoticeForm = ({ onclick }: { onclick: () => void }) => {
  const [formData, setFormData] = useState<CommunityNoticeProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title && formData.details && formData.dateTime) {
      try {
        setisLoading(true);

        await axios.post(
          "http://localhost/disaster-backend/controllers/advisoryController.php?type=community",
          formData,
        );

        setisPosted(true);

        setTimeout(() => {
          setisPosted(false);
          onclick();
        }, 1500);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }

      setTimeout(() => {
        onclick();
      }, 2000);
    } else {
      setisComplete(true);

      setTimeout(() => {
        setisComplete(false);
      }, 2500);
    }
  };

  // ------------- GSAP ANIMATION -------------- //

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isComplete, isPosted]);

  return (
    <div className="dark:bg-itim/70 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-white/20 shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}

      {isPosted && (
        <div className="popUp absolute top-8 z-50">
          <SuccessPost advisory="Community Notice" />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-5 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={() => onclick()}
        />
        <div className="mx-auto flex items-center gap-4">
          <FaUsers className="text-dark-blue text-xl" />
          <h2>Add Community Notice</h2>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <FaHeading className="text-dark-blue" />
            <p>Title</p>
          </div>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData?.title}
            className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Community Notice Title"
          />
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <MdOutlineNotes className="text-dark-blue text-lg" />
            <p>Details</p>
          </div>
          <textarea
            name="details"
            value={formData?.details}
            onChange={handleChange}
            maxLength={1000}
            className="focus:border-dark-blue scrollBar border-dark-blue/50 h-[150px] w-full resize-none border px-4 py-3 text-xs outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Details... ( up to 1000 characters )"
          ></textarea>
        </div>

        <div className="">
          <div className="mb-3 flex items-center gap-3 text-sm">
            <FaClock className="text-dark-blue" />
            <p>Date & Time</p>
          </div>
          <input
            type="datetime-local"
            name="dateTime"
            onChange={handleChange}
            value={formData?.dateTime}
            className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-xs outline-none dark:border-gray-500/30"
          />
        </div>

        <input
          type="submit"
          value="Post"
          className="bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 hover:opacity-90"
        />
      </form>
    </div>
  );
};
