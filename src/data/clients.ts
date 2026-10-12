/**
 * Clients.
 *
 * Two distinct relationships exist and must never be conflated:
 *  - "service"            -> organizations we design and build custom systems for.
 *  - "product-deployment" -> organizations running an Aison product (e.g. Aison Edu).
 *
 * Case-study fields are intentionally nullable. Nothing is invented here.
 * Fill `caseStudy` when a real, approved case study exists.
 */

export type ClientKind = "service" | "product-deployment";

export type CaseStudy = {
  /** One-line summary of the engagement. */
  summary: string;
  /** What was built, in plain words. */
  scope: string[];
  /** Outcomes, only if real and approved. */
  outcomes?: string[];
  /** Optional link to a full write-up. */
  href?: string;
  /** Optional cover image path under /public. */
  cover?: string;
};

export type Client = {
  slug: string;
  name: string;
  kind: ClientKind;
  /** Product name if kind === "product-deployment". */
  product?: string;
  /** Short neutral descriptor. Leave null if unknown. */
  descriptor: string | null;
  caseStudy: CaseStudy | null;
  /** Deterministic visual seed for the abstract preview. */
  seed: number;
};

export const clients: Client[] = [
  { slug: "vittbaki", name: "Vittbaki", kind: "service", descriptor: null, caseStudy: null, seed: 11 },
  { slug: "wise-forge-solutions", name: "Wise-Forge Solutions", kind: "service", descriptor: null, caseStudy: null, seed: 23 },
  { slug: "soulzaa", name: "Soulzaa", kind: "service", descriptor: null, caseStudy: null, seed: 37 },
  { slug: "alphalhub", name: "Alphalhub", kind: "service", descriptor: null, caseStudy: null, seed: 41 },
  { slug: "akshara-nexora", name: "Akshara Nexora", kind: "service", descriptor: null, caseStudy: null, seed: 53 },
  {
    slug: "mandaara-educational-trust",
    name: "Mandaara Educational Trust",
    kind: "product-deployment",
    product: "Aison Edu",
    descriptor: "Aison Edu deployment",
    caseStudy: null,
    seed: 67,
  },
];

export const serviceClients = clients.filter((c) => c.kind === "service");
export const productDeployments = clients.filter((c) => c.kind === "product-deployment");
