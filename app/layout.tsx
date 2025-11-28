import type { Metadata } from "next";
import { Poppins, Sora, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className="scroll-smooth" style={
      {
        ...poppins.style,
        ...sora.style,
        ...inter.style,
      } as React.CSSProperties
    }>
      <body className={`${poppins.variable} ${sora.variable} ${inter.variable} bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
