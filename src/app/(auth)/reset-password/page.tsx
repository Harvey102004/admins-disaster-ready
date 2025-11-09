"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
      setIsError(true);
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/resetPass.php",
        {
          token,
          password: form.password,
          confirmPassword: form.confirmPassword,
        },
      );

      if (res.data.success) {
        setMessage("✅ Password has been reset successfully!");
        setIsError(false);
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMessage(res.data.message || "❌ Failed to reset password.");
        setIsError(true);
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again later.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-neutral-900">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-lg transition-all dark:bg-neutral-800 dark:text-white">
        <h1 className="mb-3 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Reset Your Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Please enter your new password below. Make sure it's strong and easy
          for you to remember.
        </p>

        {!token ? (
          <p className="text-center text-red-500">Invalid token link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* New Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <IoMdEye size={20} />
                ) : (
                  <IoMdEyeOff size={20} />
                )}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-3 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <IoMdEye size={20} />
                ) : (
                  <IoMdEyeOff size={20} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-md bg-blue-600 py-2.5 text-sm text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p
            className={`mt-5 text-center text-sm ${
              isError ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
