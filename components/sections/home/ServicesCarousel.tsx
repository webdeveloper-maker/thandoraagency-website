"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { featuredServices } from "@/content/home";
import { Mandala } from "@/components/ui/Decor";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { u } from "@/lib/u";
import styles from "@/styles/sections/home/ServicesCarousel.module.css";
import { asset } from "@/lib/asset";

/**
 * "What we Do." (Figma "Desktop - 32"): heading, intro and a snap carousel of
 * featured service cards with the next card peeking in from the right.
 * Swipe/drag, arrow buttons and keyboard arrows all move one card.
 */
export function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const step = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("[data-card]");
    if (!track || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(featuredServices.length - 1, i));
    track.scrollTo({ left: clamped * step(), behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const s = step();
      if (s) setIndex(Math.round(track.scrollLeft / s));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse drag (touch devices already swipe natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    trackRef.current.dataset.dragging = "true";
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !trackRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    if (!drag.current || !trackRef.current) return;
    delete trackRef.current.dataset.dragging;
    const s = step();
    if (s) goTo(Math.round(trackRef.current.scrollLeft / s));
    drag.current = null;
  };

  return (
    <section className={styles.section} aria-labelledby="whatwedo-title">
      <Mandala
        src={asset("/images/union-whatwedo.svg")}
        width={442.643}
        height={412.221}
        style={{ left: u(-13), top: 0, width: u(579.811), height: u(566.098) }}
      />

      <div className={styles.intro}>
        <SectionTitle id="whatwedo-title" lead="What we" highlight="Do." />
        <div className={styles.side}>
          <Reveal>
            <p className={styles.copy}>
              At <b>Thandora</b>, we help businesses grow online through search engine optimization (SEO) and social media
              marketing. Our website design and development services create responsive, user-friendly websites. We run
              targeted Google Ads and pay-per-click (PPC) campaigns to generate leads.
            </p>
          </Reveal>
          <Reveal delay={0.1} className={styles.actions}>
            <PillButton href="/services/">THANDORA’s Services</PillButton>
            <div className={styles.arrows}>
              <button type="button" aria-label="Previous service" onClick={() => goTo(index - 1)} disabled={index === 0}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M13.164 8H2.834M6.75 4.083 2.833 8l3.917 3.917" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next service"
                onClick={() => goTo(index + 1)}
                disabled={index === featuredServices.length - 1}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2.836 8h10.33M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured services"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(index - 1);
          }
        }}
      >
        {featuredServices.map((s, i) => (
          <article
            key={s.id}
            data-card
            className={styles.card}
            style={{ backgroundColor: s.color }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${featuredServices.length}: ${s.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt="" width={1280} height={550} loading="lazy" draggable={false} />
            <div className={styles.cardShade} aria-hidden />
            <div className={styles.cardText}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.dots} aria-hidden>
        {featuredServices.map((s, i) => (
          <span key={s.id} className={i === index ? styles.dotActive : ""} />
        ))}
      </div>
    </section>
  );
}
