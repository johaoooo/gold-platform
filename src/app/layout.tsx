import type { Metadata } from "next";
import { Playfair_Display, Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Providers from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

export const metadata: Metadata = {
  title: "Golden Invest",
  description: "La plateforme qui connecte les porteurs de projets aux investisseurs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${playfair.variable} ${syne.variable} ${dmSans.variable}`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-bg">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
