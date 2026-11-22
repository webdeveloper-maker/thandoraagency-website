import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/layout/CtaBand.module.css";

/** CTA band (Figma "Desktop - 23"), shared by Home, Services and About. */
export function CtaBand() {
  return (
    <section className={styles.band} aria-labelledby="cta-title">
      <div className={styles.copy}>
        <Reveal>
          <p className={styles.lead}>
            Tell us about your business goals.
            <br />
            Together, we can make your brand stand out.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="cta-title" className={styles.title}>
            Let&apos;s do something <br />
            remarkable.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <PillButton href="/contact/" variant="white" arrow={false} className={styles.button}>
            LET’S TALK
          </PillButton>
        </Reveal>
      </div>
      <Reveal className={styles.art} x={40} y={0}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cta-scene.avif" alt="" width={862} height={485} loading="lazy" />
      </Reveal>
    </section>
  );
}
