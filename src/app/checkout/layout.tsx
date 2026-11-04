import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default function LayoutCheckout({ children }: { children: React.ReactNode }) {
  return children;
}
