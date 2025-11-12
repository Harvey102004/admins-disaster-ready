"use client";

import { ModeToggleLogin } from "@/components/darkmode-toggle";
import { FaUserTie, FaKey } from "react-icons/fa6";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

function successToast(
  message: string,
  description?: string | ReactNode,
  onConfirm?: () => void,
) {
  toast.success(message, {
    description: description && (
      <p className="overflow-hidden text-sm break-words whitespace-normal text-green-900">
        {description}
      </p>
    ),
    duration: Infinity,
    className:
      "!max-w-[550px] !gap-3 whitespace-normal !overflow-hidden " +
      "bg-green-100 text-green-900 border border-green-300 shadow-md " +
      "rounded-lg py-3 px-4 flex items-start",
    icon: (
      <CheckCircle2 className="h-6 w-6 shrink-0 fill-green-700 text-white" />
    ),
    classNames: {
      title: "!font-semibold !text-green-900 text-sm",
    },
    action: (
      <button
        onClick={() => {
          onConfirm?.();
          toast.dismiss();
        }}
        className="ml-3 shrink-0 rounded-full bg-green-700 p-2 px-3 text-[10px] font-medium text-white hover:bg-green-800"
      >
        OK
      </button>
    ),
  });
}

export default function Login() {
  /* ---------- STATES ---------- */
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [IsLoginForm, setIsLoginForm] = useState(true);

  const [verifyMessage, setVerifyMessage] = useState("");
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const [isShowPass, setIsShowPass] = useState({
    loginPass: false,
    createPass: false,
    confirmPass: false,
  });

  const allBrgy = [
    { name: "Anos", value: "anos" },
    { name: "Bagong Silang", value: "bagong-silang" },
    { name: "Bambang", value: "bambang" },
    { name: "Batong Malake", value: "batong-malake" },
    { name: "Baybayin", value: "baybayin" },
    { name: "Bayog", value: "bayog" },
    { name: "Lalakay", value: "lalakay" },
    { name: "Maahas", value: "maahas" },
    { name: "Malinta", value: "malinta" },
    { name: "Mayondon", value: "mayondon" },
    { name: "Putho-Tuntungin", value: "putho-tuntungin" },
    { name: "San Antonio", value: "san-antonio" },
    { name: "Tadlac", value: "tadlac" },
    { name: "Timugan", value: "timugan" },
  ];

  /* ---------- ROUTER ---------- */
  const router = useRouter();

  /* ---------- HANDLE INPUT ---------- */
  const handleChangeValue = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setCreateData((prev) => ({ ...prev, [name]: value }));
  };

  const [createData, setCreateData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    barangay: "",
    captcha: "",
  });

  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [loginMessage, setLoginMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

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
      toast.success(loginMessage, { duration: 1500 });
    }
  }, [loginMessage]);

  /* ---------- LOGIN ---------- */

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
          router.push(role === 1 ? "/super-dashboard" : "/sub-dashboard");
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

  /* ---------- REGISTER ---------- */
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setServerMessage("");

    try {
      const token = await recaptchaRef.current?.executeAsync();

      if (!token) {
        setServerMessage("Captcha verification failed. Please try again.");
        setIsLoading(false);
        return;
      }
      const res = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/accountRequest.php",
        {
          username: createData.username,
          email: createData.email,
          password: createData.password,
          confirm_password: createData.confirm_password,
          barangay: createData.barangay,
          captcha: token,
        },
        { withCredentials: true },
      );

      if (res.data.success) {
        toast.success("Verification code sent!", {
          description: "Open your email and enter the code to continue.",
          duration: 5000,
        });

        setShowVerification(true);
      } else {
        setServerMessage(
          res.data.message || "Registration failed. Please check your inputs.",
        );
      }
    } catch (err: any) {
      console.error(" Registration error:", err);
      if (err.response?.data?.message) {
        setServerMessage(` ${err.response.data.message}`);
      } else {
        setServerMessage(" Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
      recaptchaRef.current?.reset();
      setCreateData((prev) => ({ ...prev, captcha: "" }));
    }
  };

  /* ---------- VERIFICATION ---------- */
  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked) return;

    setIsVerifying(true);
    setVerifyMessage("");

    try {
      const response = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/accountVerification.php",
        {
          email: createData.email,
          code: verificationCode,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.success) {
        successToast("Verification Successful ", data.message, () => {
          setShowVerification(false);
          setIsLoginForm(true);
        });
        setTimeout(() => {
          setShowVerification(false);
          setIsLoginForm(true);
          setCreateData({
            username: "",
            email: "",
            password: "",
            confirm_password: "",
            barangay: "",
            captcha: "",
          });
          setServerMessage("");
          setVerificationCode("");
        }, 1500);
      } else {
        setVerifyMessage(data.message || "Incorrect verification code.");

        if (data.message && data.message.toLowerCase().includes("4 attempts")) {
          setIsLocked(true);
        }
      }
    } catch (error) {
      setVerifyMessage("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  /* ---------- FORGOT PASSWORD ---------- */
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setForgotMessage("");
    setIsError(false);

    try {
      const res = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/forgotPass.php",
        { email: forgotEmail },
        { withCredentials: true },
      );

      console.log("📥 Backend response:", res.data);

      if (res.data.success) {
        console.log("✅ Email found, reset link sent.");
        setForgotMessage(
          res.data.message || "✅ Reset link successfully sent to your email.",
        );
        setIsError(false);
        setForgotEmail("");

        setTimeout(() => {
          setShowForgot(false);
          setForgotMessage("");
        }, 2500);
      } else {
        console.log("⚠️ Backend returned error:", res.data.message);
        setForgotMessage(res.data.message || " Failed to send reset link.");
        setIsError(true);
      }
    } catch (err: any) {
      console.error(" Network/server error:", err);
      setForgotMessage(
        err.response?.data?.message ||
          " Something went wrong. Please try again later.",
      );
      setIsError(true);
    } finally {
      setIsSending(false);
    }
  };

  /* ---------- FOCUS INPUT ---------- */
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const handleFocus = () => usernameRef.current?.focus();

  /* ---------- UI ---------- */
  return (
    <div className="bg-light-blue dark:bg-background fixed inset-0 flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-300">
      {/* ---------- BLUR BACKGROUND ---------- */}

      <div className="bg-dark-blue absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute bottom-10 left-40 h-16 w-16 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute top-20 left-1/2 h-36 w-36 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute top-0 -right-20 h-40 w-40 rounded-full blur-md"></div>
      <div className="bg-dark-blue absolute right-10 -bottom-5 h-32 w-32 rounded-full blur-md"></div>

      <div className="flex items-center gap-20">
        {/* ---------- LEFT SIDE ---------- */}
        <div className="z-20 flex max-w-[600px] flex-col gap-7 pt-10 pl-20">
          <h1 className="text-[42px] font-black">DisasterReady</h1>
          <p>
            Keep Los Baños safe by marking danger zones, updating safe routes,
            and managing evacuation centers. Respond to reports from residents
            and make sure help reaches them fast.
          </p>

          <div className="flex items-center gap-5">
            <button
              className="bg-itim text text-light dark:text-itim dark:bg-puti w-max cursor-pointer rounded-md border px-8 py-3 text-sm font-medium hover:opacity-90"
              onClick={() => {
                setIsLoginForm(true), handleFocus;
              }}
            >
              Login Now
            </button>
            <ModeToggleLogin />
          </div>
        </div>

        {/* ---------- RIGHT SIDE (LOGIN FORM) ---------- */}
        <div className="flex w-[500px] items-center justify-center rounded-l-4xl rounded-r-2xl border bg-black/10 px-10 py-8 shadow-2xl backdrop-blur-xl dark:bg-white/10">
          {IsLoginForm ? (
            <div className="ml-5 h-5/6 w-3/4">
              <div className="text-center">
                <h2 className="text-xl font-bold">Administrator Access</h2>
                <p className="mt-7 text-sm">
                  Access is restricted to authorized administrators only.
                </p>
              </div>

              {/* ---------- LOGIN FORM ---------- */}
              <form
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
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b pl-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Username"
                    onChange={handleChangeValue}
                    autoComplete="off"
                    ref={usernameRef}
                  />
                </div>

                <div className="relative h-12 w-full">
                  <FaKey className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                  <input
                    type={isShowPass.loginPass ? "text" : "password"}
                    name="password"
                    disabled={isLoading}
                    value={formData.password}
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b px-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Password"
                    onChange={handleChangeValue}
                    autoComplete="off"
                  />

                  {isShowPass.loginPass ? (
                    <IoMdEye
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
                      onClick={() =>
                        setIsShowPass((prev) => ({
                          ...prev,
                          loginPass: !prev.loginPass,
                        }))
                      }
                    />
                  ) : (
                    <IoMdEyeOff
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
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
                  className={`mx-auto mt-3 w-full rounded p-3 text-sm transition ${
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
                  <p className="text-center text-xs text-red-500">
                    {loginMessage}
                  </p>
                )}

                {cooldown > 0 && (
                  <p className="mt-2 text-center text-xs text-red-500">
                    Please wait {cooldown}s before trying again.
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <p>Don't have an account?</p>
                  <p
                    className="text-dark-blue cursor-pointer underline underline-offset-4"
                    onClick={() => setIsLoginForm(false)}
                  >
                    Request account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-itim dark:text-puti w-full cursor-pointer text-center text-xs hover:opacity-80"
                >
                  Forgot Password?
                </button>
              </form>
            </div>
          ) : (
            <div className="ml-5 h-5/6 w-[90%]">
              <div className="text-center">
                <h2 className="text-xl font-bold"> Request Account</h2>
                <p className="mt-3 text-sm">
                  Fill out the form below to request your account access.
                </p>
              </div>

              {/* ---------- CREATE ACCOUNT FORM ---------- */}
              <form
                className="mt-5 flex flex-col items-center gap-5"
                onSubmit={handleCreateAccount}
              >
                {/* Username */}
                <div className="relative h-12 w-full">
                  <FaUserTie className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                  <input
                    type="text"
                    name="username"
                    value={createData.username}
                    disabled={isLoading}
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b pl-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Username"
                    onChange={handleChangeValue}
                    autoComplete="off"
                  />
                </div>

                {/* Email */}
                <div className="relative h-12 w-full">
                  <MdEmail className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                  <input
                    type="email"
                    name="email"
                    value={createData.email}
                    disabled={isLoading}
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b pl-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Email address"
                    onChange={handleChangeValue}
                    autoComplete="off"
                  />
                </div>

                {/* Password */}
                <div className="relative h-12 w-full">
                  <FaKey className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                  <input
                    type={isShowPass.createPass ? "text" : "password"}
                    name="password"
                    value={createData.password}
                    disabled={isLoading}
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b px-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Password"
                    onChange={handleChangeValue}
                    autoComplete="off"
                  />
                  {isShowPass.createPass ? (
                    <IoMdEye
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
                      onClick={() =>
                        setIsShowPass((prev) => ({
                          ...prev,
                          createPass: !prev.createPass,
                        }))
                      }
                    />
                  ) : (
                    <IoMdEyeOff
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
                      onClick={() =>
                        setIsShowPass((prev) => ({
                          ...prev,
                          createPass: !prev.createPass,
                        }))
                      }
                    />
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative h-12 w-full">
                  <FaKey className="text-itim dark:text-puti absolute top-1/2 -translate-y-1/2 text-xl" />
                  <input
                    type={isShowPass.confirmPass ? "text" : "password"}
                    name="confirm_password"
                    disabled={isLoading}
                    value={createData.confirm_password}
                    className="text-itim dark:text-puti border-b-itim h-full w-full border-b px-10 text-sm outline-none placeholder:text-xs dark:border-b-neutral-300"
                    placeholder="Confirm password"
                    onChange={handleChangeValue}
                    autoComplete="off"
                  />
                  {isShowPass.confirmPass ? (
                    <IoMdEye
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
                      onClick={() =>
                        setIsShowPass((prev) => ({
                          ...prev,
                          confirmPass: !prev.confirmPass,
                        }))
                      }
                    />
                  ) : (
                    <IoMdEyeOff
                      className="text-itim dark:text-puti absolute top-1/2 right-0 h-6 w-6 -translate-y-1/2 cursor-pointer text-xl"
                      onClick={() =>
                        setIsShowPass((prev) => ({
                          ...prev,
                          confirmPass: !prev.confirmPass,
                        }))
                      }
                    />
                  )}
                </div>

                {/* Barangay */}
                <div className="relative flex h-12 w-full">
                  <GoHomeFill className="text-itim dark:text-puti absolute top-2 text-xl" />

                  <Select
                    disabled={isLoading}
                    value={createData.barangay}
                    onValueChange={(value) =>
                      handleChangeValue({ target: { name: "barangay", value } })
                    }
                  >
                    <SelectTrigger className="text-itim dark:text-puti border-b-itim hover:none h-full w-full rounded-none border-0 border-b bg-transparent pl-10 text-sm shadow-none outline-none focus:ring-0 dark:border-b-neutral-300 dark:bg-transparent">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>

                    <SelectContent>
                      {allBrgy.map((brgy) => (
                        <SelectItem key={brgy.value} value={brgy.value}>
                          {brgy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="absolute h-0">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    size="invisible"
                    ref={recaptchaRef}
                    onChange={(token) =>
                      setCreateData((prev) => ({
                        ...prev,
                        captcha: token || "",
                      }))
                    }
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`bg-itim dark:bg-puti ${
                    isLoading
                      ? "cursor-not-allowed opacity-75"
                      : "cursor-pointer hover:opacity-90"
                  } dark:text-itim text-light mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-sm text-sm shadow-sm`}
                >
                  {isLoading ? "Requesting account..." : "Request Account"}
                </button>

                {serverMessage && (
                  <p
                    className={`text-center text-xs ${
                      serverMessage.includes("✅")
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {serverMessage}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <p>Already have an account?</p>
                  <p
                    className="text-dark-blue cursor-pointer underline underline-offset-4"
                    onClick={() => setIsLoginForm(true)}
                  >
                    Login here
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ---------- FORGOT PASSWORD MODAL ---------- */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[90%] max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-2 right-3 text-lg text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="mb-4 text-center text-lg font-semibold">
              Forgot Password
            </h2>
            <p className="mx-auto mb-4 w-[95%] text-center text-xs leading-normal tracking-wide text-gray-600 dark:text-gray-400">
              A password reset link will be sent to your Gmail. If you don't see
              it in your inbox, please check your spam folder. If you still
              haven’t received anything, try again.
            </p>

            <form
              onSubmit={handleForgotPassword}
              className="mt-5 flex flex-col gap-6"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full rounded border border-gray-300 bg-transparent p-3 text-sm outline-none focus:ring focus:ring-blue-300 dark:border-neutral-700"
              />
              <button
                type="submit"
                disabled={isSending}
                className="rounded bg-blue-600 py-3 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
              >
                {isSending ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {forgotMessage && (
              <p
                className={`mt-4 text-center text-sm ${
                  isError ? "text-red-500" : "text-green-600"
                }`}
              >
                {forgotMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------- VERIFICATION MODAL ---------- */}
      {showVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-[90%] max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
            <button
              onClick={() => setShowVerification(false)}
              className="absolute top-2 right-3 text-lg text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="mb-3 text-center text-lg font-semibold">
              Email Verification
            </h2>
            <p className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the 6-digit code sent to
            </p>

            <p className="mb-5 text-center text-sm text-gray-600 dark:text-gray-400">
              {createData.email}
            </p>

            <form
              onSubmit={handleVerifyCode}
              className="flex flex-col items-center gap-6"
            >
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(val) => {
                  console.log("OTP changed:", val);
                  setVerificationCode(val);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                  <InputOTPSlot
                    index={1}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                  <InputOTPSlot
                    index={2}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot
                    index={3}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                  <InputOTPSlot
                    index={4}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                  <InputOTPSlot
                    index={5}
                    className="text-itim dark:text-puti border-2 border-gray-400 text-center text-lg font-semibold tracking-widest transition-colors duration-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-300 dark:border-neutral-600"
                  />
                </InputOTPGroup>
              </InputOTP>

              {isLocked ? (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="w-full rounded bg-red-600 py-3 text-sm text-white hover:bg-red-700"
                >
                  Retry
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full rounded bg-blue-600 py-3 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {isVerifying ? "Verifying..." : "Verify"}
                </button>
              )}
            </form>

            {verifyMessage && (
              <p
                className={`mt-5 text-center text-sm ${
                  verifyMessage.includes("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {verifyMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
