"use client";

import { FaUserEdit } from "react-icons/fa";
import { IoMdArchive } from "react-icons/io";
import { getUsers, getArchivedUsers } from "../../../server/api/users";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from "sonner";
import { FaUserLock } from "react-icons/fa6";
import { TiArrowBack } from "react-icons/ti";
import { MdUnarchive } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuperAdminUserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showModalArchived, setShowModalArchived] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isPassUnHide, setPassIsUnHide] = useState(false);
  const [isUserPage, setIsUserPage] = useState(true);

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const {
    data: archivedUsersData,
    isLoading: archivedLoading,
    error: archivedError,
    refetch: refetchArchived,
  } = useQuery({
    queryKey: ["archivedUsers"],
    queryFn: getArchivedUsers,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };

    for (const i in intervals) {
      const interval = intervals[i];
      if (seconds >= interval) {
        const count = Math.floor(seconds / interval);
        return `${count} ${i}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  }

  const handleAction = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUnarchive = (user: any) => {
    setSelectedUser(user);
    setShowModalArchived(true);
  };
  const confirmAction = async () => {
    if (!currentUser?.id) {
      setModalError("Super admin not logged in!");
      return;
    }

    if (!password) {
      setModalError("Enter your password!");
      return;
    }

    const actionType = showModal ? "deactivate" : "activate";

    try {
      const payload = {
        action: actionType,
        target_user_id: selectedUser.id,
        super_admin_id: currentUser.id,
        super_admin_password: password,
      };

      const response = await axios.post(
        "http://localhost/Disaster-backend/public/userController.php",
        JSON.stringify(payload),
        { headers: { "Content-Type": "application/json" } },
      );

      if (response.data?.success) {
        toast.success(response.data.message || "Success!");

        // Close both modals safely
        setShowModal(false);
        setShowModalArchived(false);

        setPassword("");
        setModalError(null);

        refetchUsers();
        refetchArchived();
      } else {
        setModalError(response.data?.message || "Something went wrong!");
      }
    } catch (err: any) {
      setModalError(err.response?.data?.message || "Error occurred!");
    }
  };

  const sortedUsers = usersData?.data
    ?.map((user: any) => {
      const lastLogin = user.last_logged_in
        ? new Date(user.last_logged_in)
        : null;

      let displayTime = "";
      let isRed = false; // flag for inactive ≥ 6 months

      if (!lastLogin) {
        displayTime = "Never";
      } else {
        const now = new Date();
        const monthsDiff =
          (now.getFullYear() - lastLogin.getFullYear()) * 12 +
          (now.getMonth() - lastLogin.getMonth());

        if (monthsDiff >= 6) {
          displayTime = `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`;
          isRed = true; // inactive ≥ 6 months
        } else if (monthsDiff > 0) {
          displayTime = `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`;
        } else {
          // less than 1 month, show weeks/days/hours
          displayTime = timeAgo(user.last_logged_in);
        }
      }

      return { ...user, displayTime, lastLogin, isRed };
    })
    ?.sort((a: any, b: any) => {
      // 1. inactive ≥ 6 months first (isRed)
      if (a.isRed && !b.isRed) return -1;
      if (!a.isRed && b.isRed) return 1;

      // 2. then "Never" users
      if (a.displayTime === "Never" && b.displayTime !== "Never") return -1;
      if (b.displayTime === "Never" && a.displayTime !== "Never") return 1;

      // 3. then the rest by lastLogin descending
      return (b.lastLogin?.getTime() || 0) - (a.lastLogin?.getTime() || 0);
    });

  const archivedCount = archivedUsersData?.data?.data?.length || 0;

  return (
    <>
      {isUserPage ? (
        <div className="w-full px-14 py-10 transition-all duration-300">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserEdit className="text-2xl" />
                <h2 className="text-xl font-semibold">User Management</h2>
              </div>

              <div className="relative">
                <IoMdArchive
                  className="text-2xl"
                  onClick={() => setIsUserPage(false)}
                />

                {archivedCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {archivedCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* USERS TABLE */}
          <div className="scrollBar relative mt-10 max-h-[78vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Username
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Barangay
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Last Logged In
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {usersLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="p-3">
                            <Skeleton className="h-6 w-full rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : sortedUsers.map((user: any) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-3 text-[13px]">{user.id}</td>
                        <td className="p-3 text-[13px]">{user.username}</td>
                        <td className="p-3 text-[13px]">{user.email}</td>
                        <td className="p-3 text-[13px]">{user.barangay}</td>
                        <td
                          className={`user p-3 text-[13px] ${
                            user.isRed ? "font-medium text-red-500" : ""
                          }`}
                        >
                          {user.displayTime}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            className="bg-dark-blue rounded-full px-3 py-1.5 text-[10px] text-white"
                            onClick={() => handleAction(user)}
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* PASSWORD MODAL */}
          {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
              <div className="dark:bg-light-black w-[450px] space-y-4 rounded-lg bg-white p-6">
                <h3 className="text-center text-lg font-semibold">
                  Confirm Deactivation
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  User :{" "}
                  <span className="font-semibold">
                    {selectedUser?.username}
                  </span>
                </p>

                {modalError && (
                  <p className="mt-1 text-center text-sm text-red-500">
                    {modalError}
                  </p>
                )}

                <div className="relative">
                  <input
                    type={isPassUnHide ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-full w-full rounded border px-4 py-3 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {isPassUnHide ? (
                    <IoEye
                      className="absolute top-3 right-3 cursor-pointer text-xl text-gray-600"
                      onClick={() => setPassIsUnHide(false)}
                    />
                  ) : (
                    <IoMdEyeOff
                      className="absolute top-3 right-3 cursor-pointer text-xl text-gray-600"
                      onClick={() => setPassIsUnHide(true)}
                    />
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setPassword("");
                      setModalError(null);
                    }}
                    className="rounded bg-red-500 px-4 py-3 text-xs text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmAction}
                    className="bg-dark-blue rounded px-4 py-3 text-xs text-white"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full px-14 py-10 transition-all duration-300">
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <FaUserLock className="text-2xl" />
                <h2 className="text-xl font-semibold">Archived Users</h2>
              </div>

              <p
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsUserPage(true)}
              >
                {" "}
                <span onClick={() => setIsUserPage(true)}>
                  <TiArrowBack />
                </span>
                Back
              </p>
            </div>
          </div>

          {/* ARCHIVED USERS TABLE */}
          <div className="scrollBar relative mt-10 max-h-[78vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Username
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Barangay
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="bg-background sticky top-0 px-3 py-4 text-right text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {archivedLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="p-3">
                            <Skeleton className="h-6 w-full rounded-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : archivedUsersData?.data?.data.map((user: any) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-3 text-[13px]">{user.id}</td>
                        <td className="p-3 text-[13px]">{user.username}</td>
                        <td className="p-3 text-[13px]">{user.email}</td>
                        <td className="p-3 text-[13px]">{user.barangay}</td>
                        <td
                          className={`user p-3 text-[13px] ${
                            user.isRed ? "font-medium text-red-500" : ""
                          }`}
                        >
                          {user.status}
                        </td>
                        <td className="p-3">
                          <div className="mr-2.5 flex items-center justify-end">
                            <MdUnarchive
                              className="cursor-pointer text-2xl"
                              onClick={() => handleUnarchive(user)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* PASSWORD MODAL */}
          {showModalArchived && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
              <div className="dark:bg-light-black w-[450px] space-y-4 rounded-lg bg-white p-6">
                <h3 className="text-center text-lg font-semibold">
                  Confirm Deactivation
                </h3>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  User :{" "}
                  <span className="font-semibold">
                    {selectedUser?.username}
                  </span>
                </p>

                {modalError && (
                  <p className="mt-1 text-center text-sm text-red-500">
                    {modalError}
                  </p>
                )}

                <div className="relative">
                  <input
                    type={isPassUnHide ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-full w-full rounded border px-4 py-3 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {isPassUnHide ? (
                    <IoEye
                      className="absolute top-3 right-3 cursor-pointer text-xl text-gray-600"
                      onClick={() => setPassIsUnHide(false)}
                    />
                  ) : (
                    <IoMdEyeOff
                      className="absolute top-3 right-3 cursor-pointer text-xl text-gray-600"
                      onClick={() => setPassIsUnHide(true)}
                    />
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowModalArchived(false);
                      setPassword("");
                      setModalError(null);
                    }}
                    className="rounded bg-red-500 px-4 py-3 text-xs text-white"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmAction}
                    className="bg-dark-blue rounded px-4 py-3 text-xs text-white"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
