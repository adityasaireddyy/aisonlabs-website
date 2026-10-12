/**
 * Aison Labs Services.
 * We build technology around the problem, not around a predefined template.
 */

export type Service = { index: string; slug: string; title: string; body: string };

export const servicesHeadline = "Need technology built around you?";
export const servicesIntro = "Aison Labs also provides IT and engineering services.";
export const servicesPositioning = "We build technology around the problem, not around a predefined template.";

export const services: Service[] = [
  { index: "01", slug: "custom-software-development", title: "Custom software development", body: "Systems designed around how a specific organization runs: its structure, its workflows, its rules." },
  { index: "02", slug: "web-applications", title: "Web applications", body: "Interfaces and applications engineered to be fast, clear and durable in a browser." },
  { index: "03", slug: "mobile-applications", title: "Mobile applications", body: "The same care, on the devices people actually carry." },
  { index: "04", slug: "enterprise-platforms", title: "Enterprise platforms", body: "Larger operational systems that many teams depend on at once." },
  { index: "05", slug: "ai-development", title: "AI development", body: "Applied intelligence inside real workflows, scoped to what it can genuinely do." },
  { index: "06", slug: "cloud-infrastructure", title: "Cloud infrastructure", body: "Environments that are understandable and operable, not just provisioned." },
  { index: "07", slug: "cybersecurity", title: "Cybersecurity", body: "Protecting systems and data as part of the engineering, not as an afterthought." },
  { index: "08", slug: "system-integration", title: "System integration", body: "Connecting the tools an organization already depends on, and making its data usable." },
  { index: "09", slug: "technology-consulting", title: "Technology consulting", body: "Honest advice on what to build, what to buy and what to leave alone." },
  { index: "10", slug: "product-engineering", title: "Product engineering", body: "Taking an idea from problem statement to a working, maintainable product." },
  { index: "11", slug: "maintenance-and-support", title: "Maintenance and support", body: "Systems keep living. We stay close to them and keep them running." },
];

export const process = [
  { i: "01", t: "Understand", d: "We start inside the problem: the people, the process, the constraints, the workarounds." },
  { i: "02", t: "Model", d: "We map the organization as it is, then design the system that fits it, not the other way round." },
  { i: "03", t: "Build", d: "Deliberate versions, engineered deeply, shipped early enough to learn from." },
  { i: "04", t: "Deploy", d: "Into real operations, with the people who will run it." },
  { i: "05", t: "Evolve", d: "Systems keep living. We stay close to them and keep reshaping." },
];
