import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de gestión",
  robots: { index: false, follow: false },
};

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
  return <div className="bg-papel min-h-dvh">{children}</div>;
}
