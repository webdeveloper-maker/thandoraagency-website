import type { Metadata } from "next";
import { Suspense } from "react";
import { CtaBand } from "@/components/layout/CtaBand";
import { ServiceCatalogue } from "@/components/sections/services/ServiceCatalogue";
import { ServicesHero } from "@/components/sections/services/ServicesHero";
import { ServicesInAction } from "@/components/sections/services/ServicesInAction";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing, creative branding and content services from Thandora — SEO, social media, websites, Google Ads, logo and brand identity design, and copywriting.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      {/* The catalogue reads ?category= from the URL, so it renders on the client. */}
      <Suspense>
        <ServiceCatalogue />
      </Suspense>
      <ServicesInAction />
      <CtaBand />
    </>
  );
}
