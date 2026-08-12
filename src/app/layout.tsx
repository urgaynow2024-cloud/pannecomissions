import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Panne Commissions",
  description: "VRChat avatar commission service - avatar customisation, clothing additions, complete avatar setups, toggles, custom textures, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
