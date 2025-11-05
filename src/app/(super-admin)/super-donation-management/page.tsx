import ProtectedRoute from "@/components/ProtectedRoutes";

export default function SuperAdminDonationManageMent() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen max-h-screen w-full items-center justify-center overflow-auto px-14 py-10 transition-all duration-300">
        <h1 className="text-2xl font-bold">Super Admin Donation Management</h1>
      </div>
    </ProtectedRoute>
  );
}
