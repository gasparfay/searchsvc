import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SearchSvc Admin",
  description: "Web crawler and search engine admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased overflow-hidden">{children}</body>
    </html>
  );
}
