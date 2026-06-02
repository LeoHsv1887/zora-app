import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ZoraChat } from "@/components/ZoraChat";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zora — KI-Fördermittel für Handwerk & KMU",
  description:
    "Zora hilft deutschen Handwerksbetrieben und KMUs, passende Fördermittel zu finden und Anträge vorzubereiten.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <ZoraChat />
        </AuthProvider>
      </body>
    </html>
  );
}
