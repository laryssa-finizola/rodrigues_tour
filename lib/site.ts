// Single source of truth for business data used in metadata, structured data and the page.
// Keep it identical to the Google Business Profile and Instagram bio (NAP consistency).

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!configured) return "http://localhost:3000";
  return (configured.startsWith("http") ? configured : `https://${configured}`).replace(/\/+$/, "");
}

export const SITE_URL = resolveSiteUrl();

const WHATSAPP_NUMBER = "5583987605812";
const WHATSAPP_GREETING = "Olá, Rodrigues Tur! Vi o site e gostaria de informações sobre viagens.";

export const site = {
  name: "Rodrigues Tur",
  legalDescription: "Agência de viagens e turismo em João Pessoa (PB)",
  title: "Agência de Viagens em João Pessoa | Rodrigues Tur",
  description:
    "Agência de viagens em João Pessoa (PB): excursões em grupo e pacotes personalizados para Aparecida, Gramado, Foz do Iguaçu e mais. Fale pelo WhatsApp.",
  city: "João Pessoa",
  region: "PB",
  regionName: "Paraíba",
  country: "BR",
  instagram: {
    handle: "@rodriguesturpb",
    url: "https://www.instagram.com/rodriguesturpb/",
  },
  whatsapp: {
    display: "(83) 98760-5812",
    e164: "+55 83 98760-5812",
    url: `https://wa.me/${WHATSAPP_NUMBER}`,
    urlWithMessage: (text: string = WHATSAPP_GREETING) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
  },
} as const;
