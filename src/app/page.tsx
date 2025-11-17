"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent || navigator.vendor || "";
      const isMobile = /Mobi|Android/i.test(ua);

      if (isMobile) {
        router.push("/mobile-login");
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  return null;
}
