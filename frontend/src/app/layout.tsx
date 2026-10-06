import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AppProvider } from "@/context/AppContext";

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
      <body className="h-full antialiased overflow-hidden">
        <AppProvider>
          <div className="flex h-screen w-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden h-full">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
