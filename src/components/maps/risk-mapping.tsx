"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { Poppins } from "next/font/google";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuFilter } from "react-icons/lu";

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
                className={`flex items-center justify-center rounded-full bg-white text-xs text-nowrap text-white transition ${classname} ${
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
        <span class="text-[10px] text-nowrap ${poppins.className} text-gray-700 text-center font-bold  rounded px-1 ">
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
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
  );
  const data = await response.json();
  const fullAddress = data.display_name || "Unknown location";
  const shortAddress = fullAddress
    .replace(/,\s*(Laguna|Calabarzon|Philippines)/g, "")
    .trim();
  return shortAddress.trim();
};

export default function RiskMappingMap() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [markers, setMarkers] = useState<
    { type: string; lat: number; lng: number; address: string }[]
  >([]);

  const [isIconsOpen, setIsIconsOpen] = useState(false);

  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    if (!selectedType) return;

    const address = await reverseGeocode(latlng.lat, latlng.lng);

    const newMarker = {
      type: selectedType,
      lat: latlng.lat,
      lng: latlng.lng,
      address,
    };

    setMarkers((prev) => [...prev, newMarker]);

    fetch("/api/markers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMarker),
    });

    setSelectedType(null);
  };

  const handleDelete = (index: number) => {
    const markerToDelete = markers[index];
    setMarkers((prev) => prev.filter((_, i) => i !== index));

    fetch("/api/markers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(markerToDelete),
    });
  };

  const types = [
    { type: "Flood", icon: "/icons/flood.png" },
    { type: "Landslide", icon: "/icons/landslide.png" },
    { type: "FallenTree", icon: "/icons/tree.png" },
    { type: "RoadBlockage", icon: "/icons/road-blockage.png" },
    { type: "Hospital", icon: "/icons/hospital.png" },
    { type: "Pharmacy", icon: "/icons/pharmacy.png" },
  ];

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-6 left-1/2 z-50 flex h-max -translate-x-1/2 items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700">
          <LuFilter />
          Filter
        </div>
        {types.map((type) => (
          <button
            key={type.type}
            className="flex w-max items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-700 transition-opacity duration-300 hover:opacity-75"
          >
            <Image
              src={type.icon}
              height={15}
              width={15}
              alt={type.type}
            ></Image>
            {type.type}
          </button>
        ))}
      </div>

      <div
        className={`${isIconsOpen ? "w-8" : "px-5 py-7"} absolute top-1/2 right-0 z-[40] flex h-[420px] -translate-y-1/2 items-center rounded-l-3xl bg-black/20 backdrop-blur-[1px] transition-all duration-300 ease-in-out`}
      >
        <div
          onClick={() => setIsIconsOpen((prev) => !prev)}
          className="absolute top-1/2 -left-1 -translate-1/2 rounded-full border border-black/30 bg-white p-2 text-xs text-gray-500 shadow-2xl"
        >
          {isIconsOpen ? <FaArrowLeftLong /> : <FaArrowRightLong />}
        </div>
        <HazardSelector
          onSelect={setSelectedType}
          selectedType={selectedType}
          classname={`${isIconsOpen ? "hidden" : ""}`}
        />
      </div>

      <MapContainer
        center={[14.17, 121.2436]}
        zoom={13}
        minZoom={14}
        maxZoom={18}
        zoomControl={false}
        zoomSnap={1}
        zoomDelta={1}
        dragging={true}
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

        {markers.map((m, idx) => (
          <Marker key={idx} position={[m.lat, m.lng]} icon={getIcon(m.type)}>
            <Popup>
              <div className={`flex flex-col p-3 ${poppins.className}`}>
                <p className="!m-0 text-center text-sm font-semibold">
                  {m.type.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-xs text-gray-600">{m.address}</p>
                <button
                  onClick={() => handleDelete(idx)}
                  className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
