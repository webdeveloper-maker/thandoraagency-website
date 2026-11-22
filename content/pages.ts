import { asset } from "@/lib/asset";
/** About, Services and Contact page content. */

export const believeCards = [
  {
    title: "Strategy Before Decoration",
    body: "Design without strategy is just decoration. Every creative decision we make is grounded in research, positioning, and purpose.",
    image: asset("/images/believe-1.avif"),
  },
  {
    title: "Clarity Over Noise",
    body: "In a world of constant noise, clarity is the ultimate competitive advantage. We strip away what's unnecessary.",
    image: asset("/images/believe-2.avif"),
  },
  {
    title: "Design With Purpose",
    body: "Every element exists for a reason. We don't add things because they look nice — we add them because they work.",
    image: asset("/images/believe-3.avif"),
  },
  {
    title: "One Connected Brand",
    body: "Your brand isn't your logo. It's the sum of every touchpoint. We make sure they all speak with one voice.",
    image: asset("/images/believe-4.avif"),
  },
  {
    title: "Built for Real People",
    body: "Every element exists for a reason. We don't add things because they look nice — we add them because they work.",
    image: asset("/images/believe-5.avif"),
  },
] as const;

/** TODO(client): names in Figma look like placeholders and have no photos yet. */
export const team = [
  { name: "Daniel Carter", role: "Founder & Creative Director", photo: null },
  { name: "Elena Marchetti", role: "Head of Strategy", photo: null },
  { name: "Marcus Hale", role: "Design Lead", photo: null },
] as const;

export const serviceCategories = [
  { id: "all", label: "All" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "creative-branding", label: "Creative Branding" },
  { id: "content-communication", label: "Content & Communication" },
] as const;

export type ServiceCategory = Exclude<(typeof serviceCategories)[number]["id"], "all">;

export type Service = {
  slug: string;
  short?: string;
  title: string;
  category: ServiceCategory;
  /** 3D illustration from the Figma card (not exported yet). */
  image: string | null;
};

/**
 * The 13 service cards from the Services frame. Three cards are unnamed in
 * Figma; they use the three Home carousel services that have no other card.
 * TODO(client): confirm those three and send the card illustrations.
 */
export const services: Service[] = [
  { slug: "smo", short: "SMO", title: "Social Media Optimization", category: "digital-marketing", image: null },
  { slug: "seo", short: "SEO", title: "Search Engine Optimization", category: "digital-marketing", image: null },
  { slug: "google-ads", short: "PPC", title: "Google Ads & PPC Marketing", category: "digital-marketing", image: null },
  { slug: "website", short: "WEB", title: "Website Design & Development", category: "digital-marketing", image: null },
  { slug: "logo-design", title: "Logo Design", category: "creative-branding", image: null },
  { slug: "graphic-design", title: "Graphic Design", category: "creative-branding", image: null },
  { slug: "website-content-writing", title: "Website Content Writing", category: "content-communication", image: null },
  { slug: "seo-content-writing", title: "SEO Content Writing", category: "content-communication", image: null },
  { slug: "marketing-copywriting", title: "Marketing Copywriting", category: "content-communication", image: null },
  { slug: "brand-identity-design", title: "Brand Identity Design", category: "creative-branding", image: null },
  { slug: "marketing-creatives", title: "Marketing Creatives", category: "creative-branding", image: null },
  { slug: "blog-writing", title: "Blog Writing", category: "content-communication", image: null },
  { slug: "social-media-content", title: "Social Media Content", category: "content-communication", image: null },
];

/** TODO(client): case-study client name repeats in Figma and has no imagery yet. */
export const caseStudies = [
  { id: "case-1", client: "Marcello Leigh", flow: ["Strategy", "Identity", "Print"], label: "Full Brand System" },
  { id: "case-2", client: "Marcello Leigh", flow: ["Strategy", "Identity", "Print"], label: "Full Brand System" },
] as const;

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
