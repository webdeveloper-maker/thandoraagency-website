import { socials } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/sections/contact/ContactIntro.module.css";

/** Left column of the Contact frame: eyebrow, headline and social handles. */
export function ContactIntro() {
  return (
    <div className={styles.intro}>
      <Reveal className={styles.head}>
        <p className={styles.eyebrow}>Contact US</p>
        <h1 className={styles.lead}>
          Have something great in mind? <b>We&apos;d</b> <span className={styles.medium}>love to hear about it.</span>
        </h1>
      </Reveal>

      <ul className={styles.socials}>
        {socials.map((s, i) => (
          <Reveal as="li" key={s.id} delay={0.1 + i * 0.06}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.icon} alt="" width={s.iconSize.w} height={s.iconSize.h} />
              <span className={styles.handle}>
                <span className={styles.label}>{s.label}</span>
                <span className={styles.value}>{s.handle}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
