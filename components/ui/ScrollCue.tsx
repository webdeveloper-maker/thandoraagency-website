import styles from "@/styles/ui/ScrollCue.module.css";

/** Decorative "Scroll" cue: mouse outline with a looping wheel dot. Position it via className. */
export function ScrollCue({ className }: { className?: string }) {
  return (
    <div className={`${styles.cue} ${className ?? ""}`} aria-hidden>
      <span className={styles.mouse}>
        <span className={styles.wheel} />
      </span>
      Scroll
    </div>
  );
}
