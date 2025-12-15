"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

interface DirectionsMapProps {
  responder: { lat: number; lng: number };
  reporter: { lat: number; lng: number };
}

export default function DirectionsMap({
  responder,
  reporter,
}: DirectionsMapProps) {
  const [icons, setIcons] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [loadingRoute, setLoadingRoute] = useState(true);

  // Marker icons
  useEffect(() => {
    const responderIcon = L.icon({
      iconUrl: "/icons/gps_blue.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    const reporterIcon = L.icon({
      iconUrl: "/icons/gps_red.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
    });

    setIcons({ responder: responderIcon, reporter: reporterIcon });
  }, []);

  // Live route update whenever responder changes
  useEffect(() => {
    const fetchRoute = async () => {
      if (!responder || !reporter) return;

      const apiKey =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjIwNzBmZGY4NjViZDQ4NDk5MzViMTgzZGEyYTUyMWYyIiwiaCI6Im11cm11cjY0In0=";

      const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${responder.lng},${responder.lat}&end=${reporter.lng},${reporter.lat}&preference=shortest`;

      try {
        setLoadingRoute(true);
        const res = await fetch(url);
        const data = await res.json();

        if (data?.features?.length > 0) {
          const coords = data.features[0].geometry.coordinates.map(
            (c: number[]) => [c[1], c[0]],
          );
          setRouteCoords(coords);
        }
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();

    // Optional: Poll every 5 seconds if responder moves continuously
    const interval = setInterval(fetchRoute, 5000);
    return () => clearInterval(interval);
  }, [responder, reporter]);

  if (!icons) return null;

  // Smooth marker movement helper
  function ResponderMarker({
    position,
    icon,
  }: {
    position: [number, number];
    icon: L.Icon;
  }) {
    const map = useMap();

    useEffect(() => {
      map.flyTo(position, map.getZoom(), { duration: 0.5 });
    }, [position]);

    return <Marker position={position} icon={icon} />;
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <MapContainer
        center={[responder.lat, responder.lng]}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
        zoomControl={false} // tanggalin ang +/-
        minZoom={14} // pinakamalapit na zoom out
        maxZoom={18} // pinakamalapit na zoom in
        maxBounds={[
          [14.135, 121.185], // Southwest
          [14.23, 121.295], // Northeast
        ]}
        maxBoundsViscosity={1.0} // di puwedeng i-drag palabas
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Responder Marker */}
        <Marker
          position={[responder.lat, responder.lng]}
          icon={icons.responder}
        />

        {/* Reporter Marker */}
        <Marker position={[reporter.lat, reporter.lng]} icon={icons.reporter} />

        {/* Route Line */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>
    </div>
  );
}
