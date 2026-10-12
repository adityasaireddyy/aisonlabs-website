/** Detail copy for each service page. Describes how we work; makes no claims about past clients or results. */

export type ServiceDetail = {
  lead: string;
  builds: string[];
  fits: string[];
  approach: string[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "custom-software-development": {
    lead: "When an organization's own rules and structure matter more than a template, we design and build the system around them.",
    builds: ["Internal operations systems", "Workflow and approval tools", "Role-based portals for staff, customers or partners", "Reporting built on your own records"],
    fits: ["Off-the-shelf software forces workarounds", "Several spreadsheets and tools hold one process together", "The process is specific to your organization"],
    approach: ["Start by mapping how work really happens", "Model the data and roles before any screen is drawn", "Ship in deliberate versions you can use early"],
  },
  "web-applications": {
    lead: "Fast, clear applications that run in the browser and stay maintainable as they grow.",
    builds: ["Dashboards and admin consoles", "Customer-facing portals", "Public websites with a content system behind them", "Forms, bookings and onboarding flows"],
    fits: ["You need a product people can use without installing anything", "Your current web tool is slow or hard to change", "Content needs to be managed by non-developers"],
    approach: ["Accessible, responsive interfaces by default", "Performance treated as a requirement, not a polish step", "Clean structure so the next developer can continue"],
  },
  "mobile-applications": {
    lead: "Mobile apps built with the same care as the web, for the devices people actually carry.",
    builds: ["Apps for staff working in the field", "Apps for customers, parents or members", "Companion apps for an existing web platform", "Notifications and offline-friendly flows"],
    fits: ["Your users are on the move or on the floor, not at a desk", "A web app exists and needs a proper mobile counterpart", "Different roles need different views of the same data"],
    approach: ["Design around one task per screen", "Share the same backend as your web system", "Roll out by role so each group gets what it needs"],
  },
  "enterprise-platforms": {
    lead: "Larger operational systems that many teams depend on at the same time, designed so they can keep growing.",
    builds: ["Multi-team operational platforms", "Role and permission models", "Audit trails and approval chains", "Data models that stay consistent across departments"],
    fits: ["Many departments share the same records", "Access and accountability must be controlled precisely", "The system has to outlast its first release"],
    approach: ["Model the organization first, then the software", "Separate concerns so modules can change independently", "Plan for administration, not only the happy path"],
  },
  "ai-development": {
    lead: "Applied intelligence placed inside real workflows, scoped to what it can genuinely do.",
    builds: ["Assistants that answer questions over your own data", "Document and text processing", "Search and summarisation inside existing tools", "Automation of repetitive review steps"],
    fits: ["A workflow has clear inputs and a person who checks the output", "You want AI inside the tools you already use", "You want an honest view of what AI can and cannot do here"],
    approach: ["Start from the problem, then decide if AI belongs", "Keep a person in the loop where it matters", "Be explicit about limits, errors and data handling"],
  },
  "cloud-infrastructure": {
    lead: "Environments that are understandable and operable, not just provisioned.",
    builds: ["Hosting and deployment pipelines", "Staging and production environments", "Backups and recovery plans", "Monitoring and alerting"],
    fits: ["Deployments are manual or fragile", "Nobody is sure how the system is hosted", "You want costs and risks to be visible"],
    approach: ["Document what is built and why", "Automate repeatable steps", "Prefer simple, well understood setups over clever ones"],
  },
  cybersecurity: {
    lead: "Protecting systems and data as part of the engineering, not as an afterthought.",
    builds: ["Authentication and access control design", "Security reviews of applications", "Secure handling of sensitive records", "Hardening of hosting and configuration"],
    fits: ["The system holds personal or financial information", "You need a second look before launch", "Access is shared more widely than it should be"],
    approach: ["Least privilege by default", "Review code and configuration together", "Report findings plainly with a clear order of priority"],
  },
  "system-integration": {
    lead: "Connecting the tools an organization already depends on, and making its data usable.",
    builds: ["Connections between existing systems", "Data import and migration", "Messaging and notification links", "A single view over scattered records"],
    fits: ["The same data is entered in several places", "Tools do not talk to each other", "You are moving from an old system to a new one"],
    approach: ["Map every source of truth first", "Migrate in checked stages", "Keep the old system available until the new one is trusted"],
  },
  "technology-consulting": {
    lead: "Honest advice on what to build, what to buy and what to leave alone.",
    builds: ["Technology reviews and recommendations", "Scoping and planning for new systems", "Build-or-buy comparisons", "Roadmaps that fit your team and budget"],
    fits: ["You are about to invest in a system and want a second opinion", "A project has stalled and needs a clear plan", "You need a plain-language view of the options"],
    approach: ["Listen before recommending", "Say clearly when something should not be built", "Leave you with a plan you can act on"],
  },
  "product-engineering": {
    lead: "Taking an idea from problem statement to a working, maintainable product.",
    builds: ["First versions of new products", "Product architecture and data models", "Design and engineering in one team", "Release planning after launch"],
    fits: ["You have an idea and need it built properly", "A prototype needs to become a real product", "You want one team across design and engineering"],
    approach: ["Define the problem before the solution", "Build the smallest version that teaches something", "Engineer for the second year, not only the first demo"],
  },
  "maintenance-and-support": {
    lead: "Systems keep living. We stay close to them and keep them running.",
    builds: ["Bug fixes and updates", "Dependency and security upkeep", "Small feature additions", "Monitoring and incident response"],
    fits: ["A system is in daily use and cannot be down", "The original developers are no longer available", "You want a steady partner rather than a one-off project"],
    approach: ["Clear channels for reporting issues", "Regular, small changes over rare large ones", "Written notes so knowledge stays with you"],
  },
};
