// Regenerates app/opengraph-image.jpg (1200x630) from lib/site.ts and public/gramado.jpg.
// Run with: npm run og:image  (needs Node.js 23.6+ to import the TypeScript data file).
import { readFile, writeFile } from "node:fs/promises";
import { createElement as h } from "react";
import { ImageResponse } from "next/og.js";
import sharp from "sharp";
import { site } from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const photo = `data:image/jpeg;base64,${await readFile(new URL("public/gramado.jpg", root), "base64")}`;

const image = h(
  "div",
  { style: { display: "flex", width: 1200, height: 630, background: "#143d35", color: "#fffcf5" } },
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", justifyContent: "center", width: 600, height: 630, padding: "0 64px" } },
    h("div", { style: { fontSize: 24, letterSpacing: 6, color: "#deab80", fontWeight: 700 } }, site.name.toUpperCase()),
    h("div", { style: { marginTop: 22, fontSize: 58, lineHeight: 1.08, fontWeight: 700 } }, `Agência de viagens em ${site.city}`),
    h("div", { style: { marginTop: 22, fontSize: 27, lineHeight: 1.4, color: "#dfe8dc" } }, "Excursões em grupo e pacotes personalizados"),
    h(
      "div",
      { style: { display: "flex", alignSelf: "flex-start", marginTop: 34, padding: "12px 20px", border: "2px solid #deab80", borderRadius: 8, fontSize: 24, fontWeight: 700 } },
      `WhatsApp ${site.whatsapp.display}`,
    ),
  ),
  h("img", { src: photo, width: 600, height: 630, style: { width: 600, height: 630, objectFit: "cover", borderTopLeftRadius: 300 } }),
);

const png = Buffer.from(await new ImageResponse(image, { width: 1200, height: 630 }).arrayBuffer());
const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
await writeFile(new URL("app/opengraph-image.jpg", root), jpeg);
console.log(`app/opengraph-image.jpg atualizado (${Math.round(jpeg.length / 1024)} KiB).`);
