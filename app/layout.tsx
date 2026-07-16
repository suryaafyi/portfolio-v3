import type { Metadata } from "next";
import {
  DM_Sans,
  Space_Mono,
  Bricolage_Grotesque,
  Caveat,
  Anton,
  Abril_Fatface,
  Archivo_Black,
  Gabarito,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";
import HuntPocket from "@/components/hunt/HuntPocket";

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

// The Home splash cycles "Surya" through world scripts (Noto Serif per script);
// those are loaded on-demand as subset Google Fonts links in SplashIntro.

// /v4 prototype (brandappart direction): Gabarito = closest free match for
// their "Youth" display face (heavy geometric, round bowls); Instrument Sans
// stands in for PP Neue Montreal body.
const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-gabarito",
  display: "swap",
  preload: false,
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

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
      className={`${dmSans.variable} ${spaceMono.variable} ${bricolage.variable} ${caveat.variable} ${anton.variable} ${abril.variable} ${archivo.variable} ${gabarito.variable} ${instrument.variable}`}
    >
      <body>
        {children}
        <HuntPocket />
        {/* Site pet (Batch №000) benched for now — doesn't match the vibe yet.
            Re-enable by importing components/pet/SitePet and mounting it here. */}
      </body>
    </html>
  );
}
