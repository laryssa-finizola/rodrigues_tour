import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rodrigues Tur | O mundo \u00e9 grande. Viva cada peda\u00e7o dele.",
  description:
    "Inspire-se com destinos e comece a planejar sua pr\u00f3xima viagem com a Rodrigues Tur. Conhe\u00e7a possibilidades e fale com a equipe pelo Instagram.",
  openGraph: {
    title: "Rodrigues Tur | Sua pr\u00f3xima hist\u00f3ria come\u00e7a aqui",
    description: "Explore novos lugares, crie mem\u00f3rias e comece a planejar sua pr\u00f3xima viagem.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123e35",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
