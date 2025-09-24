"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuFilter } from "react-icons/lu";
import { showDeleteConfirmation } from "@/lib/toasts";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const iconData: Record<string, string> = {
  Flood: "/icons/flood.png",
  Landslide: "/icons/landslide.png",
  FallenTree: "/icons/tree.png",
  RoadBlockage: "/icons/road-blockage.png",
  Hospital: "/icons/hospital.png",
  Pharmacy: "/icons/pharmacy.png",
};

const HazardSelector = ({
  onSelect,
  selectedType,
  classname,
}: {
  onSelect: (type: string | null) => void;
  selectedType: string | null;
  classname?: string;
}) => {
  const types = [
    { type: "Flood", icon: "/icons/flood.png" },
    { type: "Landslide", icon: "/icons/landslide.png" },
    { type: "FallenTree", icon: "/icons/tree.png" },
    { type: "RoadBlockage", icon: "/icons/road-blockage.png" },
    { type: "Hospital", icon: "/icons/hospital.png" },
    { type: "Pharmacy", icon: "/icons/pharmacy.png" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {types.map((type) => {
        const isActive = selectedType === type.type;
        return (
          <Tooltip key={type.type} delayDuration={150}>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center justify-center rounded-full bg-white text-xs transition ${classname} ${
                  isActive ? "p-3.5" : "p-3 hover:opacity-70"
                }`}
                onClick={() => onSelect(isActive ? null : type.type)}
              >
                {isActive ? (
                  <IoClose className="text-xl text-red-500" />
                ) : (
                  <Image
                    src={type.icon}
                    alt={type.type}
                    height={25}
                    width={25}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="left"
              className="!bg-white text-xs text-gray-700"
            >
              {type.type}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const getIcon = (type: string): L.DivIcon => {
  const iconUrl = iconData[type] || "";
  const label = type.replace(/([A-Z])/g, " $1").trim();

  return L.divIcon({
    html: `
      <div class="flex flex-col items-center">
        <img src="${iconUrl}" class="w-10 h-10" />
        <span class="text-[10px] ${poppins.className} text-gray-700 text-center font-bold rounded px-1">
          ${label}
        </span>
      </div>
    `,
    className: "",
    iconSize: [40, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    );
    const data = await response.json();
    const fullAddress = data.display_name || "Unknown location";
    const shortAddress = fullAddress
      .replace(/,\s*(Laguna|Calabarzon|Philippines)/g, "")
      .trim();
    return shortAddress;
  } catch (err) {
    console.error(err);
    return "Unknown location";
  }
};

export default function RiskMappingMap() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(
    Object.keys(iconData),
  );
  const [markers, setMarkers] = useState<
    {
      id: number;
      type: string;
      lat: number;
      lng: number;
      address: string;
      created_by: number;
    }[]
  >([]);
  const [isIconsOpen, setIsIconsOpen] = useState(false);

  // Fetch markers
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://localhost/Disaster-backend/public/disasterMapping.php",
        );
        if (!res.ok) throw new Error("Failed to fetch markers");

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          const fetchedMarkers = await Promise.all(
            result.data.map(async (m: any) => {
              let address = m.address;
              if (!address) {
                address = await reverseGeocode(Number(m.lat), Number(m.lng));
              }
              return {
                id: Number(m.id),
                type: m.type,
                lat: Number(m.lat),
                lng: Number(m.lng),
                address,
                created_by: Number(m.created_by),
              };
            }),
          );

          setMarkers(fetchedMarkers);
        } else {
          setMarkers([]);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    if (!selectedType) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const createdBy = Number(user.id || 0);
    if (!createdBy) {
      alert("User not found. Please log in.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost/Disaster-backend/public/disasterMapping.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: selectedType,
            lat: latlng.lat,
            lng: latlng.lng,
            created_by: createdBy,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to save marker");
      const savedData = await res.json();

      const address = await reverseGeocode(latlng.lat, latlng.lng);

      setMarkers((prev) => [
        ...prev,
        {
          id: savedData.id,
          type: selectedType,
          lat: latlng.lat,
          lng: latlng.lng,
          address,
          created_by: createdBy,
        },
      ]);

      toast.success(`${selectedType} added successfully`, {
        style: { marginLeft: "160px" },
      });
    } catch (err) {
      console.error(err);
      toast.error("Error saving marker", {
        style: { marginLeft: "160px" },
      });
    }

    setSelectedType(null);
  };

  // Toggle filters
  const handleFilterClick = (type: string) => {
    setActiveFilters((prev) => {
      if (prev.length === Object.keys(iconData).length) {
        // Lahat active, so pag click isa lang matitira
        return [type];
      } else if (prev.includes(type)) {
        // Kung active, i-remove
        const newFilters = prev.filter((t) => t !== type);
        // Pag walang natira, balik lahat
        return newFilters.length > 0 ? newFilters : Object.keys(iconData);
      } else {
        // Kung inactive, i-add sa list
        return [...prev, type];
      }
    });
  };

  // Apply filters
  const filteredMarkers =
    activeFilters.length > 0
      ? markers.filter((m) => activeFilters.includes(m.type))
      : [];

  const types = Object.keys(iconData).map((type) => ({
    type,
    icon: iconData[type],
  }));

  return (
    <div className="relative h-full w-full">
      {/* Filter buttons */}
      <div className="absolute top-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700">
          <LuFilter />
          Filter
        </div>
        {types.map((type) => {
          const isActive = activeFilters.includes(type.type);
          return (
            <button
              key={type.type}
              onClick={() => handleFilterClick(type.type)}
              className={`text-light-black flex items-center gap-2 rounded-full bg-white px-4 py-2 pr-8 text-sm transition hover:opacity-75 ${
                isActive ? "" : "opacity-50"
              }`}
            >
              <Image src={type.icon} height={15} width={15} alt={type.type} />
              {type.type}
            </button>
          );
        })}
      </div>

      {/* Hazard selector */}
      <div
        className={`${
          isIconsOpen ? "w-8" : "px-5 py-7"
        } absolute top-1/2 right-0 z-[40] flex h-[420px] -translate-y-1/2 items-center rounded-l-3xl bg-black/20 backdrop-blur-[1px] transition-all`}
      >
        <div
          onClick={() => setIsIconsOpen((prev) => !prev)}
          className="absolute top-1/2 -left-1 -translate-1/2 cursor-pointer rounded-full border border-black/30 bg-white p-2 text-xs text-gray-500 shadow-2xl"
        >
          {isIconsOpen ? <FaArrowLeftLong /> : <FaArrowRightLong />}
        </div>
        <HazardSelector
          onSelect={setSelectedType}
          selectedType={selectedType}
          classname={`${isIconsOpen ? "hidden" : ""}`}
        />
      </div>

      {/* Map */}
      <MapContainer
        center={[14.17, 121.2436]}
        zoom={13}
        minZoom={14}
        maxZoom={18}
        zoomControl={false}
        zoomSnap={1}
        zoomDelta={1}
        className="z-0 h-full w-full rounded"
        maxBounds={[
          [14.145, 121.215],
          [14.21, 121.275],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapClickHandler onClick={handleMapClick} />

        {filteredMarkers.map((m, index) => {
          const userId = Number(
            JSON.parse(localStorage.getItem("user") || "{}")?.id || 0,
          );
          const canDelete = m.created_by === userId;

          return (
            <Marker
              key={m.id || `temp-${index}`}
              position={[m.lat, m.lng]}
              icon={getIcon(m.type)}
            >
              <Popup>
                <div className={`flex flex-col p-3 ${poppins.className}`}>
                  <p className="text-center text-sm font-semibold">
                    {m.type.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <p className="mt-1 text-center text-xs text-gray-600">
                    {m.address}
                  </p>

                  {canDelete && (
                    <button
                      onClick={() => {
                        showDeleteConfirmation({
                          margins: "160px",
                          onConfirm: async () => {
                            toast.loading("Deleting marker...", {
                              id: "delete-marker",
                              style: { marginLeft: "160px" },
                            });
                            try {
                              const res = await fetch(
                                `http://localhost/Disaster-backend/public/disasterMapping.php?id=${encodeURIComponent(
                                  m.id,
                                )}`,
                                { method: "DELETE" },
                              );

                              const result = await res.json();
                              if (!result.success)
                                throw new Error(
                                  result.message || "Delete failed",
                                );

                              setMarkers((prev) =>
                                prev.filter((marker) => marker.id !== m.id),
                              );

                              toast.success(" Successfully deleted", {
                                id: "delete-marker",
                                style: { marginLeft: "160px" },
                              });
                            } catch (err) {
                              console.error(err);
                              toast.error(
                                "Error deleting marker, Try refreshing the page.",
                                {
                                  id: "delete-marker",
                                },
                              );
                            }
                          },
                          onClose: () =>
                            console.log("Delete confirmation closed"),
                        });
                      }}
                      className="mt-2 rounded bg-red-600 p-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
