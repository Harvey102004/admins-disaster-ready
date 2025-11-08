import axios from "axios";

const API_GET_ALL_REPORTS =
  "https://greenyellow-lion-623632.hostingersite.com/public/getIncidents.php";

export const getAllReports = async () => {
  try {
    const res = await axios.get(API_GET_ALL_REPORTS, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
