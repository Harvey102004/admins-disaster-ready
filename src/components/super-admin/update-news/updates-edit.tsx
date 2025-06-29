"use client";

import { FaCloud, FaRoad, FaHeading, FaImages } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { FaClock, FaEarthAmericas, FaUsers } from "react-icons/fa6";
import { PiWarningFill } from "react-icons/pi";
import { MdOutlineNotes } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import { useState, useEffect } from "react";
import { CompleteFormAlert, SuccessEdit, EditNotChange } from "../../pop-up";
import Loader from "../../loading";
import {
  WeatherProps,
  AdvisoryEditProps,
  GetWeatherProps,
  RoadProps,
  GetRoadProps,
  CommunityNoticeProps,
  DisasterProps,
  GetDisasterProps,
} from "../../../../types";
import axios from "axios";
import gsap from "gsap";

// ------------- CONFIRMATION EDIT COMPONENT ------------ //

const ConfirmationEdit = ({
  advisory,
  onUpdate,
  oncancel,
}: {
  advisory: string;
  onUpdate: (e: React.FormEvent) => Promise<void>;
  oncancel: () => void;
}) => {
  return (
    <div className="dark:bg-light-black/90 bg-dark-blue flex flex-col items-center justify-center gap-5 rounded-md border p-10 backdrop-blur-sm">
      <p className="text-puti text-center text-sm leading-7 text-nowrap">
        Are you sure you want to Update this {advisory}?
      </p>
      <div className="text-puti flex gap-3 text-sm">
        <button
          type="submit"
          className="dark:bg-dark-blue bg-light-blue text-itim dark:text-puti cursor-pointer rounded-sm px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={onUpdate}
        >
          Yes
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-sm bg-red-500 px-6 py-2 transition-all duration-300 hover:opacity-80"
          onClick={oncancel}
        >
          No
        </button>
      </div>
    </div>
  );
};

// ------------ FORM NG WEATHER ADVISORY UPDATES EDIT -------------- //

