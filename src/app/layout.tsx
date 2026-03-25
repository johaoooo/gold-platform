import type { Metadata, Viewport } from "next";
import { Playfair_Display, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });

export const metadata: Metadata = {
  title: "GOLD - Investissement Visionnaire",
  description: "Plateforme d'investissement pour l'Afrique francophone",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${playfair.variable} ${syne.variable} ${dmSans.variable} antialiased bg-bg text-text-1 flex flex-col min-h-screen`}>
        <Navbar />
        <div className="flex-grow w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
