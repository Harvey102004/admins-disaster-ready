import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Information",
};

export default function SubBrgyContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative h-screen w-full overflow-auto px-8 pt-10 transition-all duration-300">
        <div className="bg-dark-blue absolute -top-28 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-[130px]"></div>

        <div className="flex items-center justify-center gap-3 border-b pb-6">
          <h1 className="text-dark-blue text-xl font-bold">
            Contact Information
          </h1>
        </div>
        {children}
      </div>
    </>
  );
}
