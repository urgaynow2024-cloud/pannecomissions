import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../styles/globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panne Commissions",
  description: "VRChat avatar commissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-brand-black text-white min-h-screen relative overflow-x-hidden`}>
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
