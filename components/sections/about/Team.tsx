import { team } from "@/content/pages";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/sections/about/Team.module.css";

/** "The People" (Figma section 462:4806): team cards on a light grey band. */
export function Team() {
  return (
    <section className={styles.section} aria-labelledby="team-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span aria-hidden />
          The People
        </p>
        <Reveal>
          <h2 id="team-title" className={styles.title}>
            The team behind the brands.
          </h2>
        </Reveal>

        <ul className={styles.grid}>
          {team.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 0.06} className={styles.card}>
              <div className={styles.photo} tabIndex={0}>
                {m.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={`${m.name} — ${m.role}`} width={277} height={277} loading="lazy" />
                )}
              </div>
              <h3 className={styles.name}>{m.name}</h3>
              <p className={styles.role}>{m.role}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
