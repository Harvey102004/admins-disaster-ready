"use client";

import NavbarSubAdmin from "@/components/(navigation)/navBar_sub";
import { useNewReportsWatcher } from "@/hooks/useNewReportsWatcher";

export default function ClientSubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNewReportsWatcher();

  return (
    <div className="flex">
      <NavbarSubAdmin />
      {children}
    </div>
  );
}
