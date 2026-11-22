import { GridDecor } from "@/components/ui/Decor";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { u } from "@/lib/u";
import { MissionCards } from "@/components/sections/shared/MissionCards";
import styles from "@/styles/sections/shared/WhoWeAre.module.css";

/** "Who are We." intro + Component 680 cards (Home and About). */
export function WhoWeAre({ variant = "home" }: { variant?: "home" | "about" }) {
  const showButton = variant === "home";
  return (
    <section className={`${styles.section} ${variant === "about" ? styles.about : ""}`} aria-labelledby="who-title">
      <GridDecor style={{ left: u(-178), top: u(-237) }} />
      <GridDecor style={{ left: u(860), top: u(670) }} />

      <div className={styles.intro}>
        <SectionTitle id="who-title" lead="Who are" highlight="We." className={styles.title} />
        <div className={styles.side}>
          <Reveal>
            <p className={styles.copy}>
              <b>THANDORA</b> is a creative digital marketing agency helping businesses strengthen their online presence
              and achieve sustainable growth. Through strategic digital marketing, SEO, Social Media Marketing, branding
              and innovative web solutions, we turn ideas into impactful digital experiences that make your brand stand
              out.{" "}
            </p>
          </Reveal>
          {showButton && (
            <Reveal delay={0.1}>
              <PillButton href="/about/" className={styles.button}>
                More About THANDORA
              </PillButton>
            </Reveal>
          )}
        </div>
      </div>

      <div className={`${styles.cards} ${showButton ? "" : styles.cardsTight}`}>
        <Reveal y={40}>
          <MissionCards />
        </Reveal>
      </div>
    </section>
  );
}
