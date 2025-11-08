import axios from "axios";

const API_GET_DONATIONS =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchDonations.php";

export const getAllDonations = async () => {
  try {
    const res = await axios.get(API_GET_DONATIONS, {
      withCredentials: true,
    });

    return res.data;
  } catch (err: any) {
    console.error("Error fetching donations:", err);
  }
};
