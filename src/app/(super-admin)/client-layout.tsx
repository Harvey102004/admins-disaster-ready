"use client";

import NavbarSuperAdmin from "@/components/(navigation)/navBar_super";
import { useNewReportsWatcher } from "@/hooks/useNewReportsWatcher";

export default function ClientSuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNewReportsWatcher();

  return (
    <div className="flex">
      <NavbarSuperAdmin />
      {children}
    </div>
  );
}
