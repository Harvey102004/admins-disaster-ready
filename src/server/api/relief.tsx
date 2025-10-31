import axios from "axios";

const API_GET_RELIEFS =
  "http://localhost/Disaster-backend/public/fetchRelief.php";

export const getReliefs = async () => {
  try {
    const response = await axios.get(API_GET_RELIEFS);
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
  "http://localhost/Disaster-backend/public/reliefDistribution.php";

export const addRelief = async ({
  description,
  total_packs,
  date_input,
}: AddReliefProps) => {
  try {
    const response = await axios.post(API_ADD_RELIEF, {
      description,
      total_packs,
      date_input,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding relief:", error);
    throw error;
  }
};
