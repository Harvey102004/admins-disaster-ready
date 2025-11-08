import axios from "axios";
import z from "zod";
import { updateProfileSchema } from "@/lib/schema/accountSettings";

const API_ACCOUNT_SETTING =
  "https://greenyellow-lion-623632.hostingersite.com/public/AccountSettings.php";

export type UserProfile = z.infer<typeof updateProfileSchema>;

export const updateProfile = async (data: UserProfile) => {
  try {
    const response = await axios.post(API_ACCOUNT_SETTING, data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
