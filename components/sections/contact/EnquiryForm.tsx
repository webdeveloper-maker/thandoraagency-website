"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type FocusEvent, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { enquiryOptions } from "@/content/pages";
import { enquirySchema, sendEnquiry, type Enquiry } from "@/lib/enquiry";
import { ease } from "@/lib/motion";
import styles from "@/styles/sections/contact/EnquiryForm.module.css";
import { asset } from "@/lib/asset";

type Status = "idle" | "sending" | "sent" | "error";

function Field({
  label,
  error,
  full,
  children,
  id,
}: {
  label: string;
  error?: FieldError;
  full?: boolean;
  children: ReactNode;
  id: string;
}) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

/**
 * Enquiry form card (Figma "Component 684"): black card with the vertical
 * THANDORA watermark. On desktop the peeking king (image 67) starts tucked
 * behind the card and slides out (Default → Variant3) only while the visitor
 * hovers the form or has focus inside it. The card itself never moves, so the
 * form stays put while the figure animates.
 * Mobile / tablet: the figure is hidden; the card just fades in on view.
 */
export function EnquiryForm() {
  const uid = useId();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const revealed = hovered || focused;
  const onBlurCapture = (e: FocusEvent<HTMLDivElement>) => {
    // Only drop focus state when focus leaves the card entirely.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: { service: "", budget: "", timeline: "" },
  });

  const figureSrc = asset("/images/contact/contact-figure.avif");
  const id = (name: keyof Enquiry) => `${uid}-${name}`;
  const a11y = (name: keyof Enquiry) => ({
    id: id(name),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id(name)}-error` : undefined,
  });

  const onSubmit = async (data: Enquiry) => {
    setStatus("sending");
    try {
      await sendEnquiry(data);
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={styles.wrap}>
      {/* The king slides out from behind the card's left edge (Figma Variant3:
          the board edge in the art lines up with the card edge). */}
      <motion.div
        className={styles.figure}
        aria-hidden
        initial={false}
        animate={revealed ? { x: "-56%", opacity: 1 } : { x: "8%", opacity: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { x: { duration: 0.8, ease: ease.out }, opacity: { duration: revealed ? 0.3 : 0.6 } }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={figureSrc} alt="" width={1024} height={1280} />
      </motion.div>
      {/* Same art clipped to the hands strip, drawn over the card so the hands
          grip its edge. It only fades in once the slide has finished, so the
          body never shows on top of the form mid-slide. */}
      <motion.div
        className={`${styles.figure} ${styles.hands}`}
        aria-hidden
        initial={false}
        animate={revealed ? { x: "-56%", opacity: 1 } : { x: "8%", opacity: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                x: { duration: 0.8, ease: ease.out },
                opacity: revealed ? { duration: 0.25, delay: 0.55 } : { duration: 0.12 },
              }
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={figureSrc} alt="" width={1024} height={1280} />
      </motion.div>

      <motion.div
        className={styles.card}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={onBlurCapture}
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: ease.out }}
      >
        <div className={styles.watermark} aria-hidden>
          <div className={styles.watermarkInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/images/brand/logo-mark-white.avif")} alt="" width={141} height={131} />
            <span>THANDORA</span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              className={styles.success}
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: ease.out }}
            >
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
                <motion.circle
                  cx="36"
                  cy="36"
                  r="34"
                  stroke="#4A8CFF"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: ease.out }}
                />
                <motion.path
                  d="M22 37.5 31.5 47 50 27"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: ease.out, delay: 0.45 }}
                />
              </svg>
              <h2 className={styles.title}>Thanks — we’ll be in touch within 24 hours</h2>
              <button type="button" className={styles.again} onClick={() => setStatus("idle")}>
                Send another enquiry
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className={styles.form}
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className={styles.title}>Lets Talk</h2>

              <div className={styles.grid}>
                <Field label="Name" id={id("name")} error={errors.name}>
                  <input className={styles.input} type="text" autoComplete="name" placeholder="Your name" {...a11y("name")} {...register("name")} />
                </Field>
                <Field label="Company " id={id("company")} error={errors.company}>
                  <input className={styles.input} type="text" autoComplete="organization" placeholder="Your company" {...a11y("company")} {...register("company")} />
                </Field>
                <Field label="Email" id={id("email")} error={errors.email}>
                  <input
                    className={styles.input}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Your email"
                    {...a11y("email")}
                    {...register("email")}
                  />
                </Field>
                <Field label="Location" id={id("location")} error={errors.location}>
                  <input className={styles.input} type="text" autoComplete="address-level2" placeholder="Location" {...a11y("location")} {...register("location")} />
                </Field>
                <Field label="Required Service" id={id("service")} error={errors.service} full>
                  <select className={`${styles.input} ${styles.select}`} {...a11y("service")} {...register("service")}>
                    <option value="" disabled>
                      Service Type
                    </option>
                    {enquiryOptions.service.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Note / Description" id={id("note")} error={errors.note} full>
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Tell us about your project, goals, and timeline..."
                    rows={5}
                    {...a11y("note")}
                    {...register("note")}
                  />
                </Field>
                <Field label="Budget Range" id={id("budget")} error={errors.budget}>
                  <select className={`${styles.input} ${styles.select}`} {...a11y("budget")} {...register("budget")}>
                    <option value="">Budget Range</option>
                    {enquiryOptions.budget.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Timeline" id={id("timeline")} error={errors.timeline}>
                  <select className={`${styles.input} ${styles.select}`} {...a11y("timeline")} {...register("timeline")}>
                    <option value="">Timeline</option>
                    {enquiryOptions.timeline.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {status === "error" && (
                <p className={styles.formError} role="alert">
                  Something went wrong sending your enquiry. Your details are still here — please try again.
                </p>
              )}

              <div className={styles.submitBar}>
                <button type="submit" className={styles.submit} disabled={status === "sending"} aria-busy={status === "sending"}>
                  {status === "sending" ? <span className={styles.spinner} aria-hidden /> : null}
                  <span>{status === "sending" ? "Sending" : status === "error" ? "Try again" : "Send Enquiry"}</span>
                  {status !== "sending" && <span aria-hidden>→</span>}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
