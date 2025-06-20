import NavbarSuperAdmin from "@/components/navBar_super";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "DisasterReady",
    template: "%s | DisasterReady",
  },
  icons: { icon: "/logos/lb-logo.png" },
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <NavbarSuperAdmin />
      {children}
    </div>
  );
}
