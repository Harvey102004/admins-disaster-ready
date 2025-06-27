import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Information",
};

export default function SubBrgyContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
