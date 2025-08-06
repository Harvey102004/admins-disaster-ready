import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disaster Risk Mapping",
};

export default function DisasterRiskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
