"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { contact } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import styles from "@/styles/sections/contact/ContactInfo.module.css";

/**
 * Blue info section of the Contact frame: big headline, email / phone /
 * location, map card and the CTA scene. Email copies to the clipboard.
 */
export function ContactInfo() {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setToast(true);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section className={styles.section} aria-labelledby="contact-info-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.scene} src="/images/cta-scene.avif" alt="" width={862} height={485} loading="lazy" />

      <div className={styles.content}>
        <Reveal>
          <h2 id="contact-info-title" className={styles.title}>
            Let&apos;s do something <br />
            remarkable.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className={styles.details}>
            <div className={styles.item}>
              <dt>EMAIL ID</dt>
              <dd>
                <button type="button" onClick={copyEmail} aria-label={`Copy email address ${contact.email}`}>
                  {contact.email}
                </button>
              </dd>
            </div>
            <div className={styles.item}>
              <dt>CONTACT NUMBER</dt>
              <dd>{contact.phone ? <a href={`tel:${contact.phone}`}>{contact.phoneLabel}</a> : contact.phoneLabel}</dd>
            </div>
            <div className={`${styles.item} ${styles.wide}`}>
              <dt>LOCATION</dt>
              <dd>
                <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                  {contact.location}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.16}>
          <a className={styles.map} href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Chennai, Tamil Nadu in Google Maps">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/contact-map.avif" alt="" width={450} height={223} loading="lazy" />
          </a>
        </Reveal>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.p
            className={styles.toast}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            Email copied to clipboard
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
