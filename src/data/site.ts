/**
 * Site-wide configuration.
 * Everything here is editable without touching components.
 */

export const site = {
  name: "Aison Labs",
  legalName: "Aison Labs",
  tagline: "We build technology for what comes next.",
  description:
    "Aison Labs is a technology company from India. We build Aison Edu, a platform for educational institutions, and engineer custom software for organizations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aisonlabs.com",
  locale: "en_IN",
  country: "India",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@aisonlabs.com",
  keywords: [
    "Aison Labs",
    "Aison Edu",
    "technology company India",
    "software engineering India",
    "custom software development",
    "education technology India",
    "school management platform",
  ],
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Services", href: "/work" },
  { label: "Aison Edu", href: "/products/aison-edu" },
  { label: "Research", href: "/research" },
  { label: "Blog", href: "/blog" },
  { label: "Company", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export const footerGroups: { title: string; links: NavItem[] }[] = [
  { title: "Product", links: [{ label: "Aison Edu", href: "/products/aison-edu" }] },
  {
    title: "Services",
    links: [
      { label: "What we build", href: "/work" },
      { label: "How we work", href: "/work#process" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research", href: "/research" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/**
 * Social links. Managed in /admin/settings; these are only the seed values.
 * Entries with an empty href are not rendered.
 */
export const socials: { label: string; href: string }[] = [
  { label: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "" },
  { label: "X", href: process.env.NEXT_PUBLIC_SOCIAL_X ?? "" },
  { label: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "" },
  { label: "GitHub", href: process.env.NEXT_PUBLIC_SOCIAL_GITHUB ?? "" },
];

/** Company vision and mission. Draft wording based on the company's stated direction; edit freely. */
export const vision = {
  title: "Vision",
  statement: "To help change the technology landscape of India, with products and systems that are built here and built to last.",
};
export const mission = {
  title: "Mission",
  statement: "To build technology that adapts to the way organizations really work, combining product thinking, engineering and research, and to stay close to everything we deliver.",
};
