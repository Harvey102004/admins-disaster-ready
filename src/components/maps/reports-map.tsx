"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MdMyLocation } from "react-icons/md";
import axios from "axios";
import { IoClose } from "react-icons/io5";

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
  const [gpsIcon, setGpsIcon] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Loading...");

  useEffect(() => {
    if (!position) return;

    const icon = L.icon({
      iconUrl: "/icons/gps_red.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    });
    setGpsIcon(icon);

    const fetchLocationName = async () => {
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: "json",
              lat: position[0],
              lon: position[1],
              addressdetails: 1,
            },
          },
        );

        const address = res.data?.address || {};

        const barangay =
          address.quarter ||
          address.suburb ||
          address.village ||
          address.neighbourhood ||
          address.residential ||
          address.city_district ||
          address.hamlet ||
          "";

        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.county ||
          "";

        // ✅ Force Laguna if Los Baños or province returned Laguna
        let province = "";
        if (address.province === "Laguna" || city === "Los Baños") {
          province = "Laguna";
        }

        const formattedLocation = [barangay, city, province]
          .filter(Boolean)
          .join(", ");

        setLocationName(formattedLocation || "Los Baños, Laguna");
      } catch (err) {
        setLocationName("Los Baños, Laguna");
      }
    };

    fetchLocationName();
  }, [position]);

  if (!open || !position) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="relative w-[90%] max-w-4xl rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-900">
        <IoClose
          onClick={onClose}
          className="pointer-events-auto absolute top-3 right-4 z-[10000] text-2xl text-gray-500 hover:text-gray-700"
        />

        <h2 className="mb-5 flex items-center gap-2 text-sm">
          <MdMyLocation />
          Incident Location
        </h2>

        <div className="h-[400px] w-full overflow-hidden rounded-md">
          {gpsIcon && (
            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={true}
              zoomControl={false}
              className="pointer-events-auto z-10 h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} icon={gpsIcon}>
                <Popup>📍 {locationName}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
