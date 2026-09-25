import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { memorial } from "@/memorial.config";
import "./globals.css";

const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: `In Loving Memory of ${memorial.name}`,
  description: `Condolence register for ${memorial.name}. ${memorial.tribute}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
