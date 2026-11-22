"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import styles from "@/styles/ui/TypingLoop.module.css";

/**
 * "Brand words / Typing loop" (Figma 429:101):
 * uppercase text types at 30ms per character, then pauses 1.5s while the
 * cursor blinks every 375ms, and repeats continuously.
 */
const LINES = [
  [{ text: "BECOME THE" }],
  [{ text: "BRAND", blue: true }, { text: " PEOPLE" }],
  [{ text: "REMEMBER.", big: true }],
] as const;

const FULL = LINES.map((l) => l.map((s) => s.text).join("")).join(" ");
const TOTAL = LINES.reduce((n, l) => n + l.reduce((m, s) => m + s.text.length, 0), 0);
const CHAR_MS = 30;
const PAUSE_MS = 1500;

export function TypingLoop({ className, active = true }: { className?: string; active?: boolean }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(TOTAL);

  useEffect(() => {
    if (reduce || !active) {
      setCount(TOTAL);
      return;
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      n += 1;
      setCount(n);
      timer = setTimeout(() => {
        if (n >= TOTAL) {
          n = 0;
          tick();
        } else tick();
      }, n >= TOTAL ? PAUSE_MS : CHAR_MS);
    };
    setCount(0);
    timer = setTimeout(tick, CHAR_MS);
    return () => clearTimeout(timer);
  }, [reduce, active]);

  const typingDone = count >= TOTAL;
  let remaining = count;
  let cursorPlaced = false;

  return (
    <p className={`${styles.root} ${className ?? ""}`} aria-label={FULL}>
      {LINES.map((line, li) => {
        const lineLen = line.reduce((m, s) => m + s.text.length, 0);
        const visibleInLine = Math.max(0, Math.min(lineLen, remaining));
        remaining -= lineLen;
        const showCursor = !cursorPlaced && (visibleInLine < lineLen || li === LINES.length - 1);
        if (showCursor) cursorPlaced = true;
        let left = visibleInLine;
        return (
          <span key={li} className={styles.line} aria-hidden>
            {/* Full line, invisible, reserves the width so layout never shifts while typing. */}
            <span className={styles.ghost}>{line.map((seg) => seg.text).join("")}</span>
            <span className={styles.typed}>
            {line.map((seg, si) => {
              const shown = seg.text.slice(0, Math.max(0, left));
              left -= seg.text.length;
              const cls = [
                "blue" in seg && seg.blue ? styles.blue : "",
                "big" in seg && seg.big ? styles.big : "",
              ].join(" ");
              return (
                <span key={si} className={cls}>
                  {shown}
                </span>
              );
            })}
            {showCursor && <span className={`${styles.cursor} ${typingDone ? styles.blink : ""}`}>|</span>}
            </span>
          </span>
        );
      })}
    </p>
  );
}
