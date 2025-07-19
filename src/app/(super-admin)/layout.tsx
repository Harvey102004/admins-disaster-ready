import { Metadata } from "next";

import NavbarSuperAdmin from "@/components/(navigation)/navBar_super";

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
    <>
      <div className="flex">
        <NavbarSuperAdmin />
        {children}
      </div>
    </>
  );
}
