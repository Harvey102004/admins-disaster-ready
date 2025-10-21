"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosPaper } from "react-icons/io";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function IncidentReports() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchIncidents = async () => {
    try {
      const res = await axios.get(
        "http://localhost/Disaster-backend/controllers/getIncidents.php",
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

  const handleStatusChange = async (id: number, status: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const respondedBy = user?.barangay || "Unknown Responder";

    try {
      const response = await axios.post(
        "http://localhost/Disaster-backend/controllers/updateIncident.php",
        {
          id,
          status,
          responded_by: respondedBy,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.data.success) {
        alert("✅ Status updated successfully!");
        fetchIncidents();
      } else {
        alert("⚠️ " + (response.data.error || "Failed to update status"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("❌ Failed to connect to backend");
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

  if (loading) return <p className="p-8">Loading incident reports...</p>;

  return (
    <div className="relative h-screen w-full overflow-auto px-10 py-8 transition-all duration-300">
      {/* Header */}
      <div className="mb-8 flex items-center gap-2">
        <IoIosPaper className="text-2xl" />
        <h2 className="text-2xl font-semibold">Incident Reports</h2>
      </div>

      {/* Table */}
      <div className="rounded-xl border p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responded By</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <TableCell>{incident.id}</TableCell>
                  <TableCell>{incident.reporter_name}</TableCell>
                  <TableCell>{incident.reporter_contact}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {incident.description}
                  </TableCell>
                  <TableCell>{incident.severity}</TableCell>
                  <TableCell>
                    <Select
                      value={incident.status}
                      onValueChange={(value) =>
                        handleStatusChange(incident.id, value)
                      }
                    >
                      <SelectTrigger className="w-[120px] text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{incident.responded_by || "—"}</TableCell>
                  <TableCell>
                    {incident.created_at
                      ? formatDate(incident.created_at)
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-6 text-center text-gray-500 italic"
                >
                  No incident reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedIncident}
        onOpenChange={() => setSelectedIncident(null)}
      >
        <DialogContent className="p-6 sm:max-w-[800px]">
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
                {/* Left side info */}
                <div className="flex-1 text-sm">
                  {/* 2x2 grid */}
                  <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    <div className="flex flex-col">
                      <p className="text-sm">
                        {selectedIncident.reporter_name}
                      </p>
                      <span className="text-xs text-gray-500">Reporter</span>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm">
                        {selectedIncident.reporter_contact}
                      </p>
                      <span className="text-xs text-gray-500">Contact</span>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm">{selectedIncident.status}</p>
                      <span className="text-xs text-gray-500">Status</span>
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm">
                        {selectedIncident.responded_by || "—"}
                      </p>
                      <span className="text-xs text-gray-500">
                        Responded By
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="text-xs text-gray-500">Description</span>
                    <div className="mt-1 rounded-md text-xs text-gray-800">
                      {selectedIncident.description}
                    </div>
                  </div>

                  <div className="absolute bottom-[5%] flex items-center gap-6">
                    <button className="bg-dark-blue rounded-sm px-4 py-2 text-xs text-white">
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

                {/* Right side image thumbnail + fullscreen */}
                {selectedIncident.media && (
                  <>
                    <div
                      onClick={() => setImageModalOpen(true)}
                      className="relative h-[320px] w-[320px] cursor-zoom-in overflow-hidden rounded-lg shadow-md"
                    >
                      <Image
                        src={`http://localhost/Disaster-backend/uploads/${selectedIncident.media}`}
                        alt="Incident Photo"
                        fill
                        className="object-cover object-center transition-all duration-200 hover:scale-105 hover:brightness-75"
                      />
                    </div>

                    {imageModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                        <button
                          className="absolute top-4 right-4 z-50 text-3xl font-bold text-white hover:text-gray-300"
                          onClick={() => setImageModalOpen(false)}
                        >
                          ×
                        </button>

                        <img
                          src={`http://localhost/Disaster-backend/uploads/${selectedIncident.media}`}
                          alt="Incident Photo"
                          className="max-h-[90vh] max-w-[90vw] cursor-zoom-out object-contain transition-all duration-200 hover:brightness-90"
                          onClick={() => setImageModalOpen(false)}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
