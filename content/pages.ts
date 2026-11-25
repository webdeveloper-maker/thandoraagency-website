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

export const serviceCategories = [
  { id: "all", label: "All" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "creative-branding", label: "Creative Branding" },
  { id: "content-communication", label: "Content & Communication" },
] as const;

export type ServiceCategory = Exclude<(typeof serviceCategories)[number]["id"], "all">;

export type Service = {
  slug: string;
  /** Short label above the name on the card (e.g. "SMO"). */
  short: string;
  title: string;
  category: ServiceCategory;
  /** 3D icon in public/images/services/icons/, at its Figma size (null until sent). */
  image: { src: string; w: number; h: number } | null;
  /** Card gradient, top → bottom (sampled from the Figma card). */
  color: { from: string; to: string };
};

const icon = (slug: string, w: number, h: number) => ({ src: asset(`/images/services/icons/${slug}.avif`), w, h });

/**
 * The 13 service cards of the Services page, in Figma order. The grid deals
 * them alternately into the left and right columns.
 * TODO(client): send the Blog Writing (open book) and SEO Content Writing
 * (scroll + magnifier) icons: the export had duplicates of two other icons.
 */
export const services: Service[] = [
  { slug: "smo", short: "SMO", title: "Social Media Optimization", category: "digital-marketing", image: icon("smo", 462, 374), color: { from: "#916f4e", to: "#a5896e" } },
  { slug: "seo", short: "SEO", title: "Search Engine Optimization", category: "digital-marketing", image: icon("seo", 412, 301), color: { from: "#632818", to: "#7e4c3d" } },
  { slug: "sem", short: "SEM", title: "Search Engine Marketing", category: "digital-marketing", image: icon("sem", 483, 353), color: { from: "#4b5c42", to: "#6a7962" } },
  { slug: "smm", short: "SMM", title: "Social Media Management", category: "digital-marketing", image: icon("smm", 583, 426), color: { from: "#cb6b34", to: "#d38551" } },
  { slug: "logo-design", short: "LOGO", title: "Logo Design", category: "creative-branding", image: icon("logo-design", 453, 355), color: { from: "#bd723f", to: "#c98b5f" } },
  { slug: "brand-identity-design", short: "BRAND", title: "Brand Identity Design", category: "creative-branding", image: icon("brand-identity-design", 518, 406), color: { from: "#bb503d", to: "#c56d5d" } },
  { slug: "graphic-design", short: "DESIGN", title: "Graphic Design", category: "creative-branding", image: icon("graphic-design", 518, 406), color: { from: "#4e6a55", to: "#6d8673" } },
  { slug: "marketing-creatives", short: "CREATIVE", title: "Marketing Creatives", category: "creative-branding", image: icon("marketing-creatives", 487, 382), color: { from: "#c96c35", to: "#d28552" } },
  { slug: "website-content-writing", short: "WEB", title: "Website Content Writing", category: "content-communication", image: icon("website-content-writing", 514, 403), color: { from: "#455d96", to: "#6579a8" } },
  { slug: "blog-writing", short: "BLOG", title: "Blog Writing", category: "content-communication", image: null, color: { from: "#887947", to: "#9d9166" } },
  { slug: "seo-content-writing", short: "SEO", title: "SEO Content Writing", category: "content-communication", image: null, color: { from: "#447d89", to: "#5e929c" } },
  { slug: "social-media-content", short: "SOCIAL", title: "Social Media Content", category: "content-communication", image: icon("social-media-content", 518, 406), color: { from: "#e76d48", to: "#ea8666" } },
  { slug: "marketing-copywriting", short: "COPY", title: "Marketing Copywriting", category: "content-communication", image: icon("marketing-copywriting", 524, 411), color: { from: "#742c21", to: "#8c4f46" } },
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
