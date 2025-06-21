"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GetEvacuationProps } from "../../../types";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// fix leaflet icon default bug
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

type EvacuationMapListProps = {
  evacCenters: GetEvacuationProps[];
};

const EvacuationMapList = ({ evacCenters }: EvacuationMapListProps) => {
  const customMarkerIcon = new L.Icon({
    iconUrl: "/icons/gps.png",
    iconSize: [60, 60],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  return (
    <MapContainer
      center={[14.17, 121.2436]}
      zoom={13}
      minZoom={13}
      maxZoom={18}
      zoomSnap={1}
      zoomDelta={1}
      dragging={true}
      className="z-10 h-[85%] w-[75%] rounded-sm"
      maxBounds={[
        [14.135, 121.185],
        [14.23, 121.295],
      ]}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {evacCenters.map((evac) => (
        <Marker
          key={evac.id}
          position={[Number(evac.lat), Number(evac.long)]}
          icon={customMarkerIcon}
        >
          <Popup>
            <div className={`pr-2 ${poppins.className}`}>
              <h3 className="max-w-[200px] text-sm font-bold">{evac.name}</h3>
              <p className="text-[10px]">{evac.location}</p>
              <p className="text-xs">
                Capacity :{" "}
                <span className="ml-2 font-bold">{evac.capacity}</span>
              </p>
              <p className="text-xs">
                Evacuees :{" "}
                <span className="ml-2 font-bold">{evac.current_evacuees}</span>
              </p>
              <p className="text-xs">
                Vacancy :{" "}
                <span className="ml-2 font-bold">
                  {Number(evac.capacity) - Number(evac.current_evacuees)}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EvacuationMapList;
