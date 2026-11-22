import { asset } from "@/lib/asset";
/** Home page content (Figma frame "Desktop - 26"). */

export const featuredServices = [
  {
    id: "social",
    title: "Social Media Marketing",
    body: "Build brand awareness, engage your audience and create meaningful connections through strategic social media campaigns.",
    image: asset("/images/service-social.avif"),
    color: "#da6517",
  },
  {
    id: "seo",
    title: "Search Engine Optimization (SEO)",
    body: "Improve your website's search engine visibility, attract relevant visitors and build a stronger online presence with effective SEO strategies.",
    image: asset("/images/service-seo.avif"),
    color: "#425c3b",
  },
  {
    id: "website",
    title: "Website Design & Development",
    body: "Create visually appealing, responsive and user-friendly websites that represent your brand and deliver better digital experiences.",
    image: asset("/images/service-website.avif"),
    color: "#986d46",
  },
  {
    id: "google-ads",
    title: "Google Ads & PPC Marketing",
    body: "Reach potential customers with targeted advertising campaigns designed to increase visibility, generate leads and support business goals.",
    image: asset("/images/service-google-ads.avif"),
    color: "#6a1c07",
  },
] as const;

export const whyReasons = [
  {
    title: "Creative Thinking.",
    body: "Fresh ideas and unique approaches to make your brand stand out.",
    image: asset("/images/why-creative-thinking.avif"),
  },
  {
    title: "Strategic  Approach.",
    body: "Marketing strategies planned around your business goals and target audience.",
    image: asset("/images/why-strategic-approach.avif"),
  },
  {
    title: "Customized Solutions.",
    body: "Digital marketing solutions tailored to your brand's unique requirements.",
    image: asset("/images/why-customized-solutions.avif"),
  },
  {
    title: "Growth Focused Mindset.",
    body: "A commitment to helping your business strengthen its digital presence.",
    image: asset("/images/why-growth-focused-mindset.avif"),
  },
  {
    title: "Clear Communication.",
    body: "Open communication and a collaborative approach at every stage.",
    image: asset("/images/why-clear-communication.avif"),
  },
] as const;

/** Temple build-up frames, shown in order as the process steps advance. */
export const processSteps = [
  {
    title: "Step 1 - Discover & Understand",
    body: "We learn about your business, target audience, goals and unique requirements.",
    image: { src: asset("/images/temple-step-1.avif"), w: 592, h: 195 },
  },
  {
    title: "Step 2 - Plan & Strategize",
    body: "We develop a customized digital marketing strategy aligned with your business objectives.",
    image: { src: asset("/images/temple-step-2.avif"), w: 592, h: 326 },
  },
  {
    title: "Step 3 - Create & Develop",
    body: "We bring ideas to life through creative content, engaging designs and digital solutions.",
    image: { src: asset("/images/temple-step-3.avif"), w: 592, h: 422 },
  },
  {
    title: "Step 4 - Launch & Execute",
    body: "We put the strategy into action and bring your brand to the right digital platforms.",
    image: { src: asset("/images/temple-step-4.avif"), w: 592, h: 601 },
  },
  {
    title: "Step 5 - Monitor & Improve",
    body: "We review performance, identify opportunities and refine strategies for continuous improvement.",
    image: { src: asset("/images/temple-step-5.avif"), w: 592, h: 539 },
  },
] as const;

/** Review-platform logo cards (two staggered rows of three in Figma). */
export const reviewRows = [
  [
    { id: "r46", src: asset("/images/review-46.avif"), alt: "Crunchbase", w: 272, h: 142 },
    { id: "r44", src: asset("/images/review-44.avif"), alt: "DesignRush", w: 283, h: 159 },
    null,
  ],
  [
    { id: "r48", src: asset("/images/review-clutch.avif"), alt: "Clutch", w: 194, h: 193 },
    { id: "r45", src: asset("/images/review-45.avif"), alt: "Trustpilot", w: 296, h: 155 },
    null,
  ],
] as const;
