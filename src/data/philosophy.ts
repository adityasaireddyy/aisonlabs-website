export type Principle = {
  index: string;
  title: string;
  body: string;
  /** Animation variant used by the Philosophy section. */
  motion: "rise" | "slide" | "blur" | "scale" | "clip";
};

export const principles: Principle[] = [
  {
    index: "01",
    title: "Start with the problem.",
    body: "Before frameworks, before features, we work to understand what an organization is actually trying to do and where it breaks.",
    motion: "rise",
  },
  {
    index: "02",
    title: "Engineer deeply.",
    body: "We care about architecture, data models and the unglamorous parts of a system, because that is where it either holds or fails.",
    motion: "slide",
  },
  {
    index: "03",
    title: "Design for people.",
    body: "Software is used by teachers, administrators, operators and teams. It should feel obvious to them, not just to us.",
    motion: "blur",
  },
  {
    index: "04",
    title: "Customize when it matters.",
    body: "Platforms scale. Custom deployments respect how an organization already works. We know when to choose which.",
    motion: "scale",
  },
  {
    index: "05",
    title: "Think beyond delivery.",
    body: "Handover is not the end. Systems keep living, so we build things that can be operated, extended and rethought.",
    motion: "clip",
  },
];