export const WeatherAdvisoryEdit = ({
  onclick,
  id,
  triggerRefresh,
}: AdvisoryEditProps) => {
  const [formData, setFormData] = useState<WeatherProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const [originalData, setOriginalData] = useState<WeatherProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [conFirmation, setConFirmation] = useState<boolean>(false);
  const [notChange, setNotChange] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------- FETCH NG I EEDIT NA DATA ---------------//

  useEffect(() => {
    const fetchDataEdit = async () => {
      try {
        const response = await axios.get<GetWeatherProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=weather&id=${id}`,
        );

        const fetchedData = {
          title: response.data.title ?? "",
          details: response.data.details ?? "",
          dateTime: response.data.date_time ?? "",
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataEdit();
  }, [id]);

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUnchanged =
      formData.title === originalData.title &&
      formData.details === originalData.details &&
      formData.dateTime === originalData.dateTime;

    if (isUnchanged) {
      setConFirmation(false);
      setNotChange(true);
      setTimeout(() => {
        setNotChange(false);
      }, 1600);

      return;
    }

    if (formData.title && formData.details && formData.dateTime) {
      try {
        setisLoading(true);

        await axios.post(
          `http://localhost/Disaster-backend/public/updateAdvisory.php?type=weather&id=${id}`,
          formData,
          {},
        );

        setisPosted(true);
        triggerRefresh();
        setConFirmation(false);

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

  useEffect(() => {
    gsap.fromTo(
      ".bounce",
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
  }, [conFirmation]);

  return (
    <div className="dark:bg-itim/70 bg-itim/50 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {conFirmation && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <ConfirmationEdit
            advisory="Weather Advisory"
            onUpdate={handleSubmit}
            oncancel={() => setConFirmation(false)}
          />
        </div>
      )}
      {isPosted && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <SuccessEdit advisory="Weather Advisory" />
        </div>
      )}
      {notChange && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <EditNotChange />
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
          <h2>Edit Weather Advisory</h2>
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
          type="button"
          onClick={() => setConFirmation(true)}
          disabled={isLoading || notChange}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG ROAD ADVISORY UPDATES EDIT -------------- //

export const RoadAdvisoryEdit = ({
  onclick,
  id,
  triggerRefresh,
}: AdvisoryEditProps) => {
  const [formData, setFormData] = useState<RoadProps>({
    title: "",
    details: "",
    dateTime: "",
    status: "",
  });

  const [originalData, setOriginalData] = useState<RoadProps>({
    title: "",
    details: "",
    dateTime: "",
    status: "",
  });

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [conFirmation, setConFirmation] = useState<boolean>(false);
  const [notChange, setNotChange] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

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

  // ----------- FETCH NG I EEDIT NA DATA ---------------//

  useEffect(() => {
    const fetchDataEdit = async () => {
      try {
        const response = await axios.get<GetRoadProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=road&id=${id}`,
        );

        const fetchedData = {
          title: response.data.title ?? "",
          details: response.data.details ?? "",
          dateTime: response.data.date_time ?? "",
          status: response.data.status ?? "",
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataEdit();
  }, [id]);

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUnchanged =
      formData.title === originalData.title &&
      formData.details === originalData.details &&
      formData.dateTime === originalData.dateTime &&
      formData.status === originalData.status;

    if (isUnchanged) {
      setConFirmation(false);
      setNotChange(true);
      setTimeout(() => {
        setNotChange(false);
      }, 1600);

      return;
    }

    if (
      formData.title &&
      formData.details &&
      formData.dateTime &&
      formData.status
    ) {
      try {
        setisLoading(true);

        await axios.post(
          `http://localhost/Disaster-backend/public/updateAdvisory.php?type=road&id=${id}`,
          formData,
          {},
        );

        setisPosted(true);
        triggerRefresh();
        setConFirmation(false);

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

  useEffect(() => {
    gsap.fromTo(
      ".bounce",
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
  }, [conFirmation]);

  return (
    <div className="dark:bg-itim/70 bg-itim/50 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {conFirmation && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <ConfirmationEdit
            advisory="Road Advisory"
            onUpdate={handleSubmit}
            oncancel={() => setConFirmation(false)}
          />
        </div>
      )}
      {isPosted && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <SuccessEdit advisory="Road Advisory" />
        </div>
      )}
      {notChange && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <EditNotChange />
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
          <h2>Edit Road Advisory</h2>
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
          type="button"
          onClick={() => setConFirmation(true)}
          disabled={isLoading || notChange}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG  COMMUNITY NOTICE EDIT -------------- //

export const CommunityNoticeEdit = ({
  onclick,
  id,
  triggerRefresh,
}: AdvisoryEditProps) => {
  const [formData, setFormData] = useState<CommunityNoticeProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const [originalData, setOriginalData] = useState<CommunityNoticeProps>({
    title: "",
    details: "",
    dateTime: "",
  });

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [conFirmation, setConFirmation] = useState<boolean>(false);
  const [notChange, setNotChange] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------- FETCH NG I EEDIT NA DATA ---------------//

  useEffect(() => {
    const fetchDataEdit = async () => {
      try {
        const response = await axios.get<GetRoadProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=community&id=${id}`,
        );

        const fetchedData = {
          title: response.data.title ?? "",
          details: response.data.details ?? "",
          dateTime: response.data.date_time ?? "",
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataEdit();
  }, [id]);

  // ----------- DITO YUNG LOGIC NG SUBMIT FORM ----------- //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isUnchanged =
      formData.title === originalData.title &&
      formData.details === originalData.details &&
      formData.dateTime === originalData.dateTime;

    if (isUnchanged) {
      setConFirmation(false);
      setNotChange(true);
      setTimeout(() => {
        setNotChange(false);
      }, 1600);

      return;
    }

    if (formData.title && formData.details && formData.dateTime) {
      try {
        setisLoading(true);

        await axios.post(
          `http://localhost/Disaster-backend/public/updateAdvisory.php?type=community&id=${id}`,
          formData,
          {},
        );

        setisPosted(true);
        triggerRefresh();
        setConFirmation(false);

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

  useEffect(() => {
    gsap.fromTo(
      ".bounce",
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
  }, [conFirmation]);

  return (
    <div className="dark:bg-itim/70 bg-itim/50 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {conFirmation && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <ConfirmationEdit
            advisory="Community Notice"
            onUpdate={handleSubmit}
            oncancel={() => setConFirmation(false)}
          />
        </div>
      )}
      {isPosted && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <SuccessEdit advisory="Community Notice" />
        </div>
      )}
      {notChange && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <EditNotChange />
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
          <h2>Edit Community Notice</h2>
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

        <button
          type="button"
          onClick={() => setConFirmation(true)}
          disabled={isLoading || notChange}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

// ------------ FORM NG DISASTER UPDATES EDIT -------------- //

export const DisasterUpdatesEdit = ({
  onclick,
  id,
  triggerRefresh,
}: AdvisoryEditProps) => {
  const [formData, setFormData] = useState<DisasterProps>({
    disasterType: "",
    title: "",
    details: "",
    dateTime: "",
    image: null,
  });

  const [originalData, setOriginalData] = useState<DisasterProps>({
    disasterType: "",
    title: "",
    details: "",
    dateTime: "",
    image: null,
  });

  const [isComplete, setisComplete] = useState<boolean>(false);
  const [isPosted, setisPosted] = useState<boolean>(false);
  const [conFirmation, setConFirmation] = useState<boolean>(false);
  const [notChange, setNotChange] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchDataEdit = async () => {
      try {
        const response = await axios.get<GetDisasterProps>(
          `http://localhost/Disaster-backend/public/getAdvisories.php?type=disaster&id=${id}`,
        );

        const fetchedData = {
          title: response.data.title ?? "",
          disasterType: response.data.disaster_type ?? "",
          details: response.data.details ?? "",
          dateTime: response.data.date_time ?? "",
          image: response.data.image_url ?? "",
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataEdit();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("ID is undefined. Cannot submit form.");
      return;
    }

    const isUnchanged =
      formData.title === originalData.title &&
      formData.details === originalData.details &&
      formData.dateTime === originalData.dateTime &&
      formData.disasterType === originalData.disasterType &&
      (typeof formData.image === "string" ||
        formData.image === originalData.image);

    if (isUnchanged) {
      setConFirmation(false);
      setNotChange(true);
      setTimeout(() => {
        setNotChange(false);
      }, 1600);
      return;
    }

    if (
      formData.title &&
      formData.details &&
      formData.dateTime &&
      formData.disasterType
    ) {
      try {
        setisLoading(true);

        const formPayload = new FormData();
        formPayload.append("id", id.toString());
        formPayload.append("title", formData.title);
        formPayload.append("details", formData.details);
        formPayload.append("dateTime", formData.dateTime);
        formPayload.append("disasterType", formData.disasterType);

        if (formData.image instanceof File) {
          formPayload.append("image", formData.image);
        }

        await axios.post(
          `http://localhost/Disaster-backend/public/updateAdvisory.php?type=disaster&id=${id}`,
          formPayload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        setisPosted(true);
        triggerRefresh();
        setConFirmation(false);

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

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      { opacity: 0, y: -20, duration: 300 },
      { opacity: 1, y: 0 },
    );
  }, [isComplete, isPosted]);

  useEffect(() => {
    gsap.fromTo(
      ".bounce",
      { opacity: 0, scale: 0, duration: 300 },
      { scale: 1, opacity: 1, ease: "power4.inOut" },
    );
  }, [conFirmation]);

  return (
    <div className="dark:bg-itim/70 bg-itim/50 absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center shadow-2xl">
      {isComplete && (
        <div className="popUp absolute top-8 z-50">
          <CompleteFormAlert />
        </div>
      )}
      {conFirmation && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <ConfirmationEdit
            advisory="Disaster Updates"
            onUpdate={handleSubmit}
            oncancel={() => setConFirmation(false)}
          />
        </div>
      )}
      {isPosted && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <SuccessEdit advisory="Disaster Updates" />
        </div>
      )}
      {notChange && (
        <div className="bounce absolute top-1/2 left-1/2 z-50 -translate-1/2">
          <EditNotChange />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-transparent-blue border-dark-blue/50 dark:border-puti/10 dark:bg-light-black flex w-[600px] flex-col gap-5 rounded-xl border px-10 py-8 backdrop-blur-sm"
      >
        <HiOutlineX
          className="absolute top-5 right-5 text-xl transition-all duration-300 hover:text-red-500"
          onClick={onclick}
        />
        <div className="mx-auto mb-3 flex items-center gap-4">
          <PiWarningFill className="text-dark-blue text-xl" />
          <h2>Edit Disaster Updates</h2>
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
              value={formData.title}
              className="focus:border-dark-blue border-dark-blue/50 w-full border px-4 py-3 text-sm outline-none placeholder:text-xs dark:border-gray-500/30"
              placeholder="Enter Disaster Updates Title"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-3 text-sm">
            <MdOutlineNotes className="text-dark-blue text-lg" />
            <p>Details</p>
          </div>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            maxLength={1000}
            className="focus:border-dark-blue scrollBar border-dark-blue/50 h-[150px] w-full resize-none border px-4 py-3 text-xs outline-none placeholder:text-xs dark:border-gray-500/30"
            placeholder="Enter Details... (up to 1000 characters)"
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
              value={formData.dateTime}
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
          type="button"
          onClick={() => setConFirmation(true)}
          disabled={isLoading || notChange}
          className={`bg-dark-blue text-puti mt-3 cursor-pointer rounded-md border py-3 transition-all duration-300 ${
            isLoading ? "cursor-not-allowed opacity-60" : "hover:opacity-90"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader />
              Updating...
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};
