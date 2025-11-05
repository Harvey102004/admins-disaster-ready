import axios from "axios";
import z from "zod";
import {
  TWeatherAdvisory,
  TRoadAdvisory,
  TDisasterAdvisory,
  TCommunity,
} from "../../../types";

import {
  communityNoticeSchema,
  disasterUpdatesSchema,
  roadAdvisorySchema,
  weatherAdvisorySchema,
} from "@/lib/schema/updateNews";

// FETCH ADVISORIES

const API_URL_WEATHER =
  "http://localhost:3001/public/getAdvisories.php?type=weather";

const API_URL_ROAD = "http://localhost:3001/public/getAdvisories.php?type=road";

const API_URL_DISASTER =
  "http://localhost:3001/public/getAdvisories.php?type=disaster";

const API_URL_COMMUNITY =
  "http://localhost:3001/public/getAdvisories.php?type=community";

export const getWeather = async (): Promise<TWeatherAdvisory[]> => {
  try {
    const response = await axios.get<TWeatherAdvisory[]>(API_URL_WEATHER, {
      withCredentials: true,
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getRoad = async (): Promise<TRoadAdvisory[]> => {
  try {
    const response = await axios.get<TRoadAdvisory[]>(API_URL_ROAD, {
      withCredentials: true,
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getDisaster = async (): Promise<TDisasterAdvisory[]> => {
  try {
    const response = await axios.get<TDisasterAdvisory[]>(API_URL_DISASTER, {
      withCredentials: true,
    });
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCommunity = async (): Promise<TCommunity[]> => {
  try {
    const response = await axios.get<TCommunity[]>(API_URL_COMMUNITY, {
      withCredentials: true,
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET DETAILS OF SPECIFIC ADVISORY

export const getWeatherDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TWeatherAdvisory>(
      `http://localhost/Disaster-backend/public/getAdvisories.php?type=weather&id=${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRoadDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TRoadAdvisory>(
      `http://localhost/Disaster-backend/public/getAdvisories.php?type=road&id=${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getDisasterDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TDisasterAdvisory>(
      `http://localhost/Disaster-backend/public/getAdvisories.php?type=disaster&id=${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCommunityDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<TWeatherAdvisory>(
      `http://localhost/Disaster-backend/public/getAdvisories.php?type=community&id=${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// DELETE OF SPECIFIC ADVISORY

export const deleteWeather = async ({ id }: { id: string }) => {
  const formData = new FormData();
  formData.append("_method", "DELETE");

  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=weather&id=${id}`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteRoad = async ({ id }: { id: string }) => {
  const formData = new FormData();
  formData.append("_method", "DELETE");

  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=road&id=${id}`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteDisaster = async ({ id }: { id: string }) => {
  const formData = new FormData();
  formData.append("_method", "DELETE");

  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=disaster&id=${id}`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteCommunity = async ({ id }: { id: string }) => {
  const formData = new FormData();
  formData.append("_method", "DELETE");

  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/deleteAdvisory.php?type=community&id=${id}`,
      formData,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ADD  ADVISORIES

const API_URL_ADD_WEATHER =
  "http://localhost/Disaster-backend/public/postAdvisory.php?type=weather";

const API_URL_ADD_ROAD =
  "http://localhost/Disaster-backend/public/postAdvisory.php?type=road";

const API_URL_ADD_DISASTER =
  "http://localhost/Disaster-backend/public/postAdvisory.php?type=disaster";

const API_URL_ADD_COMMUNITY =
  "http://localhost/Disaster-backend/public/postAdvisory.php?type=community";

export type WeatherType = z.infer<typeof weatherAdvisorySchema>;
export type RoadType = z.infer<typeof roadAdvisorySchema>;
export type DisasterType = z.infer<typeof disasterUpdatesSchema>;
export type CommunityType = z.infer<typeof communityNoticeSchema>;

export const addWeatherAdvisory = async (data: WeatherType) => {
  try {
    const response = await axios.post(
      API_URL_ADD_WEATHER,
      {
        title: data.title,
        details: data.details,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post weather advisory",
    );
  }
};

export const addRoadAdvisory = async (data: RoadType) => {
  try {
    const response = await axios.post(
      API_URL_ADD_ROAD,
      {
        title: data.title,
        details: data.details,
        status: data.status,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post road advisory",
    );
  }
};

export const addDisasterUpdates = async (data: DisasterType) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("details", data.details);
    formData.append("dateTime", data.dateTime);
    formData.append("disasterType", data.disasterType);
    formData.append("image", data.image[0]);
    formData.append("added_by", data.added_by);

    const response = await axios.post(API_URL_ADD_DISASTER, formData);

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post road advisory",
    );
  }
};

export const addCommunityNotice = async (data: WeatherType) => {
  try {
    const response = await axios.post(
      API_URL_ADD_COMMUNITY,
      {
        title: data.title,
        details: data.details,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post weather advisory",
    );
  }
};

// EDIT  ADVISORIES

export const editWeatherAdvisory = async ({
  id,
  data,
}: {
  id: string;
  data: WeatherType;
}) => {
  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/updateAdvisory.php?type=weather&id=${id}`,
      {
        title: data.title,
        details: data.details,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update weather advisory",
    );
  }
};

export const editRoadAvisory = async ({
  id,
  data,
}: {
  id: string;
  data: RoadType;
}) => {
  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/updateAdvisory.php?type=road&id=${id}`,
      {
        title: data.title,
        details: data.details,
        status: data.status,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update community notice",
    );
  }
};

export const editDisasterUpdates = async ({
  id,
  data,
}: {
  id: string;
  data: DisasterType;
}) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", data.title);
    formData.append("disasterType", data.disasterType);
    formData.append("details", data.details);
    formData.append("dateTime", data.dateTime);

    if (data.image instanceof FileList && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    formData.append("added_by", data.added_by ?? "");

    const response = await axios.post(
      `http://localhost/Disaster-backend/public/updateAdvisory.php?type=disaster&id=${id}`,
      formData,
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update Disaster Updates",
    );
  }
};

export const editCommunityNotice = async ({
  id,
  data,
}: {
  id: string;
  data: CommunityType;
}) => {
  try {
    const response = await axios.post(
      `http://localhost/Disaster-backend/public/updateAdvisory.php?type=community&id=${id}`,
      {
        title: data.title,
        details: data.details,
        dateTime: data.dateTime,
        added_by: data.added_by,
      },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update community notice",
    );
  }
};
