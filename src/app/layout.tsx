import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import { PwaRegister } from "@/components/pwa/pwa-register";

export const metadata: Metadata = {
  title: "Qaryz",
  description: "Учитывайте долги и делите общие расходы без заметок и таблиц.",
  applicationName: "Qaryz",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Qaryz"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      {
        url: "/icons/qaryz-icon.svg",
        type: "image/svg+xml"
      }
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#111827",
  colorScheme: "light"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
