import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookieBanner } from "@/components/dax/cookie-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DOCUFAST - Servicios Digitales",
  description: "Trámites Digitales Rápidos y Seguros. Gestiona tus documentos gubernamentales con DOCUFAST.",
  keywords: ["servicios", "digitales", "actas", "CURP", "RFC", "México", "DOCUFAST", "trámites"],
  authors: [{ name: "DOCUFAST" }],
  icons: {
    icon: "/logo.svg",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
