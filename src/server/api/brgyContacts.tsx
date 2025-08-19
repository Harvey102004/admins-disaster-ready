import axios from "axios";
import z from "zod";

import { brgyContactSchema } from "@/lib/schema/brgyContacts";

export type BrgyContactFormData = z.infer<typeof brgyContactSchema>;

const API_ADD_CONTACT =
  "http://localhost/Disaster-backend/public/barangayContact.php";

export const addBrgyContact = async (data: BrgyContactFormData) => {
  try {
    const response = await axios.post(API_ADD_CONTACT, data);

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to post Barangay contact",
    );
  }
};
