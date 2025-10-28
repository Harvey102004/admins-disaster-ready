"use client";

import dynamic from "next/dynamic";
import { Dispatch, SetStateAction } from "react";
import "leaflet/dist/leaflet.css";

// ✅ Dynamic imports (client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  position: [number, number] | null;
}

export default function MapModal({ open, onClose, position }: MapModalProps) {
  if (!open || !position) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="relative w-[90%] max-w-3xl rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-900">
        <button
          onClick={onClose}
          className="pointer-events-auto absolute top-3 right-4 z-[10000] text-2xl font-bold text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h2 className="mb-3 text-lg font-semibold">Incident Location</h2>
        <div className="h-[400px] w-full overflow-hidden rounded-md">
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={true}
            zoomControl={false}
            className="pointer-events-auto z-10 h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            <Marker position={position}>
              <Popup>
                Incident location: <br /> {position[0].toFixed(5)},{" "}
                {position[1].toFixed(5)}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
