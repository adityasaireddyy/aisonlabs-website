/**
 * Aison Labs products.
 *
 * Only products that are live appear on the website. Today that is one:
 * Aison Edu, in full rollout. Add a product here only when it is live and
 * has a real deployment; nothing planned or in development is listed.
 */

export type Product = {
  slug: string;
  name: string;
  /** Current major version, shown next to the name. */
  version: string;
  category: string;
  /** Shown verbatim next to the product name. */
  statusLabel: string;
  tagline: string;
  description: string;
  summary: string;
  deployments: { name: string; slug: string }[];
  seo: { title: string; description: string };
};

export const aisonEdu: Product = {
  slug: "aison-edu",
  name: "Aison Edu",
  version: "V2",
  category: "Education technology",
  statusLabel: "Live · Full rollout",
  tagline: "Education infrastructure, re-engineered.",
  description:
    "Aison Edu is an adaptable technology platform for modern educational institutions. It is available as a common platform institutions can onboard onto themselves, and as an institutional deployment shaped around one institution's workflows.",
  summary: "An adaptable platform for educational institutions, in full rollout.",
  deployments: [{ name: "Mandaara Educational Trust", slug: "mandaara-educational-trust" }],
  seo: {
    title: "Aison Edu",
    description:
      "Aison Edu is an adaptable technology platform for modern educational institutions, built by Aison Labs and in full rollout, available as a common platform or an institutional deployment.",
  },
};

export const products: Product[] = [aisonEdu];

export function productHref(p: Pick<Product, "slug">): string {
  return `/products/${p.slug}`;
}

/* ------------------------------------------------------------------ */
/* Aison Edu specifics                                                 */
/* ------------------------------------------------------------------ */

export type EduModuleGroup = { id: string; label: string; body: string; modules: string[] };

/**
 * The modules in Aison Edu V2, grouped the way the product groups them.
 * Taken from the running product; update this list when the product changes.
 */
export const eduModuleGroups: EduModuleGroup[] = [
  {
    id: "academics",
    label: "Academics",
    body: "Admissions, the academic structure, timetables, registers and exams, all attached to the same classes and sections.",
    modules: ["Students", "Student lifecycle", "Classes and subjects", "Timetable", "Attendance", "Exams and results"],
  },
  {
    id: "people",
    label: "People",
    body: "Everyone the school depends on, and the accounts they sign in with.",
    modules: ["Parents and guardians", "Teachers", "Attenders", "Stationery managers", "Hostel wardens", "Documents"],
  },
  {
    id: "finance",
    label: "Finance",
    body: "Fee plans, payments and daily collections, calculated from the payments themselves.",
    modules: ["Fees", "Daily collections", "Stationery accounts"],
  },
  {
    id: "operations",
    label: "Operations",
    body: "The day-to-day running of a campus, in the same system as everything else.",
    modules: ["Inventory", "Gate pass", "Library", "Hostel", "Transport", "Live buses"],
  },
  {
    id: "communication",
    label: "Communication",
    body: "Messages from families, announcements to each role, and WhatsApp messages to parents.",
    modules: ["Messages", "Announcements", "WhatsApp messages"],
  },
  {
    id: "insight",
    label: "Insight",
    body: "Reports that download as PDF and spreadsheet, and an assistant that answers from the school's own records.",
    modules: ["Reports", "AI assistant"],
  },
];

/**
 * Aison Edu V2 mobile app. Available for every role except administration,
 * which stays on the web.
 */
export const eduMobile = {
  released: true,
  title: "A mobile app for every role.",
  body: "Aison Edu V2 comes with a mobile app for the people who use the system away from a desk. Administration stays on the web, where the full system is managed.",
  roles: ["Parents", "Teachers", "Hostel wardens", "Attenders", "Bus drivers"],
  parentFeatures: ["Where the bus is", "Attendance", "Timetable", "Results", "Fees", "Stationery account", "Library", "Transport", "Hostel", "Marks memo", "Documents", "Notices", "Messages to teachers", "Assistant"],
};

/**
 * Bus routes and live maps. Described from what the product does: routes are
 * placed on a Mapbox map with a road-following line; live buses appear while a
 * driver's trip is running.
 */
export const eduTransport = {
  title: "Bus routes and live maps.",
  body: "Transport is part of the same system as everything else. Routes are drawn on a real map, and while a bus is on the road, the school office and families can see where it is.",
  points: [
    { t: "Routes on the map", d: "Each route is a numbered set of stops, placed on the map and joined by a line that follows the roads. Drag a pin to move a stop, and the order is the order the bus makes them." },
    { t: "Live buses", d: "When a driver starts a trip, the bus appears on the live map. It leaves the map when the trip ends, and the view refreshes every ten seconds." },
    { t: "Honest when a bus goes quiet", d: "A bus that stops reporting stays on the map in grey, with how long since it was last heard from, rather than drifting on as if it were still moving." },
    { t: "For families", d: "In the parent app, a child's bus is shown on the road for the length of the trip, and nothing about where it has been afterwards. No arrival times are promised." },
    { t: "For drivers", d: "Drivers have their own role in the mobile app, for their route and their trips. Their phone shares its location only while a trip is running." },
  ],
};

export type EduModel = {
  id: "platform" | "institutional";
  label: string;
  kind: string;
  concept: string;
  body: string;
  flow: string[];
  adapts?: string[];
};

/** Two deployment models, not two pricing plans. */
export const eduModels: EduModel[] = [
  {
    id: "platform",
    label: "Platform",
    kind: "Common platform",
    concept: "Ready to use. Ready to scale.",
    body:
      "Institutions onboard themselves and use Aison Edu as it is. The parts that benefit from scale stay common across every institution.",
    flow: ["Discover", "Onboard", "Configure", "Use Aison Edu"],
  },
  {
    id: "institutional",
    label: "Institutional",
    kind: "Custom deployment",
    concept: "Your institution. Your workflows. Your Aison Edu.",
    body:
      "Everything is customizable. Aison Labs works with the institution to understand its requirements, then reshapes the web system and the mobile app before deploying them around how the institution actually runs.",
    flow: ["Understand", "Reshape", "Customize", "Deploy"],
    adapts: ["Workflows", "Interfaces", "Modules", "Roles and permissions", "Reports", "Integrations", "Mobile app", "Branding", "Optional add-ons"],
  },
];
