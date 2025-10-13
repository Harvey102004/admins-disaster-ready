import axios from "axios";
import z from "zod";
import { brgyContactSchema } from "@/lib/schema/brgyContacts";

export type BrgyContactFormData = z.infer<typeof brgyContactSchema>;

const API_CONTACT =
  "http://localhost/Disaster-backend/public/barangayContact.php";

export const addBrgyContact = async (data: BrgyContactFormData) => {
  try {
    const response = await axios.post(API_CONTACT, data);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to add Barangay contact",
    );
  }
};

// GET ALL CONTACTS

export const getBrgyContacts = async () => {
  try {
    const response = await axios.get(API_CONTACT);

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch Barangay contacts",
    );
  }
};

// GET SPECIFIC CONTACT
export const getBrgyContactDetails = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`${API_CONTACT}?id=${id}`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch contact info",
    );
  }
};

//EDIT CONTACTS

export const editBrgyContact = async ({
  id,
  data,
}: {
  id: string | number;
  data: BrgyContactFormData;
}) => {
  try {
    const response = await axios.put(`${API_CONTACT}?id=${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(
      error?.response?.data?.message || "Failed to update Barangay contact",
    );
  }
};
