import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Qaryz",
  description: "Учитывайте долги и делите общие расходы без заметок и таблиц."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans">{children}</body>
    </html>
  );
}
