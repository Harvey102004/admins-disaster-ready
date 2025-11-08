"use client";
import ProtectedRoute from "@/components/ProtectedRoutes";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { toast } from "sonner";

export default function SubAdminAccountSettings() {
  const [activeForm, setActiveForm] = useState<
    "updateProfile" | "changePassword"
  >("updateProfile");

  const [showPassword, setShowPassword] = useState({
    profilePassword: false,
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [isConfirmToastActive, setIsConfirmToastActive] = useState(false);

  const togglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [user, setUser] = useState<{
    id: number;
    username: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const action = formData.get("action") as string | null;

    if (!action) {
      toast.error("Action missing", { style: { marginLeft: "160px" } });
      return;
    }

    const body: Record<string, any> = { action, id: user.id };

    if (action === "updateProfile") {
      body.username = formData.get("username");
      body.email = formData.get("email");
      body.password = formData.get("password");
    } else if (action === "changePassword") {
      body.currentPassword = formData.get("currentPassword");
      body.newPassword = formData.get("newPassword");
      body.confirmPassword = formData.get("confirmPassword");
    }

    setIsConfirmToastActive(true);

    toast.custom(
      (t) => (
        <div className="w-96 rounded-lg border border-blue-400 bg-blue-100 p-4 shadow-md">
          <p className="text-light-black mb-3 text-center text-sm font-medium">
            {action === "updateProfile"
              ? "Are you sure you want to update your profile?"
              : "Are you sure you want to change your password?"}
          </p>
          <div className="flex justify-center gap-2">
            <button
              className="bg-dark-blue hover:bg-dark-blue/80 rounded px-3 py-1 text-xs text-white"
              onClick={async () => {
                toast.dismiss("confirm-account-settings");
                const loadingToastId = toast.loading(
                  action === "updateProfile"
                    ? "Updating profile..."
                    : "Changing password...",
                  { style: { marginLeft: "160px" } },
                );

                try {
                  const res = await axios.post(
                    "https://greenyellow-lion-623632.hostingersite.com/public/AccountSettings.php",
                    body, // ✅ send body directly
                    {
                      headers: { "Content-Type": "application/json" },
                      withCredentials: true, // ✅ include session if needed
                    },
                  );

                  const data = res.data;

                  if (res.status === 200 && data?.success) {
                    toast.success(data.message || "Success", {
                      id: loadingToastId,
                      style: { marginLeft: "160px" },
                    });
                  } else {
                    toast.error(data?.message || "Something went wrong", {
                      id: loadingToastId,
                      style: { marginLeft: "160px" },
                    });
                  }
                } catch (error: any) {
                  toast.error(
                    error?.response?.data?.message ||
                      error.message ||
                      "Something went wrong",
                    {
                      id: loadingToastId,
                      style: { marginLeft: "160px" },
                    },
                  );
                } finally {
                  setIsConfirmToastActive(false);
                }
              }}
            >
              Yes
            </button>
            <button
              className="rounded bg-red-500 px-3 py-1 text-xs text-white hover:bg-red-400"
              onClick={() => toast.dismiss("confirm-account-settings")}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        id: "confirm-account-settings",
        style: { marginLeft: "160px" },
        duration: Infinity,
      },
    );
  };

  if (!user) {
    return (
      <ProtectedRoute>
        {" "}
        <p className="mt-10 text-center">Loading account info...</p>{" "}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-full overflow-auto px-8 pt-4 transition-all duration-300">
        <div className="flex items-center justify-center gap-3 border-b pb-4">
          <h1 className="text-dark-blue text-lg font-bold">Account Settings</h1>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => {
              if (!isConfirmToastActive) setActiveForm("updateProfile");
            }}
            className={`rounded px-4 py-2 ${
              activeForm === "updateProfile"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Update Profile
          </button>

          <button
            onClick={() => {
              if (!isConfirmToastActive) setActiveForm("changePassword");
            }}
            className={`rounded px-4 py-2 ${
              activeForm === "changePassword"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            Change Password
          </button>
        </div>

        <div className="mt-7 flex justify-center">
          {activeForm === "updateProfile" && (
            <form
              onSubmit={handleSubmit}
              className="w-[60%] space-y-8 rounded-lg p-4"
            >
              <input type="hidden" name="action" value="updateProfile" />

              <div>
                <label className="mb-2 flex items-center gap-2 font-medium">
                  <FaUser className="text-sm" /> Username
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  name="username"
                  defaultValue={user.username}
                  className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 focus:ring-0 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 font-medium">
                  <MdEmail className="text-sm" /> Email
                </label>
                <input
                  type="email"
                  autoComplete="off"
                  name="email"
                  defaultValue={user.email}
                  className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 focus:ring-0 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 font-medium">
                  <FaLock className="text-sm" /> Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.profilePassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    placeholder="Enter current password"
                    className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 pr-14 focus:ring-0 focus:outline-none"
                  />
                  <div
                    onClick={() => togglePassword("profilePassword")}
                    className="text-light-black absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-lg dark:text-zinc-300"
                  >
                    {showPassword.profilePassword ? (
                      <RiEyeFill />
                    ) : (
                      <RiEyeOffFill />
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Update Profile
              </button>
            </form>
          )}

          {activeForm === "changePassword" && (
            <form
              onSubmit={handleSubmit}
              className="w-[60%] space-y-8 rounded-lg p-4"
            >
              <input type="hidden" name="action" value="changePassword" />

              <label className="mb-2 flex items-center gap-2 font-medium">
                <FaLock className="text-sm" /> Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  autoComplete="off"
                  placeholder="Enter current password"
                  className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 pr-14 focus:ring-0 focus:outline-none"
                />
                <div
                  onClick={() => togglePassword("currentPassword")}
                  className="text-light-black absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-lg dark:text-zinc-300"
                >
                  {showPassword.currentPassword ? (
                    <RiEyeFill />
                  ) : (
                    <RiEyeOffFill />
                  )}
                </div>
              </div>

              <label className="mb-2 flex items-center gap-2 font-medium">
                <FaLock className="text-sm" /> New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  autoComplete="off"
                  placeholder="Enter new password"
                  className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 pr-14 focus:ring-0 focus:outline-none"
                />
                <div
                  onClick={() => togglePassword("newPassword")}
                  className="text-light-black absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-lg dark:text-zinc-300"
                >
                  {showPassword.newPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                </div>
              </div>

              <label className="mb-2 flex items-center gap-2 font-medium">
                <FaLock className="text-sm" /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="off"
                  placeholder="Confirm password"
                  className="focus:border-dark-blue w-full rounded border border-gray-300 px-4 py-3 pr-14 focus:ring-0 focus:outline-none"
                />
                <div
                  onClick={() => togglePassword("confirmPassword")}
                  className="text-light-black absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-lg dark:text-zinc-300"
                >
                  {showPassword.confirmPassword ? (
                    <RiEyeFill />
                  ) : (
                    <RiEyeOffFill />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
              >
                Change Password
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
