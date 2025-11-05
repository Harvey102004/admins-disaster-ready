import axios from "axios";

const API_GET_USERS = "http://localhost:3001/public/fetchUser.php";

export const getUsers = async () => {
  try {
    const response = await axios.get(API_GET_USERS, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const API_USER_ACTION = "http://localhost:3001/public/userController.php";

export const toggleUserStatus = async ({
  userId,
  action,
  superAdminId,
  superAdminPassword,
}: {
  userId: number | string;
  action: "deactivate";
  superAdminId: number | string;
  superAdminPassword: string;
}) => {
  const payload = {
    action,
    target_user_id: userId,
    super_admin_id: superAdminId,
    super_admin_password: superAdminPassword,
  };

  const response = await axios.post(API_USER_ACTION, payload, {
    withCredentials: true,
  });
  return response.data;
};

const API_GET_ARCHIVED = "http://localhost:3001/public/fetchArchivedUser.php";

export const getArchivedUsers = async () => {
  try {
    const response = await axios.get(API_GET_ARCHIVED, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching archived users:", error);
    throw error;
  }
};
