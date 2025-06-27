import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brgy Contact Information",
};

export default function BrgyContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
