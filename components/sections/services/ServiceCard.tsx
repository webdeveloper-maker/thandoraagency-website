import type { CSSProperties } from "react";
import type { Service } from "@/content/pages";
import styles from "@/styles/sections/services/ServiceCard.module.css";

/**
 * Service card (Figma Services frame): 583 x 661, a vertical colour gradient
 * with the 3D icon floating over a soft ground shadow, and the short label +
 * service name at the bottom left. On hover the icon zooms in and
 * lifts while its shadow tightens (decorative, so pointer hover only).
 *
 * Everything inside is sized from the card's width (container units), so the
 * layout holds at any card size.
 */
export function ServiceCard({ service }: { service: Service }) {
  const { image, color } = service;
  const style = {
    "--from": color.from,
    "--to": color.to,
    ...(image && { "--icon-w": image.w, "--icon-h": image.h }),
  } as CSSProperties;

  return (
    <article className={styles.card} style={style}>
      {image && (
        <>
          <span className={styles.ground} aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.icon} src={image.src} alt="" width={image.w} height={image.h} loading="lazy" />
        </>
      )}
      <h3 className={styles.title}>
        <span className={styles.short}>{service.short}</span>
        <span className={styles.full}>{service.title}</span>
      </h3>
    </article>
  );
}
