import type { Metadata, Viewport } from "next";
import { Inter, Squada_One } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const squada = Squada_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-squada",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thandora.agency"),
  title: {
    default: "Thandora — Make Your Brand heard, Make Your Business Grow.",
    template: "%s · Thandora",
  },
  description:
    "Thandora is a Chennai brand-building and digital marketing agency. We help businesses stand out in the digital world through strategic marketing, creative solutions and powerful digital experience.",
  openGraph: {
    type: "website",
    siteName: "Thandora",
    images: ["/images/brand/brand-logo-stacked.avif"],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${squada.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
