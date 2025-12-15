"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaKey, FaUserTie } from "react-icons/fa6";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { successToast } from "@/components/toast";

export default function MobileLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const [isShowPass, setIsShowPass] = useState({
    loginPass: false,
    createPass: false,
    confirmPass: false,
  });

  /*     Mobile detection redirect back to desktop (optional)
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || "";
      const isDesktop = !/Mobi|Android|iPhone|iPad|iPod/i.test(ua);
      if (isDesktop) {
        router.push("/login"); // desktop users go to full login page
      }
    }
  }, [router]);

  */

  /* ---------- HANDLE INPUT ---------- */
  const handleChangeValue = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ START COOLDOWN function
  const startCooldown = (seconds: number) => {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem("loginCooldownEnd", endTime.toString());
    updateCooldown(); // immediately update UI
  };

  // ✅ UPDATE COOLDOWN function
  const updateCooldown = () => {
    const savedEndTime = localStorage.getItem("loginCooldownEnd");
    if (!savedEndTime) {
      setCooldown(0);
      return;
    }

    const remaining = Math.max(
      0,
      Math.ceil((parseInt(savedEndTime) - Date.now()) / 1000),
    );
    setCooldown(remaining);

    if (remaining <= 0) {
      localStorage.removeItem("loginCooldownEnd");
      if (cooldownRef.current) clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  };

  useEffect(() => {
    updateCooldown(); // initial check

    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(updateCooldown, 1000);

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    if (loginMessage.includes("Redirecting")) {
      successToast("Success!", "Login completed successfully");
    }
  }, [loginMessage]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cooldown > 0) return;

    setIsLoading(true);
    setLoginMessage("");

    try {
      const response = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/login.php",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        const { password, role, ...safeAccount } = response.data.user;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(safeAccount));
        }

        setLoginMessage(" Login successful! Redirecting...");

        setTimeout(() => {
          router.push("/mobile-reports");
          setLoginMessage("");
        }, 1500);
      } else {
        setLoginMessage(
          response.data.message || " Invalid username or password.",
        );

        if (
          response.data.message &&
          response.data.message
            .toLowerCase()
            .includes("too many failed attempts")
        ) {
          const minutesMatch = response.data.message.match(/(\d+)\s*minute/);
          const cooldownMinutes = minutesMatch ? parseInt(minutesMatch[1]) : 1;
          const cooldownSeconds = cooldownMinutes * 60;

          startCooldown(cooldownSeconds);
        }
      }
    } catch (error) {
      console.error(" Login error:", error);
      setLoginMessage(" Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4">
      {/* ---------- BLUR BACKGROUND ---------- */}

      <div className="bg-dark-blue absolute -top-20 -left-20 h-[150px] w-[150px] rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute bottom-10 left-40 h-16 w-16 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute -top-10 -right-20 h-52 w-52 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute right-10 -bottom-5 h-32 w-32 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute bottom-25 -left-5 h-12 w-12 rounded-full blur-md"></div>

      <div className="flex w-[90%] flex-col items-center justify-center rounded-2xl border bg-black/10 px-7 py-6 shadow-2xl backdrop-blur-xl dark:bg-white/10">
        <div className="text-center">
          <h2 className="text-sm font-semibold">Administrator Access</h2>
          <p className="mt-2 text-[11px]">
            Access is restricted to authorized administrators only.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-6 flex w-full max-w-xs flex-col gap-4 rounded px-1 py-2"
        >
          <div className="relative h-10 w-full">
            <FaUserTie className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-sm" />
            <input
              type="text"
              name="username"
              disabled={isLoading}
              value={formData.username}
              className="text-itim dark:text-puti border-b-itim h-full w-full border-b pl-7 text-xs outline-none placeholder:text-[10px] dark:border-b-neutral-300/50"
              placeholder="Username"
              onChange={handleChangeValue}
              autoComplete="off"
              ref={usernameRef}
            />
          </div>

          <div className="relative h-10 w-full">
            <FaKey className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-sm" />
            <input
              type={isShowPass.loginPass ? "text" : "password"}
              name="password"
              disabled={isLoading}
              value={formData.password}
              className="text-itim dark:text-puti border-b-itim h-full w-full border-b px-7 text-xs outline-none placeholder:text-[10px] dark:border-b-neutral-300/50"
              placeholder="Password"
              onChange={handleChangeValue}
              autoComplete="off"
            />

            {isShowPass.loginPass ? (
              <IoMdEye
                className="text-itim dark:text-puti absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 cursor-pointer text-xl"
                onClick={() =>
                  setIsShowPass((prev) => ({
                    ...prev,
                    loginPass: !prev.loginPass,
                  }))
                }
              />
            ) : (
              <IoMdEyeOff
                className="text-itim dark:text-puti absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 cursor-pointer text-xl"
                onClick={() =>
                  setIsShowPass((prev) => ({
                    ...prev,
                    loginPass: !prev.loginPass,
                  }))
                }
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || cooldown > 0}
            className={`mx-auto mt-3 w-full rounded p-2 text-xs transition ${
              isLoading || cooldown > 0
                ? "cursor-not-allowed bg-gray-500 text-white"
                : "bg-light-black dark:text-light-black text-white dark:bg-white"
            }`}
          >
            {cooldown > 0
              ? `Try again later`
              : isLoading
                ? "Logging in..."
                : "Login"}
          </button>

          {loginMessage && !loginMessage.includes("Redirecting") && (
            <p className="mt-2 text-center text-[10px] text-red-500">
              {loginMessage}
            </p>
          )}

          {cooldown > 0 && (
            <p className="text-center text-[10px] text-red-500">
              Please wait {cooldown}s before trying again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
