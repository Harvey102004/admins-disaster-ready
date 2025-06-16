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

// ---------- POP UP SUCCESS LOGIN  ------------- //

export function SuccessLogin() {
  return (
    <div className="flex h-16 items-center justify-center gap-2 rounded-md border border-green-500 bg-green-500/10 px-10 py-2">
      <FaCircleCheck className="text-xl text-green-600" />
      <p className="text-sm text-nowrap">Successfully Login</p>
    </div>
  );
}

// ---------- POP UP SUCCESS POST  ------------- //

export function SuccessPost({ advisory }: { advisory: string }) {
  return (
    <div className="flex h-16 items-center justify-center gap-2 rounded-md border border-green-500 bg-green-500/70 px-10 py-2 backdrop-blur-sm dark:bg-green-800/70">
      <FaCircleCheck className="text-xl dark:text-green-300" />
      <p className="text-sm text-nowrap">
        Success! {advisory} has been posted.
      </p>
    </div>
  );
}

// ---------- POP UP COMPLETE FORM ------------- //

export function CompleteFormAlert() {
  return (
    <div className="text-puti flex h-16 items-center justify-center gap-2 rounded-md border border-red-500 bg-red-600 px-10 py-2 dark:bg-red-800/70">
      <RiErrorWarningFill className="text-2xl" />
      <p className="text-sm text-nowrap">
        Please make sure all fields are filled out before submitting.
      </p>
    </div>
  );
}
