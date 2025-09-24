"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loading";

export default function SuperUpdateNewsPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("sub-update-news/weather-advisory");
  }, []);

  return (
    <div className="relative flex h-[87vh] items-center justify-center">
      <Loader />
    </div>
  );
}
