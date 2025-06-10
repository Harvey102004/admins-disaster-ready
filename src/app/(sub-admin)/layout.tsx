import NavbarSubAdmin from "@/components/navBar_sub";

export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <NavbarSubAdmin />
      {children}
    </div>
  );
}
