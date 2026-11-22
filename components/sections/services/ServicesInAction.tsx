import { caseStudies } from "@/content/pages";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/sections/services/ServicesInAction.module.css";
import { asset } from "@/lib/asset";

/** "Services in Action": case-study cards (anchor target for the Work link). */
export function ServicesInAction() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span aria-hidden />
          Services in Action
        </p>
        <Reveal>
          <h2 id="work-title" className={styles.title}>
            See how the system works in real projects.
          </h2>
        </Reveal>
      </div>

      <ul className={styles.cards}>
        {caseStudies.map((c, i) => (
          <Reveal as="li" key={c.id} delay={i * 0.08} className={styles.card}>
            <div className={styles.media} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/images/logo-mark-white.avif")} alt="" width={120} height={112} />
            </div>
            <div className={styles.meta}>
              <h3>{c.client}</h3>
              <p className={styles.flow}>
                {c.flow.map((step, si) => (
                  <span key={step} style={{ animationDelay: `${si * 120}ms` }}>
                    {si > 0 && <i aria-hidden>→</i>}
                    {step}
                  </span>
                ))}
              </p>
              <p className={styles.label}>{c.label}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
