"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosPaper } from "react-icons/io";
import dynamic from "next/dynamic";

const MapModal = dynamic(() => import("@/components/maps/reports-map"), {
  ssr: false,
});

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
import { RiFilter2Fill } from "react-icons/ri";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function IncidentReports() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Newest");

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
  }, []);

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        (filterSeverity === "All" || incident.severity === filterSeverity) &&
        (filterStatus === "All" || incident.status === filterStatus),
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const handleViewMap = (incident: any) => {
    const lat = parseFloat(incident.lat);
    const lng = parseFloat(incident.lng);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      toast.error(" Invalid coordinates for this incident.");
      return;
    }

    setMapPosition([lat, lng]);
    setMapModalOpen(true);
  };

  const handleStatusChange = async (id: number, status: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const respondedBy = user?.barangay || "Unknown Responder";

    try {
      const response = await axios.post(
        "https://greenyellow-lion-623632.hostingersite.com/public/updateIncident.php",
        {
          id,
          status,
          responded_by: respondedBy,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Status updated successfully!", {
          style: { marginLeft: "160px" },
        });
        fetchIncidents();
      } else {
        toast.error(response.data.error || "Failed to update status", {
          style: { marginLeft: "160px" },
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to connect to backend");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-full overflow-auto px-10 py-8 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="mb-3 flex items-center gap-2">
            <IoIosPaper className="text-2xl" />
            <h2 className="text-2xl font-semibold">Incident Reports</h2>
          </div>

          {/* Filter */}

          <div>
            <div className="flex items-center justify-end gap-4">
              {/* Severity Filter */}
              <div>
                <Select
                  value={filterSeverity}
                  onValueChange={setFilterSeverity}
                >
                  <SelectTrigger className="text-xs">
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

              {/* Status Filter */}
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting */}
              <div>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Newest">Newest First</SelectItem>
                    <SelectItem value="Oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <RiFilter2Fill className="text-2xl" />
            </div>
          </div>
        </div>

        {/* INCIDENT REPORTS TABLE */}
        <div className="scrollBar relative mt-5 max-h-[82vh] overflow-y-auto rounded-xl border px-4 pb-4 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  ID
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Reporter
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Contact
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Description
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Severity
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
                  Responded By
                </th>
                <th className="bg-background sticky top-0 px-3 py-4 text-left text-sm font-semibold">
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
                    key={incident.id}
                    className="cursor-pointer border-b select-none hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setImageModalOpen(false);
                      setSelectedIncident(incident);
                    }}
                  >
                    <td className="p-3 text-[13px]">{incident.id}</td>
                    <td className="p-3 text-[13px]">
                      {incident.reporter_name}
                    </td>
                    <td className="p-3 text-[13px]">
                      {incident.reporter_contact}
                    </td>

                    <td className="max-w-[200px] truncate p-3 text-[13px]">
                      {incident.description}
                    </td>

                    <td className="p-3 text-[13px]">
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
                    </td>

                    <td
                      className="p-3 text-[13px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={incident.status}
                        onValueChange={(value) =>
                          handleStatusChange(incident.id, value)
                        }
                      >
                        <SelectTrigger className="h-8 w-[120px] text-[12px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td className="p-3 text-[13px]">
                      {incident.responded_by || "—"}
                    </td>

                    <td className="p-3 text-[13px]">
                      {incident.created_at
                        ? formatDate(incident.created_at)
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
          <DialogContent className="dark:bg-light-black bg-white p-6 sm:max-w-[800px]">
            {selectedIncident && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-5">
                    <IoIosPaper className="text-3xl" />
                    <div>
                      <DialogTitle className="text-lg font-semibold">
                        Incident Details
                      </DialogTitle>
                      <DialogDescription>
                        Full information about the selected report.
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <p className="absolute top-[7%] right-[8%] text-sm">
                  {selectedIncident.created_at
                    ? formatDate(selectedIncident.created_at)
                    : "—"}
                </p>

                <div className="mt-5 flex h-full justify-between gap-10">
                  {/* Left Info */}
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

                    <div className="absolute bottom-[5%] flex items-center gap-6">
                      <button
                        className="bg-dark-blue rounded-sm px-4 py-2 text-xs text-white"
                        onClick={() => handleViewMap(selectedIncident)}
                      >
                        View in Map
                      </button>

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
                    </div>
                  </div>

                  {/* Right Image */}
                  {selectedIncident.media && (
                    <div
                      onClick={() => setImageModalOpen(true)}
                      className="relative h-[320px] w-[320px] cursor-zoom-in overflow-hidden rounded-lg shadow-md"
                    >
                      <Image
                        src={`https://greenyellow-lion-623632.hostingersite.com/uploads/${selectedIncident.media}`}
                        alt="Incident Photo"
                        fill
                        className="object-cover object-center transition-all duration-200 hover:scale-105 hover:brightness-75"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Image Modal */}
        {imageModalOpen && selectedIncident?.media && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/10 backdrop-blur-xs">
            <button
              className="absolute top-4 right-4 z-50 text-3xl font-bold text-white hover:text-gray-300"
              onClick={() => setImageModalOpen(false)}
            >
              ×
            </button>

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
      </div>
    </ProtectedRoute>
  );
}
