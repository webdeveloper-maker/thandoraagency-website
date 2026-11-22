import { Mandala } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { u } from "@/lib/u";
import styles from "@/styles/sections/shared/BrandClose.module.css";
import { asset } from "@/lib/asset";

/**
 * Brand close: logo + "You build the business. We'll take care of the brand."
 * flanked by two mandala shapes. `variant="about"` crops the logo to the mark,
 * as on the About frame.
 */
export function BrandClose({ variant = "home" }: { variant?: "home" | "about" }) {
  return (
    <section className={`${styles.section} ${variant === "about" ? styles.about : ""}`} aria-labelledby="close-title">
      <Mandala
        src={asset("/images/union-close.svg")}
        width={724.033}
        height={674.273}
        style={{ left: u(827), top: u(291), width: u(948.4), height: u(925.971) }}
      />
      <Mandala
        src={asset("/images/union-close.svg")}
        width={724.033}
        height={674.273}
        style={{ left: u(-269), top: u(391), width: u(948.4), height: u(925.971) }}
      />

      <div className={styles.inner}>
        <Reveal className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/brand-logo-stacked.avif")} alt="Thandora — Whoever has ears, let them hear." width={398} height={352} loading="lazy" />
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="close-title" className={styles.title}>
            You build the business.
            <br />
            We&apos;ll take care of the brand.{" "}
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className={styles.copy}>
            We connect strategy, identity, digital experience, and marketing — so every part of your brand speaks with one
            clear voice.
            <br />
            <b>It’s a Thandora Promise </b>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
