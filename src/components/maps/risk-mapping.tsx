"use client";

import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L, { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

function MapInit({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  mapRef.current = map;
  return null;
}

const iconMap: Record<string, string> = {
  Hospital: "/icons/hospital.png",
  Pharmacy: "/icons/pharmacy.png",
  Flood: "/icons/flood.png",
  "Earthquake Damage": "/icons/earthquake.png",
  "Road Block": "/icons/roadblock.png",
  "Fallen Tree": "/icons/tree.png",
};

const createIcon = (url: string) =>
  L.icon({
    iconUrl: url,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

const markerTypes = Object.keys(iconMap);

// Los Baños bounds
const losBanosCenter: [number, number] = [14.1704, 121.2436];
const losBanosBounds = L.latLngBounds(
  [14.137, 121.198], // Southwest
  [14.197, 121.271], // Northeast
);

export default function RiskMapClient() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [description, setDescription] = useState("");

  const popupRef = useRef<L.Popup>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (selectedType) {
      setMarker(e.latlng);
      setTimeout(() => {
        if (popupRef.current && mapRef.current) {
          popupRef.current.openOn(mapRef.current);
        }
      }, 0);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleSave = () => {
    console.log("Saved marker:", {
      type: selectedType,
      location: marker,
      description,
    });

    setMarker(null);
    setSelectedType(null);
    setDescription("");
  };

  return (
    <div className="relative h-full w-full">
      {/* Marker selection buttons */}
      <div className="absolute top-4 left-1/2 z-[1000] flex -translate-x-1/2 gap-2 rounded-md bg-white/90 p-2 shadow-md">
        {markerTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded px-3 py-1 text-sm font-medium ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapContainer
        center={losBanosCenter}
        zoom={14}
        className="z-0 h-full w-full"
        maxBounds={losBanosBounds}
        maxBoundsViscosity={1.0}
      >
        <MapInit mapRef={mapRef} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />

        {marker && selectedType && (
          <Marker
            position={marker}
            draggable={true}
            icon={createIcon(iconMap[selectedType])}
            eventHandlers={{
              dragend: (e) => {
                const newPos = e.target.getLatLng();
                setMarker({ lat: newPos.lat, lng: newPos.lng });

                // Re-open popup after drag
                setTimeout(() => {
                  if (popupRef.current && mapRef.current) {
                    popupRef.current.openOn(mapRef.current);
                  }
                }, 0);
              },
            }}
          >
            <Popup ref={popupRef}>
              <div className="space-y-2">
                <textarea
                  rows={2}
                  className="w-full rounded border p-1 text-sm"
                  placeholder="Optional description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  className="w-full rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
