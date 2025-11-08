import axios from "axios";

const API_GET_RELIEFS =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchRelief.php";
const API_GET_RELIEFS_HISTORY =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchBarangayReceivedPacks.php";

export const getReliefs = async () => {
  try {
    const response = await axios.get(API_GET_RELIEFS, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reliefs:", error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(API_GET_RELIEFS_HISTORY, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reliefs:", error);
    throw error;
  }
};

interface AddReliefProps {
  description: string;
  total_packs: string | number;
  date_input: string;
}

const API_ADD_RELIEF =
  "https://greenyellow-lion-623632.hostingersite.com/public/reliefDistribution.php";

export const addRelief = async ({
  description,
  total_packs,
  date_input,
}: AddReliefProps) => {
  try {
    const response = await axios.post(
      API_ADD_RELIEF,
      {
        description,
        total_packs,
        date_input,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error adding relief:", error);
    throw error;
  }
};
