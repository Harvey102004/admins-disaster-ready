"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { getEvacuationCenters } from "@/server/api/evacuation";
import { EvacuationCenterProps } from "../../../types";
import { IoCloseCircle } from "react-icons/io5";
import { TbMapPinSearch } from "react-icons/tb";
import { LuMapPin } from "react-icons/lu";
import Loader from "../loading";

// Fix leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const iconRed = new L.Icon({
  iconUrl: "/icons/gps.png",
  iconSize: [50, 50],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

function FlyToEvac({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 18);
  return null;
}

export default function EvacuationListView() {
  const markerRefs = useRef<Record<string, L.Marker>>({});
  const router = useRouter();
  const { data = [], isLoading } = useQuery<EvacuationCenterProps[]>({
    queryKey: ["evacuationsCenter"],
    queryFn: getEvacuationCenters,
  });

  const [search, setSearch] = useState("");
  const [selectedEvac, setSelectedEvac] =
    useState<EvacuationCenterProps | null>(null);

  const [filterStates, setFilterStates] = useState({
    plenty: true,
    almost: true,
    full: true,
  });

  const toggleFilter = (status: "plenty" | "almost" | "full") => {
    const isOnlyThisActive =
      filterStates[status] &&
      Object.values(filterStates).filter(Boolean).length === 1;

    if (isOnlyThisActive) {
      setFilterStates({ plenty: true, almost: true, full: true });
    } else {
      setFilterStates({
        plenty: false,
        almost: false,
        full: false,
        [status]: true,
      });
    }
  };
  const filtered = data.filter((evac) =>
    evac.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <IoCloseCircle
        onClick={() => router.back()}
        className="absolute top-2 left-5 z-50 h-16 w-16 rounded-md px-4 text-gray-700 hover:opacity-80"
      />

      <div className="absolute top-3 left-40 z-50 flex gap-2 py-4">
        {(["plenty", "almost", "full"] as const).map((status) => (
          <button
            key={status}
            onClick={() => toggleFilter(status)}
            className={`rounded-full px-6 py-2 text-xs text-white shadow-2xl ${
              status === "plenty"
                ? filterStates.plenty
                  ? "bg-green-500"
                  : "bg-green-300 opacity-50"
                : status === "almost"
                  ? filterStates.almost
                    ? "bg-yellow-500"
                    : "bg-yellow-300 opacity-50"
                  : filterStates.full
                    ? "bg-red-500"
                    : "bg-red-300 opacity-50"
            }`}
          >
            {status === "plenty"
              ? "Plenty of space"
              : status === "almost"
                ? "Almost Full"
                : "Full"}
          </button>
        ))}
      </div>

      <div className="absolute top-5 right-5 z-50 flex w-1/2 flex-col gap-1">
        <div className="relative">
          <TbMapPinSearch className="absolute top-1/2 left-5 z-50 -translate-y-1/2 text-xl text-gray-500" />
          <input
            type="text"
            placeholder="Search evacuation center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border bg-white px-5 py-3 pl-13 text-sm text-black shadow outline-none"
          />
        </div>
        {search && (
          <div className="scrollBar max-h-[500px] overflow-auto rounded-md border bg-white shadow">
            {filtered.length > 0 ? (
              filtered.map((evac) => (
                <button
                  key={evac.id}
                  onClick={() => {
                    setSelectedEvac(evac);
                    setSearch("");

                    setTimeout(() => {
                      const marker = markerRefs.current[String(evac.id)];
                      if (marker) {
                        marker.openPopup();
                      }
                      setSelectedEvac(null);
                    }, 300);
                  }}
                  className="block w-full truncate px-4 py-3 text-left text-sm text-black hover:bg-gray-100"
                >
                  <span className="flex items-center gap-4">
                    <LuMapPin className="text-xl text-gray-600" />
                    <span className="flex flex-col gap-1">
                      <span className="max-w-[450px] truncate">
                        {evac.name}
                      </span>
                      <span className="max-w-[450px] truncate text-[10px] text-gray-500">
                        {evac.location}
                      </span>
                    </span>

                    {(() => {
                      const capacity = Number(evac.capacity);
                      const evacuees = Number(evac.current_evacuees);
                      const vacancy = capacity - evacuees;
                      const vacancyRate = capacity > 0 ? vacancy / capacity : 0;

                      const statusClass =
                        capacity === 0 || vacancy === 0
                          ? "bg-red-500"
                          : vacancyRate < 0.5
                            ? "bg-yellow-500"
                            : "bg-green-500";

                      return (
                        <div
                          className={`ml-auto h-2 w-2 rounded-full ${statusClass}`}
                        />
                      );
                    })()}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-gray-500">
                Evacuation center not found
              </div>
            )}
          </div>
        )}
      </div>

      {!isLoading && (
        <MapContainer
          center={[14.1709, 121.244]}
          zoom={14}
          minZoom={13}
          maxZoom={18}
          zoomSnap={1}
          zoomDelta={1}
          dragging={true}
          zoomControl={false}
          className="z-10 h-full w-full"
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

          {selectedEvac && (
            <FlyToEvac
              center={[Number(selectedEvac.lat), Number(selectedEvac.long)]}
            />
          )}

          {data
            .filter((evac) => {
              const capacity = Number(evac.capacity);
              const evacuees = Number(evac.current_evacuees);
              const vacancy = capacity - evacuees;
              const vacancyRate = capacity > 0 ? vacancy / capacity : 0;

              let status: "full" | "almost" | "plenty";
              if (vacancy === 0) {
                status = "full";
              } else if (vacancyRate < 0.5) {
                status = "almost";
              } else {
                status = "plenty";
              }

              return filterStates[status];
            })
            .map((evac) => {
              const capacity = Number(evac.capacity);
              const evacuees = Number(evac.current_evacuees);

              const icon = iconRed;

              return (
                <Marker
                  key={evac.id}
                  position={[Number(evac.lat), Number(evac.long)]}
                  icon={icon}
                  ref={(ref) => {
                    if (ref) markerRefs.current[String(evac.id)] = ref;
                  }}
                >
                  <Popup>
                    <div className="w-max">
                      <div className="pr-2 text-sm">
                        <div className="my-2 flex items-center gap-2">
                          {(() => {
                            const capacity = Number(evac.capacity);
                            const evacuees = Number(evac.current_evacuees);
                            const vacancy = capacity - evacuees;
                            const vacancyRate =
                              capacity > 0 ? vacancy / capacity : 0;

                            const statusClass =
                              capacity === 0 || vacancy === 0
                                ? "bg-red-500"
                                : vacancyRate < 0.5
                                  ? "bg-yellow-500"
                                  : "bg-green-500";

                            const statusLabel =
                              capacity === 0 || vacancy === 0
                                ? "Full"
                                : vacancyRate < 0.5
                                  ? "Almost Full"
                                  : "Plenty of Space";

                            return (
                              <>
                                <div
                                  className={`h-3 w-3 rounded-full ${statusClass}`}
                                />
                                <span className="text-xs font-semibold">
                                  {statusLabel}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <h3 className="max-w-[250px] font-semibold">
                          {evac.name}
                        </h3>
                        <p className="text-xs">
                          Capacity:{" "}
                          <span className="ml-2 font-bold">
                            {evac.capacity}
                          </span>
                        </p>
                        <p className="text-xs">
                          Evacuees:{" "}
                          <span className="ml-2 font-bold">
                            {evac.current_evacuees}
                          </span>
                        </p>
                        <p className="text-xs">
                          Vacancy:{" "}
                          <span className="ml-2 font-bold">
                            {capacity - evacuees}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      )}
    </>
  );
}
