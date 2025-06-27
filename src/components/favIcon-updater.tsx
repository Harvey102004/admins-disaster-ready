"use client";

import { useEffect } from "react";

function FaviconUpdater() {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const barangay = user.barangay?.toLowerCase();
        if (barangay) {
          const faviconUrl = `/logos/${barangay}-logo.png`;
          const link = document.querySelector(
            "link[rel~='icon']",
          ) as HTMLLinkElement;
          if (link) {
            link.href = faviconUrl;
          } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = faviconUrl;
            document.head.appendChild(newLink);
          }
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  return null;
}

export default FaviconUpdater;
