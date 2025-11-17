import "@/app/globals.css";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/QueryProvider";
import "leaflet/dist/leaflet.css";

import { Toaster } from "sonner";
import { FaComputer } from "react-icons/fa6";
import SessionHandler from "@/components/SessionHandler";
import { headers } from "next/headers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();

  const ua = hdrs.get("user-agent") || "";
  const pathname = hdrs.get("x-invoke-path") || "";

  const isMobile = /Mobi|Android/i.test(ua);

  const mobileAllowedRoutes = ["/mobile-login"];
  const isMobileAllowed = mobileAllowedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const allowRender = !isMobile || isMobileAllowed;

  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body>
        {allowRender ? (
          <div className="block">
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
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
          </div>
        ) : (
          <div className="flex h-screen flex-col items-center justify-center gap-3 lg:hidden">
            <FaComputer className="text-4xl" />
            <p className="text-center text-sm text-gray-500">
              This website works on desktop only.
            </p>
          </div>
        )}
      </body>
    </html>
  );
}
