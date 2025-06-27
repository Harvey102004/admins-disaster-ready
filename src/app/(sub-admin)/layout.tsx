import NavbarSubAdmin from "@/components/navBar_sub";
import { Metadata } from "next";
import FaviconUpdater from "@/components/favIcon-updater";

export const metadata: Metadata = {
  title: {
    default: "Disaster Ready",
    template: "%s | Disaster Ready",
  },
  icons: {
    icon: "/logos/no-logo.png",
  },
};
export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FaviconUpdater />
      <div className="flex gap-5">
        <NavbarSubAdmin />
        {children}
      </div>
    </>
  );
}
