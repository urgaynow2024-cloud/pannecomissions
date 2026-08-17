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
    default: "Panne Commissions — VRChat Avatar Work",
    template: "%s | Panne Commissions",
  },
  description: "I make VRChat avatars, outfits, textures, toggles, and models. Commissions open — DM or use the form to tell me what you need.",
  icons: {
    icon: "/paw-icon.svg",
    shortcut: "/paw-icon.svg",
    apple: "/paw-icon.svg",
  },
  openGraph: {
    title: "Panne Commissions — VRChat Avatar Work",
    description: "I make VRChat avatars, outfits, textures, toggles, and models. Commissions open — DM or use the form to tell me what you need.",
    url: "https://www.pannecomissions.shop",
    siteName: "Panne Commissions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Panne Commissions — VRChat Avatar Work",
    description: "I make VRChat avatars, outfits, textures, toggles, and models. Commissions open — DM or use the form to tell me what you need.",
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
