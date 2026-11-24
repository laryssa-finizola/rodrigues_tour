import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

// Self-hosted by next/font: no render-blocking request to Google Fonts and no layout shift.
const sans = DM_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-sans" });
const serif = DM_Serif_Display({ subsets: ["latin", "latin-ext"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  category: "travel",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rodrigues Tur | Excursões e pacotes de viagem saindo de João Pessoa",
    description:
      "Excursões em grupo e pacotes personalizados com a Rodrigues Tur, agência de viagens em João Pessoa (PB). Fale com a equipe pelo WhatsApp ou Instagram.",
    url: "/",
    siteName: site.name,
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123e35",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#agencia`,
      name: site.name,
      description: site.description,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.svg`,
      image: `${SITE_URL}/opengraph-image.jpg`,
      telephone: site.whatsapp.e164,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.country,
      },
      areaServed: [
        { "@type": "City", name: site.city },
        { "@type": "State", name: site.regionName },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.whatsapp.e164,
        url: site.whatsapp.url,
        availableLanguage: "pt-BR",
      },
      sameAs: [site.instagram.url],
      knowsAbout: ["Excursões em grupo", "Pacotes de viagem personalizados", "Turismo religioso", "Turismo nacional"],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Excursões em grupo saindo de João Pessoa" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pacotes de viagem personalizados" } },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      url: `${SITE_URL}/`,
      name: site.name,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#agencia` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // JSON-LD is data, not code; "<" is escaped so the payload cannot close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
