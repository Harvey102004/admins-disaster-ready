import axios from "axios";

const API_GET_USERS =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchUser.php";

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

const API_USER_ACTION =
  "https://greenyellow-lion-623632.hostingersite.com/public/userController.php";

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

const API_GET_ARCHIVED =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchArchivedUser.php";

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

const API_GET_PENDING_USERS =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchPendingAccount.php";

export const getPendingUsers = async () => {
  try {
    const response = await axios.get(API_GET_PENDING_USERS, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching archived users:", error);
    throw error;
  }
};

const API_GET_BLOCKED_USERS =
  "https://greenyellow-lion-623632.hostingersite.com/public/fetchBlockedEmails.php";

export const getBlockedUsers = async () => {
  try {
    const response = await axios.get(API_GET_BLOCKED_USERS, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching archived users:", error);
    throw error;
  }
};
