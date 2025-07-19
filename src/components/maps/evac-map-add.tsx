"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRef, useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
};

const customMarkerIcon = new L.Icon({
  iconUrl: "/icons/gps.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function EvacuationMap({ lat, lng, onChange }: Props) {
  const markerRef = useRef<L.Marker>(null);
  const [popupText, setPopupText] = useState(
    "📍 Drag me to evacuation center location",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (markerRef.current) {
        markerRef.current.openPopup();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      let displayName = data.display_name || "Unknown location";

      // Remove unwanted parts
      displayName = displayName
        .replace(/,\s*(Laguna|Calabarzon|Philippines)/gi, "")
        .replace(/\s*,\s*,/g, ",")
        .replace(/,\s*$/, "")
        .trim();

      setPopupText(displayName);
    } catch {
      setPopupText("📍 Failed to fetch location");
    }
  };

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      minZoom={13}
      maxZoom={18}
      scrollWheelZoom={true}
      className="z-10 h-full w-full"
      maxBounds={[
        [14.12, 121.2],
        [14.22, 121.28],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable
        icon={customMarkerIcon}
        position={[lat, lng]}
        ref={markerRef}
        eventHandlers={{
          dragend: async (e) => {
            const { lat, lng } = e.target.getLatLng();
            onChange({ lat, lng });
            await reverseGeocode(lat, lng);
            markerRef.current?.openPopup();
          },
        }}
      >
        <Popup autoPan={false}>{popupText}</Popup>
      </Marker>
    </MapContainer>
  );
}
