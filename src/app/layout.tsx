import "@/app/globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import "leaflet/dist/leaflet.css";

import { Toaster } from "sonner";

import { Metadata } from "next";
import SessionHandler from "@/components/SessionHandler";
import DeviceGuard from "@/components/DeviceGuard";
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
        <DeviceGuard>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <SessionHandler />
              <Toaster
                position="top-center"
                richColors
                toastOptions={{
                  className: `${poppins.className} !w-max !absolute !left-[46%] !-translate-x-1/2 `,
                  classNames: {
                    description: "text-nowrap",
                    actionButton: "!bg-transparent !hover:none",
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </QueryProvider>
        </DeviceGuard>
      </body>
    </html>
  );
}
