import Link from "next/link";
import type { Service } from "@/content/pages";
import styles from "@/styles/sections/services/ServiceCard.module.css";

/**
 * Service card (Figma "States": Variant2 at rest ↔ Default on hover/focus).
 * At rest the title sits at the bottom; on hover the bronze→black gradient
 * deepens, the title turns vertical and the View Service button slides in.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className={styles.card}>
      {service.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.art} src={service.image} alt="" width={583} height={661} loading="lazy" />
      )}
      <div className={styles.shade} aria-hidden />
      <h3 className={styles.title}>
        {service.short && <span className={styles.short}>{service.short} / </span>}
        <span className={styles.full}>{service.title}</span>
      </h3>
      <Link href="/contact/" className={styles.button}>
        View Service
        <span className="sr-only">: {service.title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2.836 8h10.33M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </Link>
    </article>
  );
}
