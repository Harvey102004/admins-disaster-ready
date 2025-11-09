import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-neutral-900">
      <ResetPasswordForm />
    </div>
  );
}

// No need for "use client" here
// No need for dynamic, because the Client Component handles CSR
