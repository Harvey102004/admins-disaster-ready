"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/components/maps/reports-map"), {
  ssr: false,
});

const DirectionsMap = dynamic(
  () => import("@/components/maps/reports-directions-map"),
  { ssr: false },
);

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoutes";
import { IoClose, IoSearchOutline } from "react-icons/io5";

export default function SuperIncidentReports() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [directionsData, setDirectionsData] = useState<any>(null);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentOngoing, setCurrentOngoing] = useState<any | null>(null);
  const [userOngoing, setUserOngoing] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ongoingIncident");
    if (saved) {
      const incident = JSON.parse(saved);
      setCurrentOngoing(incident);
      setUserOngoing(incident.id);
    }
  }, []);

  const [tableView, setTableView] = useState<
    "active" | "resolved" | "dismissed"
  >("active");
  const [responderLocation, setResponderLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(
        "https://greenyellow-lion-623632.hostingersite.com/public/getIncidents.php",
        {
          withCredentials: true,
        },
      );
      setIncidents(res.data || []);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = incidents
    // 1. Filter by table view
    .filter((incident) => {
      if (tableView === "active")
        return ["Pending", "Ongoing"].includes(incident.status);
      if (tableView === "resolved") return incident.status === "Resolved";
      if (tableView === "dismissed") return incident.status === "Dismissed";
      return false;
    })
    // 2. Filter by selected STATUS (only for active)
    .filter((incident) => {
      if (tableView !== "active") return true;
      if (filterStatus === "All") return true;
      return incident.status === filterStatus;
    })
    // 3. Filter by SEVERITY
    .filter((incident) => {
      if (filterSeverity === "All") return true;
      return incident.severity === filterSeverity;
    })
    // 4. Filter by reporter name only
    .filter((incident) => {
      if (!searchQuery.trim()) return true;
      return incident.reporter_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    })
    // 5. Sort
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const handleViewMap = (incident: any) => {
    const lat = parseFloat(incident.lat);
    const lng = parseFloat(incident.lng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Invalid coordinates");
      return;
    }

    setMapPosition([lat, lng]);
    setMapModalOpen(true);
  };

  const handleStatusChange = (id: number, status: string, incident: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const respondedBy = user?.barangay
      ? user.barangay.includes("Municipal")
        ? user.barangay
        : `Brgy. ${user.barangay}`
      : null;

    // 🚫 Prevent multiple ongoing
    if (status === "Ongoing") {
      if (currentOngoing && currentOngoing.id !== incident.id) {
        toast.error("You already have an ongoing incident. Cancel it first!");
        return;
      }

      setCurrentOngoing(incident);
      setUserOngoing(incident.id);

      // 💾 SAVE TO LOCALSTORAGE
      localStorage.setItem(
        "ongoingIncident",
        JSON.stringify({
          id: incident.id,
          lat: incident.lat,
          lng: incident.lng,
          status: "Ongoing",
        }),
      );
    }

    // 🧹 CLEAR ONGOING
    if (status !== "Ongoing" && currentOngoing?.id === incident.id) {
      setCurrentOngoing(null);
      setUserOngoing(null);
      setDirectionsData(null);
      localStorage.removeItem("ongoingIncident");
    }

    // Update local incidents
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status } : inc)),
    );

    // Backend update (optional)
    axios
      .post(
        "https://greenyellow-lion-623632.hostingersite.com/public/updateIncident.php",
        { id, status, responded_by: status === "Ongoing" ? respondedBy : null },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      )
      .then((res) => {
        if (res.data.success) {
          toast.success("Status updated successfully!", {
            style: { marginRight: "160px" },
          });
        }
      })
      .catch(() => toast.error("Failed to update status"));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${month} ${day} ${year}  at ${time}`;
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    // First: get current position immediately
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setResponderLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.error(err);
        toast.error("Unable to get your location");
      },
    );

    // Then: watch position for live updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setResponderLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  function isNearReporter(
    responderLat: number,
    responderLng: number,
    reporterLat: number,
    reporterLng: number,
    radiusMeters = 20, // tolerance in meters
  ) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(reporterLat - responderLat);
    const dLng = toRad(reporterLng - responderLng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(responderLat)) *
        Math.cos(toRad(reporterLat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance <= radiusMeters;
  }

  const handleSeverityChange = async (id: number, severity: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const respondedBy = user?.barangay
      ? user.barangay.includes("Municipal")
        ? user.barangay
        : `Brgy. ${user.barangay}`
      : null;

    try {
      const incident = incidents.find((inc) => inc.id === id);
      if (!incident) return;

      const response = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/updateIncident.php",
        {
          id,
          severity,
          status: incident.status,
          responded_by: respondedBy,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Severity updated successfully!");

        // 🔥 UPDATE LOCAL STATE
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  severity,
                  severity_locked: true,
                }
              : inc,
          ),
        );
      } else {
        toast.error(response.data.error || "Failed to update severity");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to backend");
    }
  };

  useEffect(() => {
    if (currentOngoing && responderLocation) {
      setDirectionsData({
        responder: responderLocation,
        reporter: {
          lat: parseFloat(currentOngoing.lat),
          lng: parseFloat(currentOngoing.lng),
        },
      });
    }
  }, [currentOngoing, responderLocation]);

  return (
    <ProtectedRoute>
      <div className="mt-6 px-3">
        {currentOngoing && responderLocation && (
          <div className="absolute top-4 right-5 mb-4 flex items-center gap-2">
            <button
              className="bg-dark-blue rounded-sm px-3 py-1.5 text-[10px] text-white"
              onClick={() => {
                setDirectionsData({
                  responder: responderLocation,
                  reporter: {
                    lat: parseFloat(currentOngoing.lat),
                    lng: parseFloat(currentOngoing.lng),
                  },
                });
                setDirectionsModalOpen(true);
              }}
            >
              Show Ongoing Route
            </button>
            <button
              className="rounded-sm bg-red-500 px-3 py-1.5 text-[10px] text-white"
              onClick={() => {
                setCurrentOngoing(null);
                setUserOngoing(null);
                setDirectionsData(null);
                localStorage.removeItem("ongoingIncident");
                toast("Ongoing route cancelled");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <h2 className="mb-5 text-center text-sm font-semibold">
          Incidents Reports
        </h2>

        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents by name..."
            className="w-full rounded-full border border-gray-300/50 px-10 py-2.5 text-xs outline-none"
          />
          <IoSearchOutline className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-gray-400" />
        </div>

        <div className="relative mt-4 flex w-full">
          <div className="flex w-full items-center justify-center gap-3">
            <button
              onClick={() => setTableView("active")}
              className={`rounded-sm px-4 py-2 text-[10px] ${
                tableView === "active"
                  ? "bg-dark-blue text-white"
                  : "border border-gray-400/50 bg-transparent"
              }`}
            >
              Pending & Ongoing
            </button>

            <button
              onClick={() => setTableView("resolved")}
              className={`rounded-sm px-4 py-2 text-[10px] ${
                tableView === "resolved"
                  ? "bg-dark-blue text-white"
                  : "border border-gray-400/50 bg-transparent"
              }`}
            >
              Resolved
            </button>

            <button
              onClick={() => setTableView("dismissed")}
              className={`rounded-sm px-4 py-2 text-[10px] ${
                tableView === "dismissed"
                  ? "bg-dark-blue text-white"
                  : "border border-gray-400/50 bg-transparent"
              }`}
            >
              Dismissed
            </button>
          </div>
        </div>

        <div>
          <div className="mt-4 flex items-center justify-center gap-4">
            {/* Severity Filter */}

            <div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="text-[10px]">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter — only show when ACTIVE table */}
            {tableView === "active" && (
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="text-[10px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sorting */}
            <div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="text-[10px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Newest">Newest First</SelectItem>
                  <SelectItem value="Oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* INCIDENT REPORTS TABLE */}
        <div className="reportScrollBar relative mt-10 max-h-[60vh] overflow-y-auto rounded-xl px-4 pb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  ID
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Reporter
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Contact
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Description
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Severity
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Status
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Responded By
                </th>
                <th className="bg-background sticky top-0 px-3 py-3 text-left text-xs font-semibold text-nowrap">
                  Received
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="p-3">
                        <Skeleton className="h-6 w-full rounded-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident: any) => (
                  <tr
                    key={incident.id + incident.created_at}
                    className="cursor-pointer border-b select-none hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setImageModalOpen(false);
                      setSelectedIncident(incident);
                    }}
                  >
                    <td className="max-w-[50px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.id}
                    </td>
                    <td className="max-w-[100px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.reporter_name}
                    </td>
                    <td className="max-w-[110px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.reporter_contact}
                    </td>
                    <td className="max-w-[140px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.description}
                    </td>
                    <td
                      className="p-3 text-[13px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {responderLocation &&
                      isNearReporter(
                        responderLocation.lat,
                        responderLocation.lng,
                        parseFloat(incident.lat),
                        parseFloat(incident.lng),
                      ) &&
                      !incident.severity_locked ? ( // 👈 CHECK LOCK
                        <Select
                          value={incident.severity}
                          onValueChange={(value) =>
                            handleSeverityChange(incident.id, value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[120px] text-[12px]">
                            <SelectValue placeholder="Select Severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Minor">Minor</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            incident.severity === "Critical"
                              ? "bg-red-500/20 text-red-600"
                              : incident.severity === "Moderate"
                                ? "bg-yellow-400/20 text-yellow-600"
                                : "bg-green-500/20 text-green-600"
                          }`}
                        >
                          {incident.severity}
                        </span>
                      )}
                    </td>

                    <td
                      className="p-3 text-[13px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {tableView === "active" ? (
                        <Select
                          value={incident.status}
                          onValueChange={(val) => {
                            handleStatusChange(incident.id, val, incident);

                            // Record user action kung ginawa niyang Ongoing
                            if (val === "Ongoing") {
                              setUserOngoing(incident.id);
                            } else if (userOngoing === incident.id) {
                              // Kung binago niya yung ongoing sa ibang status
                              setUserOngoing(null);
                            }
                          }}
                          disabled={
                            userOngoing !== null && userOngoing !== incident.id
                          } // disable lahat except yung ginawa ng user ongoing
                        >
                          <SelectTrigger className="h-8 w-[120px] text-[12px]">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                            <SelectItem value="Dismissed">Dismissed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-xs text-gray-600">
                          {incident.status}
                        </span>
                      )}
                    </td>
                    <td className="max-w-[100px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.responded_by || "—"}
                    </td>
                    <td className="max-w-[120px] truncate p-3 text-[11px] whitespace-nowrap">
                      {incident.created_at
                        ? formatDateTime(incident.created_at)
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    No incident reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Dialog
          open={!!selectedIncident}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedIncident(null);
              setImageModalOpen(false);
            }
          }}
        >
          <DialogContent className="dark:bg-light-black h-max bg-white p-6">
            {selectedIncident && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-center gap-5">
                    <div className="flex flex-col gap-2">
                      <DialogTitle className="text-sm font-semibold">
                        Incident Details
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        Full information about the selected report.
                      </DialogDescription>
                      <p className="text-[10px]">
                        {selectedIncident.created_at
                          ? formatDateTime(selectedIncident.created_at)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex h-full flex-col justify-between gap-5">
                  <div
                    onClick={() => setImageModalOpen(true)}
                    className="relative h-[200px] w-full cursor-zoom-in overflow-hidden rounded-lg bg-red-400 shadow-md"
                  >
                    <Image
                      src={`https://greenyellow-lion-623632.hostingersite.com/uploads/${selectedIncident.media}`}
                      alt="Incident Photo"
                      fill
                      className="object-cover object-center transition-all duration-200 hover:scale-105 hover:brightness-75"
                    />
                  </div>

                  <div className="flex-1 text-sm">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                      <div>
                        <p className="text-sm">
                          {selectedIncident.reporter_name}
                        </p>
                        <span className="text-xs text-gray-500">Reporter</span>
                      </div>
                      <div>
                        <p className="text-sm">
                          {selectedIncident.reporter_contact}
                        </p>
                        <span className="text-xs text-gray-500">Contact</span>
                      </div>
                      <div>
                        <p className="text-sm">{selectedIncident.status}</p>
                        <span className="text-xs text-gray-500">Status</span>
                      </div>
                      <div>
                        <p className="text-sm">
                          {selectedIncident.responded_by || "—"}
                        </p>
                        <span className="text-xs text-gray-500">
                          Responded By
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-xs text-gray-500">
                        Description :
                      </span>
                      <div className="mt-1 rounded-md text-xs text-gray-800 dark:text-zinc-300">
                        {selectedIncident.description}
                      </div>
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-6">
                      <button
                        className="bg-dark-blue rounded-sm px-4 py-2 text-xs text-white"
                        onClick={() => handleViewMap(selectedIncident)}
                      >
                        View in Map
                      </button>

                      {/* Only show Directions button if NOT near reporter */}
                      {responderLocation &&
                        !isNearReporter(
                          responderLocation.lat,
                          responderLocation.lng,
                          parseFloat(selectedIncident.lat),
                          parseFloat(selectedIncident.lng),
                          20, // radius in meters, same as your function default
                        ) && (
                          <button
                            className="bg-dark-blue rounded-sm px-4 py-2 text-xs text-white"
                            onClick={() => {
                              if (!navigator.geolocation) {
                                toast.error("Geolocation not supported");
                                return;
                              }

                              // Open modal immediately
                              setDirectionsModalOpen(true);

                              // Use already fetched location if available
                              if (responderLocation) {
                                setDirectionsData({
                                  responder: responderLocation,
                                  reporter: {
                                    lat: parseFloat(selectedIncident.lat),
                                    lng: parseFloat(selectedIncident.lng),
                                  },
                                });
                                return; // Done
                              }

                              // Otherwise, fetch location
                              setDirectionsData(null); // show loading
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const responder = {
                                    lat: position.coords.latitude,
                                    lng: position.coords.longitude,
                                  };
                                  const reporter = {
                                    lat: parseFloat(selectedIncident.lat),
                                    lng: parseFloat(selectedIncident.lng),
                                  };

                                  setDirectionsData({ responder, reporter });
                                },
                                (err) => {
                                  console.log("Geo error code:", err.code);
                                  console.log("Geo error msg:", err.message);
                                  toast.error("Unable to access your location");
                                },
                              );
                            }}
                          >
                            Go to Directions
                          </button>
                        )}

                      {/* 
                      <div className="flex items-center">
                        <span
                          className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${
                            selectedIncident.severity === "Critical"
                              ? "bg-red-500"
                              : selectedIncident.severity === "Moderate"
                                ? "bg-yellow-400"
                                : "bg-green-500"
                          }`}
                        ></span>
                        <span
                          className={`text-sm capitalize ${
                            selectedIncident.severity === "Critical"
                              ? "text-red-500"
                              : selectedIncident.severity === "Moderate"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          {selectedIncident.severity}
                        </span>
                      </div>
                      */}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Modal */}
        {imageModalOpen && selectedIncident?.media && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 backdrop-blur-xs">
            <IoClose
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-50 text-3xl text-white"
            />

            <img
              src={`https://greenyellow-lion-623632.hostingersite.com/uploads/${selectedIncident.media}`}
              alt="Incident Photo"
              className="max-h-[90vh] max-w-[90vw] cursor-zoom-out object-contain transition-all duration-200 hover:brightness-90"
              onClick={() => setImageModalOpen(false)}
            />
          </div>
        )}

        {/* Map Modal */}
        <MapModal
          open={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          position={mapPosition}
        />

        {directionsModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setDirectionsModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative z-10 mt-10 w-full overflow-hidden rounded-lg bg-white shadow-lg">
              {/* Header */}
              <div className="mt-[15%] flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">Directions</h2>
                <IoClose
                  onClick={() => setDirectionsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>

              {/* Body */}
              {directionsData ? (
                <DirectionsMap
                  responder={directionsData.responder}
                  reporter={directionsData.reporter}
                />
              ) : (
                <div className="p-10 text-center text-sm text-gray-500">
                  Getting location…
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
