import { caseStudies } from "@/content/pages";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/sections/services/ServicesInAction.module.css";

/**
 * "Services in Action" (anchor target for the Work link): two project cards
 * (Figma exports, caption drawn in), then "All blogs". Continues the
 * black "What we Do." section and fades into the blue CTA band.
 */
export function ServicesInAction() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>Services in Action</p>
        <Reveal>
          <h2 id="work-title" className={styles.title}>
            See how the system works
            <br />
            in real projects.
          </h2>
        </Reveal>
      </div>

      <ul className={styles.cards}>
        {caseStudies.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 0.08} className={styles.card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="" width={583} height={585} loading="lazy" />
            <div className="sr-only">
              <h3>{c.client}</h3>
              <p>{c.flow.join(" → ")}</p>
              <p>{c.label}</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <div className={styles.actions}>
        {/* TODO: point to the blog once it exists. */}
        <PillButton href="/contact/" variant="white" size="sm">
          All blogs
        </PillButton>
      </div>
    </section>
  );
}
