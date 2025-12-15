import MobileNavigation from "@/components/(navigation)/mobile-nav";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full p-4">
        <MobileNavigation />
      </div>
      {children}
    </>
  );
}
