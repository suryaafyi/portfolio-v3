import type { Metadata } from "next";
import {
  DM_Sans,
  Space_Mono,
  Bricolage_Grotesque,
  Caveat,
  Anton,
  Abril_Fatface,
  Archivo_Black,
} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// About page: --hand (Caveat) + the scrapbook-teaser ransom title fonts.
// preload off — they're only used on /about.
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap", preload: false });
const abril = Abril_Fatface({ subsets: ["latin"], weight: "400", variable: "--font-abril", display: "swap", preload: false });
const archivo = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Surya — Product Designer & Developer",
  description:
    "A hybrid of design taste and front-end engineering — I take products from first sketch all the way to deployed.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceMono.variable} ${bricolage.variable} ${caveat.variable} ${anton.variable} ${abril.variable} ${archivo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
