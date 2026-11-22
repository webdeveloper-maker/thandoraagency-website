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
});

export type Enquiry = z.infer<typeof enquirySchema>;

/**
 * The site is a static export (GitHub Pages), so enquiries go to a form
 * endpoint such as Formspree. Set NEXT_PUBLIC_ENQUIRY_ENDPOINT at build time;
 * without it the visitor's email client opens with the enquiry pre-filled.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT;

export async function sendEnquiry(data: Enquiry): Promise<void> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Enquiry failed (${res.status})`);
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
