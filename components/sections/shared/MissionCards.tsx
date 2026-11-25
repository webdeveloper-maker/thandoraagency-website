"use client";

import { useState } from "react";
import { useCanHover } from "@/lib/useMedia";
import styles from "@/styles/sections/shared/MissionCards.module.css";
import { asset } from "@/lib/asset";

const CARDS = [
  {
    id: "vision",
    label: "OUR VISION",
    image: asset("/images/shared/who-we-are/vision.avif"),
    title: "Shaping the Future of Digital Growth",
    body: "Our vision is to become a trusted digital marketing agency that empowers businesses to grow, connect with their audiences and build a strong digital identity. We aspire to make a meaningful impact through creativity, innovation and effective digital strategies.",
  },
  {
    id: "mission",
    label: "OUR MISSION",
    image: asset("/images/shared/who-we-are/mission.avif"),
    title: "Turning Business Goals Into Digital Success",
    body: "Our mission is to deliver creative, result-focused digital marketing solutions that help businesses strengthen their online presence, reach the right audience and achieve their goals. We are committed to understanding every brand and creating strategies that make a difference.",
  },
  {
    id: "story",
    label: "OUR STORY",
    image: asset("/images/shared/who-we-are/story.avif"),
    title: "Every Great Brand Begins With a Story",
    body: "THANDORA was founded with a simple idea: every business deserves to be seen, heard and remembered. We started our journey with a passion for creativity, technology and digital marketing. Our goal is to help businesses build a meaningful online presence through innovative ideas, strategic thinking and creative digital solutions.",
  },
] as const;

/**
 * Component 680: one wide card + two tall cards. Hovering (desktop) or
 * tapping (touch) a card widens it while the others narrow. On mobile the
 * cards become a one-open-at-a-time accordion.
 */
export function MissionCards() {
  const [active, setActive] = useState<string>("vision");
  const canHover = useCanHover();

  return (
    <div className={styles.cards} onMouseLeave={() => canHover && setActive("vision")}>
      {CARDS.map((card) => {
        const open = active === card.id;
        return (
          <article
            key={card.id}
            className={`${styles.card} ${styles[card.id]} ${open ? styles.open : ""}`}
            onMouseEnter={() => canHover && setActive(card.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.image} src={card.image} alt="" width={725} height={510} loading="lazy" />
            <div className={styles.shade} aria-hidden />

            <button
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={`${card.id}-panel`}
              onClick={() => setActive(card.id)}
            >
              <span className={styles.vertical}>{card.label}</span>
              <span className="sr-only">{open ? "" : " — show"}</span>
            </button>

            <div id={`${card.id}-panel`} className={styles.panel} aria-hidden={!open}>
              <p className={styles.label}>{card.label}</p>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.body}>{card.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
