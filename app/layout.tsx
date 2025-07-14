import type { Metadata } from "next";
import "./globals.css";
import LayoutSwitcher from "@/app/components/layout/LayoutSwitcher";

export const metadata: Metadata = {
  title: "Méthode son importance",
  description: "Cours de lecture arabe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full bg-zinc-950 text-white">
        <LayoutSwitcher>
          {children}
        </LayoutSwitcher>
      </body>
    </html>
  );
}