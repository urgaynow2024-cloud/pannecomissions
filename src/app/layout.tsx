import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "../styles/globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";
import SparkleSystem from "@/components/SparkleSystem";

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
  title: {
    default: "Panne Commissions — VRChat Avatar Creator",
    template: "%s | Panne Commissions",
  },
  description: "Custom VRChat avatars, outfits, textures, and toggles by Panne. High-quality commission work for the VRChat community.",
  icons: {
    icon: "/paw-icon.svg",
    shortcut: "/paw-icon.svg",
    apple: "/paw-icon.svg",
  },
  openGraph: {
    title: "Panne Commissions — VRChat Avatar Creator",
    description: "Custom VRChat avatars, outfits, textures, and toggles by Panne. High-quality commission work for the VRChat community.",
    url: "https://www.pannecomissions.shop",
    siteName: "Panne Commissions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Panne Commissions — VRChat Avatar Creator",
    description: "Custom VRChat avatars, outfits, textures, and toggles by Panne. High-quality commission work for the VRChat community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/paw-icon.svg" type="image/svg+xml" />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased text-white min-h-screen relative overflow-x-hidden`}>
        <SparkleSystem />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
