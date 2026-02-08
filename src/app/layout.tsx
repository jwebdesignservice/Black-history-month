import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Special_Elite } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "The Black History Chronicle",
  description: "An interactive newspaper celebrating Black History Month with AI-powered conversations and daily historical content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${garamond.variable} ${specialElite.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
