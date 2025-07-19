"use client";

import { Card } from "./ui/card";
import { useRouter } from "next/navigation";

export default function NoIdFound({ message }: { message: string }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="p-10 text-center">
        <h2 className="font-semibold text-red-500">
          We couldn’t find that {message} It might not exist.
        </h2>
        <button
          className="bg-dark-blue mt-5 rounded px-4 py-2 text-white hover:opacity-80"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </Card>
    </div>
  );
}
