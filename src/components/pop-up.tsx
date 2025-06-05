import { RiErrorWarningFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";

// ---------- POP UP WRONG PASSWORD ------------- //

export function WrongPassword() {
  return (
    <div className="flex h-16 items-center justify-center gap-2 rounded-md border border-red-500 bg-red-500/10 px-10 py-2">
      <RiErrorWarningFill className="text-2xl text-red-600" />
      <p className="text-sm text-nowrap">Invalid username or password.</p>
    </div>
  );
}

// ---------- POP UP WRONG PASSWORD ------------- //

export function SuccessLogin() {
  return (
    <div className="flex h-16 items-center justify-center gap-2 rounded-md border border-green-500 bg-green-500/10 px-10 py-2">
      <FaCircleCheck className="text-2xl text-green-600" />
      <p className="text-sm text-nowrap">Successfully Login</p>
    </div>
  );
}
