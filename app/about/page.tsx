import type { Metadata } from "next";
import { CtaBand } from "@/components/layout/CtaBand";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { Believe } from "@/components/sections/about/Believe";
import { Team } from "@/components/sections/about/Team";
import { BrandClose } from "@/components/sections/shared/BrandClose";
import { GradientBanner } from "@/components/sections/shared/GradientBanner";
import { WhoWeAre } from "@/components/sections/shared/WhoWeAre";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who we are: a Chennai brand-building and digital marketing agency where tradition legacy and modern technology come together.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <GradientBanner
        title="building brands that people actually notice"
        body="We help businesses stand out in the digital world through strategic marketing, creative solutions and powerful digital experiences."
        bodyWidth={646}
        button={{ label: "Explore Services", href: "/services/", rounded: true }}
      />
      <WhoWeAre variant="about" />
      <Believe />
      <Team />
      <BrandClose variant="about" />
      <CtaBand />
    </>
  );
}
