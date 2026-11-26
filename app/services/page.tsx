import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesInAction } from "@/components/sections/services/ServicesInAction";
import { ServicesShowcase } from "@/components/sections/services/ServicesShowcase";
import { ServicesStatement } from "@/components/sections/services/ServicesStatement";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing, creative branding and content services from Thandora — SEO, social media, websites, Google Ads, logo and brand identity design, and copywriting.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesStatement />
      <ServicesShowcase />
      <ServicesInAction />
      <CtaBand />
    </>
  );
}
