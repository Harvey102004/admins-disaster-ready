import axios from "axios";
import { evacuationCenterSchema } from "@/lib/schema/evacuation";
import { EvacuationCenterProps } from "../../../types";
import z from "zod";

// -------- POST EVACUATION CENTER ---------- //

export type EvacuationCenterFormData = z.infer<typeof evacuationCenterSchema>;

const API_ADD_EVACUATION =
  "https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php";

export const addEvacuationCenter = async (data: EvacuationCenterFormData) => {
  try {
    const response = await axios.post(API_ADD_EVACUATION, data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post Evacuation center",
    );
  }
};

// -------- FETCH ALL EVACUATION CENTER ---------- //

const API_GET_EVACUATIONS =
  "https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php";

export const getEvacuationCenters = async (): Promise<
  EvacuationCenterProps[]
> => {
  try {
    const response = await axios.get(API_GET_EVACUATIONS, {
      withCredentials: true,
      responseType: "text",
    });

    const raw = response.data;

    const firstBracket = raw.indexOf("[");
    if (firstBracket === -1) return [];

    const evacStr = raw.slice(firstBracket);
    const evac = JSON.parse(evacStr);

    return evac;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Evacuation center",
    );
  }
};

// -------- GET EVACUATION CENTER DETAILS ---------- /

export const getEvacuationDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get<EvacuationCenterProps>(
      `https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php?&id=${id}`,
      {
        withCredentials: true,
      },
    );

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Evacuation center",
    );
  }
};

// -------- DELETE EVACUATION CENTER  ---------- /

export const deleteEvacuationCenter = async ({ id }: { id: string }) => {
  try {
    const formData = new FormData();
    formData.append("_method", "DELETE");

    const response = await axios.post(
      `https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php?&id=${id}`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Evacuation center",
    );
  }
};

// -------- EDIT EVACUATION CENTER  ---------- /

import { GetEvacuationProps } from "../../../types";

export const editEvacuationCenter = async ({
  id,
  data,
}: {
  id: string;
  data: GetEvacuationProps;
}) => {
  try {
    const response = await axios.put(
      `https://greenyellow-lion-623632.hostingersite.com/public/evacuationCenter.php?id=${id}`,
      {
        evac_name: data.name,
        evac_location: data.location,
        evac_capacity: data.capacity,
        evac_evacuees: data.current_evacuees,
        evac_contact_person: data.contact_person,
        evac_contact_number: data.contact_number,
        lat: data.lat,
        long: data.long,
        created_by: data.created_by,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update evacuation center",
    );
  }
};
