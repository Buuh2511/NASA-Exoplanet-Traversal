import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "NASA Exoplanet Traversal",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
