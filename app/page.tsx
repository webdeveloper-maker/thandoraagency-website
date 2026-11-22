import { CtaBand } from "@/components/layout/CtaBand";
import { BrandClose } from "@/components/sections/shared/BrandClose";
import { GradientBanner } from "@/components/sections/shared/GradientBanner";
import { HeroHome } from "@/components/sections/home/HeroHome";
import { HowWeDoIt } from "@/components/sections/home/HowWeDoIt";
import { ServicesCarousel } from "@/components/sections/home/ServicesCarousel";
import { Statement } from "@/components/sections/home/Statement";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { WhoWeAre } from "@/components/sections/shared/WhoWeAre";
import { WhyChooseUs } from "@/components/sections/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroHome />
      <GradientBanner
        title="Ready to Take Your Brand to the Next Level. "
        body={
          <>
            From building a strong digital presence to reaching the right audience, we bring creativity and strategy
            together to move your business forward. Discover how <b>THANDORA</b> can help your brand grow in the digital
            world.{" "}
          </>
        }
        button={{ label: "Explore Services", href: "/services/" }}
      />
      <WhoWeAre />
      <Statement />
      <ServicesCarousel />
      <WhyChooseUs />
      <GradientBanner
        shape="notch-top"
        eyebrow="Start Your Marketing Journey With Thandora"
        title={
          <>
            You built something worth remembering.
            <br />
            Let&apos;s make sure people do.
          </>
        }
        bodyWidth={793}
        button={{ label: "Contact us", href: "/contact/" }}
        art="scholar"
      />
      <HowWeDoIt />
      <Testimonials />
      <BrandClose />
      <CtaBand />
    </>
  );
}
