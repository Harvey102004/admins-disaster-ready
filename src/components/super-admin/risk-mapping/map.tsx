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

import { Poppins } from "next/font/google";

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
  EarthquakeDamage: "/icons/earthquake.png",
};

const HazardSelector = ({
  onSelect,
  selectedType,
}: {
  onSelect: (type: string | null) => void;
  selectedType: string | null;
}) => {
  const types = [
    "Flood",
    "Landslide",
    "FallenTree",
    "RoadBlockage",
    "Hospital",
    "Pharmacy",
    "EarthquakeDamage",
  ];

  return (
    <div className="flex gap-2 p-4">
      {types.map((type) => {
        const isActive = selectedType === type;
        return (
          <button
            key={type}
            className={`rounded-full px-6 py-3 text-xs text-nowrap text-white transition ${
              isActive
                ? "bg-red-500 hover:bg-red-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => onSelect(isActive ? null : type)}
          >
            {isActive ? "Cancel" : type.replace(/([A-Z])/g, " $1").trim()}
          </button>
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
        <span class="text-[10px] text-nowrap ${poppins.className} text-gray-700 text-center font-bold  rounded px-1 mt-1">
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

export default function HazardMap() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [markers, setMarkers] = useState<
    { type: string; lat: number; lng: number; address: string }[]
  >([]);

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

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-1/2 z-[40] flex -translate-x-1/2 flex-wrap gap-2 rounded-full bg-black/20 shadow-md backdrop-blur-xs dark:bg-white/20">
        <HazardSelector
          onSelect={setSelectedType}
          selectedType={selectedType}
        />
      </div>

      <MapContainer
        center={[14.17, 121.2436]}
        zoom={13}
        minZoom={14}
        maxZoom={18}
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
