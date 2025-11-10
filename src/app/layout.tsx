import "@/app/globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import "leaflet/dist/leaflet.css";

import { Toaster } from "sonner";

import { Metadata } from "next";
import { FaComputer } from "react-icons/fa6";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "DisasterReady",
    template: "%s | DisasterReady",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        <div className="hidden lg:block">
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster
                position="top-center"
                richColors
                toastOptions={{
                  className: `${poppins.className} !w-max !absolute !left-1/2 !-translate-x-1/2`,
                  classNames: {
                    description: "text-nowrap",
                    actionButton: "!bg-transparent !hover:none",
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </div>

        <div className="flex h-screen flex-col items-center justify-center gap-3 lg:hidden">
          <FaComputer className="text-4xl" />
          <p className="text-center text-sm text-gray-500">
            This website works on desktop only.
          </p>
        </div>
      </body>
    </html>
  );
}
