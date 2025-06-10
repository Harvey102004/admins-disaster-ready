import NavbarSuperAdmin from "@/components/navBar_super";

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
