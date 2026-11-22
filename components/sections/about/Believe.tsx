"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { believeCards } from "@/content/pages";
import { GridDecor } from "@/components/ui/Decor";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ease } from "@/lib/motion";
import { u } from "@/lib/u";
import styles from "@/styles/sections/about/Believe.module.css";
import { asset } from "@/lib/asset";

/**
 * "What we Believe." (Figma section 565:9719). Five value cards sit in an
 * overlapping deck (25px offsets). Clicking the deck or the arrows sends the
 * front card to the back.
 */
export function Believe() {
  const reduce = useReducedMotion();
  // order[0] is the card at the back; the last entry is in front.
  const [order, setOrder] = useState(() => believeCards.map((_, i) => i));
  const front = order[order.length - 1];

  const next = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)]);
  const prev = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <section className={styles.section} aria-labelledby="believe-title">
      <GridDecor style={{ left: u(-231), top: u(-258) }} />

      <div className={styles.intro}>
        <SectionTitle id="believe-title" lead="What we" highlight="Believe." />
        <Reveal className={styles.copy}>
          <p>
            <span className="t-navy">At </span>
            <b>Thandora</b>,
            <span className="t-navy">
              {" "}
              we believe successful marketing begins with strong strategy, clear communication, and purpose. We help
              brands build a consistent presence, reach the right audience, and create meaningful connections.{" "}
            </span>
          </p>
        </Reveal>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.symbol} src={asset("/images/carved-symbol.svg")} alt="" width={858} height={813} aria-hidden />
      <Reveal className={styles.note}>
        <p>
          By the way , those aren’t just random carvings, they are <b>numbers in Thamiz</b> like 1, 2, 3 ... Look it up...!!
        </p>
      </Reveal>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.arrow} src={asset("/images/arrow-loop.avif")} alt="" width={170} height={146} aria-hidden />

      <div className={styles.deckWrap}>
        <div
          className={styles.deck}
          role="group"
          aria-roledescription="card deck"
          aria-label="What we believe"
          onClick={next}
        >
          {order.map((cardIndex, position) => {
            const card = believeCards[cardIndex];
            const isFront = cardIndex === front;
            return (
              <motion.article
                key={card.title}
                className={styles.card}
                aria-hidden={!isFront}
                animate={{ x: position * 25, zIndex: position }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: ease.out }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.cardImage} src={card.image} alt="" width={508} height={508} loading="lazy" />
                <div className={styles.cardText}>
                  <h3>{card.title}</h3>
                  <div className={styles.cardBody}>
                    <p>{card.body}</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset("/images/icon-quote.svg")} alt="" width={50} height={50} />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={prev} aria-label="Previous belief">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M13.164 8H2.834M6.75 4.083 2.833 8l3.917 3.917" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <span aria-live="polite">
            {believeCards.length - front} / {believeCards.length}
          </span>
          <button type="button" onClick={next} aria-label="Next belief">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M2.836 8h10.33M9.25 4.083 13.167 8 9.25 11.917" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
