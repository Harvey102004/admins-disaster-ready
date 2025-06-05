"use client";

import { ModeToggle } from "@/components/darkmode-toggle";
import { FaUserTie, FaKey } from "react-icons/fa6";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { UserProps } from "../../../../types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { WrongPassword, SuccessLogin } from "@/components/pop-up";
import gsap from "gsap";

export default function Login() {
  /* ----------   FETCH USER DATA ---------- */

  const [userData, setUserData] = useState<UserProps[] | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    try {
      axios.get<UserProps[]>("http://localhost:3001/user").then((response) => {
        setUserData(response.data);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ----------   LOGIN LOGIC ---------- */

  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData) return;

    const matchedUser = userData.find(
      (user) =>
        user.username === formData.username.trim() &&
        user.password === formData.password.trim(),
    );

    if (matchedUser) {
      setIsSuccess(true);

      setTimeout(() => {
        if (matchedUser.role === 1) {
          router.push("/super_admin_dashboard");
        } else {
          router.push("/sub_admin_dashboard");
        }

        setIsSuccess(false);
      }, 1500);
    } else {
      setIsWrong(true);

      setTimeout(() => {
        setIsWrong(false);
      }, 2000);
    }
  };

  /* ----------   LOGIN NOW BUTTON CLICK ---------- */

  const usernameRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = () => {
    usernameRef.current?.focus();
  };

  /* ----------   PASSWORD HIDE TOGGLE---------- */

  const [isShowPass, setIsShowPass] = useState<boolean>(false);

  const handlePass = () => {
    setIsShowPass((prev) => !prev);
  };

  /* ----------   SHOW LOGIN POP UP ---------- */

  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    gsap.fromTo(
      ".popUp",
      {
        opacity: 0,
        y: -20,
        duration: 300,
      },
      {
        opacity: 1,
        y: 0,
      },
    );
  }, [isWrong, isSuccess]);

  return (
    <div className="bg-light-blue dark:bg-background flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-300">
      {/* ---------- BLUR EFFECT ---------- */}

      <div className="bg-dark-blue absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute bottom-10 left-40 h-16 w-16 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute top-20 left-1/2 h-36 w-36 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute top-0 -right-20 h-40 w-40 -translate-1/2 rounded-full blur-md"></div>
      <div className="bg-dark-blue 0 absolute right-10 -bottom-5 h-32 w-32 -translate-1/2 rounded-full blur-md"></div>

      <div className="flex items-center gap-20">
        {/* ----------  LEFT SIDE HERO CONTAINER ----------  */}

        <div className="z-20 flex max-w-[600px] flex-col gap-7 pt-10 pl-20">
          <h1 className="text-[42px] font-black">DisasterReady</h1>
          <p>
            Keep Los Baños safe by marking danger zones, updating safe routes,
            and managing evacuation centers. Respond to reports from residents
            and make sure help reaches them fast. Track relief goods and
            donations to send them where they're needed. Stay ready for
            disasters like typhoons, floods, landslides, volcanic eruptions, and
            earthquakes. Your quick actions can protect the community.
          </p>

          <div className="flex items-center gap-5">
            <button
              className="bg-itim text text-light dark:text-itim dark:bg-puti w-max cursor-pointer rounded-md border px-8 py-3 text-sm font-medium hover:opacity-90"
              onClick={handleFocus}
            >
              Login Now
            </button>

            {/* ----------  TOGGLE BUTTON NG DARKMODE ----------  */}

            <div>
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* ---------- RIGHT CONTAINER  ---------- */}

        <div className="flex items-center justify-center rounded-l-4xl rounded-r-2xl border bg-black/10 px-10 py-16 shadow-2xl backdrop-blur-xl dark:bg-white/10">
          {/* LOGIN FORM CONTAINER */}

          <div className="ml-5 h-5/6 w-3/4">
            <div className="text-center">
              <h2 className="text-xl font-bold">Administrator Access</h2>
              <p className="mt-7 text-sm">
                Access is restricted to authorized administrators only.
              </p>
            </div>

            {/* ----------  LOGIN FORM ----------  */}

            <form
              action=""
              className="mt-12 flex flex-col items-center gap-5"
              onSubmit={handleLogin}
            >
              <div className="relative h-12 w-full">
                <FaUserTie className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  className="text-itim dark:text-puti placeholder:text-gray border-b-itim h-full w-full border-b pl-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                  placeholder="Username"
                  onChange={handleChangeValue}
                  autoComplete="off"
                  ref={usernameRef}
                />
              </div>

              <div className="relative h-12 w-full">
                <FaKey className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                <input
                  type={`${isShowPass ? "text" : "password"}`}
                  className="text-itim dark:text-puti placeholder:text-gray border-b-itim h-full w-full border-b px-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChangeValue}
                  autoComplete="off"
                />

                {isShowPass ? (
                  <IoMdEye
                    className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 text-xl"
                    onClick={handlePass}
                  />
                ) : (
                  <IoMdEyeOff
                    className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 text-xl"
                    onClick={handlePass}
                  />
                )}
              </div>

              <input
                type="submit"
                value="Login"
                className="bg-itim dark:bg-puti dark:text-itim text-light mt-3 h-12 w-full cursor-pointer rounded-sm text-sm shadow-sm transition-all duration-300 hover:opacity-90"
              />

              <button
                type="button"
                className="text-itim dark:text-puti w-full cursor-pointer text-end text-xs hover:opacity-80"
              >
                Forgot Password?
              </button>
            </form>

            {/* ---------------- POP UP SHOW ----------------  */}

            {isWrong && (
              <div className="popUp absolute -top-12 left-1/2 -translate-x-1/2">
                <WrongPassword />
              </div>
            )}

            {isSuccess && (
              <div className="popUp absolute -top-12 left-1/2 -translate-x-1/2">
                <SuccessLogin />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
