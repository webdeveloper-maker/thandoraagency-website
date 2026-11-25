import { z } from "zod";
import { contact } from "@/content/site";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name."),
  company: z.string().trim().optional(),
  email: z.string().trim().min(1, "Please add your email.").email("That email doesn’t look right."),
  location: z.string().trim().optional(),
  service: z.string().min(1, "Choose the service you need."),
  note: z.string().trim().min(10, "A line or two about your project helps us prepare."),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  /** Honeypot: hidden from people, so only bots fill it; the sheet script drops those. */
  website: z.string().optional(),
});

export type Enquiry = z.infer<typeof enquirySchema>;

/**
 * The site is a static export (GitHub Pages), so enquiries go to a Google
 * Apps Script web app that appends a row to the enquiries Google Sheet
 * (scripts/google-sheets/enquiry.gs). The URL is public by nature (it ships
 * in the browser bundle), so it lives here; NEXT_PUBLIC_ENQUIRY_ENDPOINT can
 * override it at build time (e.g. to test a different sheet).
 */
const SHEET_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbz9dVhYQWr-P7izRVa_JTDwYLEdDxVuFRKnWaH3-hL5qk1VUuEMZhNzPbsjRwfXfAxZ/exec";
const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT || SHEET_ENDPOINT;

export async function sendEnquiry(data: Enquiry): Promise<void> {
  if (ENDPOINT) {
    // Sent as text/plain so the browser makes a "simple" request: Apps Script
    // cannot answer a CORS preflight, which JSON or Accept headers would trigger.
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !reply?.ok) throw new Error(`Enquiry failed (${res.status})`);
    return;
  }

  const details: [string, string | undefined][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Location", data.location],
    ["Required service", data.service],
    ["Budget", data.budget],
    ["Timeline", data.timeline],
  ];
  const lines = [...details.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", data.note];
  const subject = encodeURIComponent(`New enquiry from ${data.name}`);
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
}
