import axios from "axios";
import { evacuationCenterSchema } from "@/lib/schema/evacuation";
import { EvacuationCenterProps } from "../../../types";
import z from "zod";

// -------- POST EVACUATION CENTER ---------- //

export type EvacuationCenterFormData = z.infer<typeof evacuationCenterSchema>;

const API_ADD_EVACUATION =
  "http://localhost/Disaster-backend/controllers/evacuationCenterController.php";

export const addEvacuationCenter = async (data: EvacuationCenterFormData) => {
  try {
    const response = await axios.post(API_ADD_EVACUATION, data);

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
  "http://localhost/Disaster-backend/controllers/evacuationCenterController.php";

export const getEvacuationCenters = async (): Promise<
  EvacuationCenterProps[]
> => {
  try {
    const response =
      await axios.get<EvacuationCenterProps[]>(API_GET_EVACUATIONS);

    return response.data;
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
      `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?&id=${id}`,
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
      `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?&id=${id}`,
      formData,
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
      `http://localhost/Disaster-backend/controllers/evacuationCenterController.php?id=${id}`,
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
    );

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update evacuation center",
    );
  }
};
