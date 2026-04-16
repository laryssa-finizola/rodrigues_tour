import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; 
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat", 
});

export const metadata: Metadata = {
  title: "Rodrigues Tur - Monte seu Roteiro",
  description: "A sua jornada, o seu tempo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${montserrat.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}