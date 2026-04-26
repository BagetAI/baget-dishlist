import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["700"]
});

export const metadata: Metadata = {
  title: "DishList | Your Personal Taste Passport",
  description: "Stop searching for restaurants. Find the exact dish you crave. The dish-first memory map for your favorite flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#F9F7F2] text-[#2D2926]`}>
        {children}
      </body>
    </html>
  );
}
