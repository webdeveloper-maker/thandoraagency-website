/**
 * Site-wide content. Copy matches the Figma frames word for word.
 * Contact details marked TODO are placeholders in Figma and still need
 * confirming with the client before launch.
 */

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Work", href: "/services/#work" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;

export const contact = {
  // TODO(client): Figma mixes "tandora" and "thandora" — confirm the real inbox.
  email: "hello@tandora.agency",
  // TODO(client): Figma shows "@tandora.agency" as the phone number placeholder.
  phoneLabel: "@tandora.agency",
  phone: null as string | null,
  location: "Chennai , Tamil Nadu",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Chennai%2C+Tamil+Nadu",
} as const;

export const socials = [
  {
    id: "instagram",
    label: "INSTAGRAM",
    footerLabel: "Instagram",
    handle: "@tandora.agency",
    href: "https://www.instagram.com/tandora.agency",
    icon: "/images/icon-instagram.svg",
    iconSize: { w: 41, h: 41 },
  },
  {
    id: "facebook",
    label: "FACEBOOK",
    footerLabel: "Facebook",
    handle: "@tandora.agency",
    href: "https://www.facebook.com/tandora.agency",
    icon: "/images/icon-facebook.svg",
    iconSize: { w: 41, h: 41 },
  },
  {
    id: "x",
    label: "X / TWITTER",
    footerLabel: "X / Twitter",
    handle: "@tandora",
    href: "https://x.com/tandora",
    icon: "/images/icon-x.svg",
    iconSize: { w: 40, h: 46 },
  },
] as const;

export const footer = {
  tagline: ["Build the brand", "people remember."],
  columns: [
    {
      title: "Navigation",
      links: nav.map((n) => ({ label: n.label, href: n.href })),
    },
    {
      title: "Services",
      links: [
        { label: "Strategy", href: "/services/?category=digital-marketing" },
        { label: "Identity", href: "/services/?category=creative-branding" },
        { label: "Experience", href: "/services/" },
        { label: "Marketing", href: "/services/?category=content-communication" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: contact.email, href: `mailto:${contact.email}` },
        { label: "Instagram", href: socials[0].href },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/tandora-agency" },
        { label: "X / Twitter", href: socials[2].href },
      ],
    },
  ],
} as const;
