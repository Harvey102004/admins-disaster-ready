"use client";

import { useEffect } from "react";

function FaviconUpdater() {
  useEffect(() => {
    const updateFavicon = () => {
      const storedUser = localStorage.getItem("user");
      let faviconUrl = "/logos/no-logo.png";

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const barangay = user.barangay?.toLowerCase();
          if (barangay) faviconUrl = `/logos/${barangay}-logo.png`;
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      }

      let link: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");

      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }

      link.href = faviconUrl;
    };

    updateFavicon();

    const observer = new MutationObserver(updateFavicon);
    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

export default FaviconUpdater;
