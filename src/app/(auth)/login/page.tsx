"use client";

import { ModeToggleLogin } from "@/components/darkmode-toggle";
import { FaUserTie, FaKey } from "react-icons/fa6";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { WrongPassword, SuccessLogin } from "@/components/pop-up";
import gsap from "gsap";
import Loader from "@/components/loading";

export default function Login() {
  /* ----------   FETCH USER DATA ---------- */

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    try {
      setIsLoading(true);

      axios
        .post("http://localhost:3001/public/login.php", {
          username: formData.username,
          password: formData.password,
        })
        .then((response) => {
          if (response.data.success) {
            const account = response.data.user;

            const { username, password, id, role, ...safeAccount } = account;

            localStorage.setItem("user", JSON.stringify(safeAccount));

            setIsSuccess(true);

            setTimeout(() => {
              const role = response.data.user.role;
              if (role === 1) {
                router.push("/super-dashboard");
              } else {
                router.push("/sub-dashboard");
              }
              setIsSuccess(false);
            }, 1500);
          } else {
            setIsWrong(true);
            setTimeout(() => {
              setIsWrong(false);
            }, 2000);
          }
        });
    } catch (error) {
      console.error("Login error:", error);
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
      }, 2000);
    } finally {
      setIsLoading(false);
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
              <ModeToggleLogin />
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-itim dark:bg-puti ${isLoading ? "cursor-not-allowed opacity-75" : "cursor-pointer hover:opacity-90"} dark:text-itim text-light mt-3 h-12 w-full rounded-sm text-sm shadow-sm`}
              >
                {isLoading ? (
                  <>
                    <Loader /> <span>Logging in...</span>
                  </>
                ) : (
                  "Login"
                )}
              </button>

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
