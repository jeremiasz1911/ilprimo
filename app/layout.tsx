import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "IL PRIMO | Ristorante Italiano Mława",
  description:
    "Autentyczna kuchnia włoska w sercu Mławy. Makarony, desery, przystawki i włoskie smaki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${lato.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
