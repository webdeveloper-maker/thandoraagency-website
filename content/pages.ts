import { asset } from "@/lib/asset";
/** About, Services and Contact page content. */

export const believeCards = [
  {
    title: "Strategy Before Decoration",
    body: "Design without strategy is just decoration. Every creative decision we make is grounded in research, positioning, and purpose.",
    image: asset("/images/about/believe/believe-1.avif"),
  },
  {
    title: "Clarity Over Noise",
    body: "In a world of constant noise, clarity is the ultimate competitive advantage. We strip away what's unnecessary.",
    image: asset("/images/about/believe/believe-2.avif"),
  },
  {
    title: "Design With Purpose",
    body: "Every element exists for a reason. We don't add things because they look nice — we add them because they work.",
    image: asset("/images/about/believe/believe-3.avif"),
  },
  {
    title: "One Connected Brand",
    body: "Your brand isn't your logo. It's the sum of every touchpoint. We make sure they all speak with one voice.",
    image: asset("/images/about/believe/believe-4.avif"),
  },
  {
    title: "Built for Real People",
    body: "Every element exists for a reason. We don't add things because they look nice — we add them because they work.",
    image: asset("/images/about/believe/believe-5.avif"),
  },
] as const;

/** TODO(client): names in Figma look like placeholders and have no photos yet. */
export const team = [
  { name: "Daniel Carter", role: "Founder & Creative Director", photo: null },
  { name: "Elena Marchetti", role: "Head of Strategy", photo: null },
  { name: "Marcus Hale", role: "Design Lead", photo: null },
] as const;

/**
 * "Services in Action" cards. The images are the Figma card exports, with the
 * client / flow / label already drawn on them; the text here is for screen
 * readers and search.
 */
export const caseStudies = [
  { id: "case-1", client: "Marcello Leigh", flow: ["Strategy", "Identity", "Print"], label: "Full Brand System", image: asset("/images/services/in-action/case-1.avif") },
  { id: "case-2", client: "Marcello Leigh", flow: ["Strategy", "Identity", "Print"], label: "Full Brand System", image: asset("/images/services/in-action/case-2.avif") },
];

/** TODO(client): dropdown options are not defined in Figma. */
export const enquiryOptions = {
  service: [
    "Social Media Marketing",
    "Search Engine Optimization (SEO)",
    "Website Design & Development",
    "Google Ads & PPC Marketing",
    "Creative Branding",
    "Content & Communication",
    "Something else",
  ],
  budget: ["Under ₹50,000", "₹50,000 – ₹1,00,000", "₹1,00,000 – ₹3,00,000", "₹3,00,000+", "Not sure yet"],
  timeline: ["As soon as possible", "Within 1 month", "1 – 3 months", "3+ months", "Flexible"],
} as const;
