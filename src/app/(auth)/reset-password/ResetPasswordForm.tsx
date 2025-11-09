"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    } catch {
      setMessage("❌ Server error. Please try again later.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-lg transition-all dark:bg-neutral-800 dark:text-white">
      <h1 className="mb-3 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Reset Your Password
      </h1>
      {!token ? (
        <p className="text-center text-red-500">Invalid token link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* password fields */}
        </form>
      )}
      {message && (
        <p
          className={`mt-5 text-center text-sm ${isError ? "text-red-500" : "text-green-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
