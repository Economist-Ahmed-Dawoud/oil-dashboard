import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oilseed Investment Dashboard - Tanzania vs Kazakhstan Strategy",
  description: "Interactive investment analysis platform for oilseed production and export to India. Comprehensive comparison of Tanzania and Kazakhstan strategies with market insights, financial projections, and risk analysis.",
  keywords: ["investment", "oilseed", "Tanzania", "India", "market analysis", "strategy"],
  openGraph: {
    title: "Oilseed Investment Dashboard",
    description: "Strategic analysis for oilseed investment opportunity in India market",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 to-slate-100 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
