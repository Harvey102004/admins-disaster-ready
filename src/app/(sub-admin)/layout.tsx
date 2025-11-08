import { Metadata } from "next";
import ClientSuperAdminLayout from "./client-layout";
import ProtectedRoute from "@/components/ProtectedRoutes";

export const metadata: Metadata = {
  title: {
    default: "DisasterReady",
    template: "%s | DisasterReady",
  },
  icons: { icon: "/logos/lb-logo.png" },
};

export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ClientSuperAdminLayout>{children}</ClientSuperAdminLayout>
    </ProtectedRoute>
  );
}
