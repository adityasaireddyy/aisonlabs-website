/**
 * Research seed content.
 *
 * Research articles live in the database and are managed from /admin/research.
 * This file only defines the category list and the launch essays used to seed
 * an empty database (converted to markdown by `seedArticles()`).
 */

export const researchCategories = [
  "Artificial Intelligence",
  "Education Technology",
  "Software Architecture",
  "Product Engineering",
  "Emerging Technology",
  "Systems",
  "Experiments",
] as const;

export type ResearchCategory = (typeof researchCategories)[number];

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string };

type SeedArticle = {
  slug: string;
  number: string;
  title: string;
  dek: string;
  category: ResearchCategory;
  date: string;
  body: Block[];
};

const launchEssays: SeedArticle[] = [
  {
    slug: "software-should-adapt-to-the-organization",
    number: "001",
    title: "Software should adapt to the organization, not the other way around.",
    dek: "Most organizational software quietly asks people to reorganize themselves around it. We think that is backwards.",
    category: "Systems",
    date: "2026-07-14",
    body: [
      { type: "p", text: "Walk into almost any organization that has adopted a large software system and you will find a second, invisible system running alongside it: the spreadsheets, the group chats, the paper registers and the workarounds that people use to do what the software would not let them do." },
      { type: "p", text: "That shadow system is not a failure of the people. It is a signal. It shows exactly where the software's model of the organization and the organization's model of itself disagree." },
      { type: "h2", text: "Rigid software has a cost that never appears on an invoice" },
      { type: "p", text: "When software is rigid, every mismatch becomes a small tax paid daily by the people doing the work. A department that does not fit the dropdown. A process with one extra approval step. A term calendar that does not match the academic year. Each of these is minor. Together they decide whether a system is used or merely tolerated." },
      { type: "quote", text: "No organization should have to reshape itself around rigid software." },
      { type: "h2", text: "Platform and customization are not opposites" },
      { type: "p", text: "The usual answer is a choice: buy a platform and accept its constraints, or build something custom and accept the cost. We think the more interesting answer is a platform that is designed from the start to be shaped. Shared infrastructure where it makes sense. Custom deployment where the organization's own logic matters." },
      { type: "list", items: ["Model the organization's real structure, not an idealized one.", "Treat workflows as data that can change, not code that must be rewritten.", "Make customization a first-class path, not an exception.", "Keep the parts that benefit from scale shared across deployments."] },
      { type: "p", text: "This is the philosophy behind how we build Aison Edu and, more broadly, how we approach every system we design. It is harder to engineer. It is also the only version that respects the people using it." },
    ],
  },
  {
    slug: "what-an-institution-actually-runs-on",
    number: "002",
    title: "What an educational institution actually runs on.",
    dek: "Before building for education, you have to look at the operational reality underneath the classroom.",
    category: "Education Technology",
    date: "2026-07-28",
    body: [
      { type: "p", text: "Education technology often begins with the learner: the app, the content, the assessment. That is important. But an institution is also an organization with staff, schedules, admissions, records, finance, facilities and a constant stream of small decisions. When those operational layers are weak, the learning layer struggles regardless of how good it is." },
      { type: "h2", text: "The unglamorous layer" },
      { type: "p", text: "Timetables that change mid-term. Records that live in three places. Staff who wear several roles. Reporting that is assembled by hand at the end of every cycle. These are the everyday problems that consume an institution's attention, and they are exactly the problems software is good at when it is designed around how the institution works." },
      { type: "h2", text: "Infrastructure, not a feature list" },
      { type: "p", text: "We use the word infrastructure deliberately. Infrastructure is what everything else stands on. It has to be reliable, understandable and adaptable to the specifics of each institution, because no two are organized the same way." },
      { type: "note", text: "This piece describes a design perspective, not a specification of any particular product's capabilities." },
      { type: "p", text: "Getting the operational layer right is slow, careful work. It rarely makes headlines. But it is what allows an institution to spend its energy on teaching instead of administration, and that is where we believe technology earns its place." },
    ],
  },
  {
    slug: "engineering-for-organizations-that-are-still-changing",
    number: "003",
    title: "Engineering for organizations that are still changing.",
    dek: "Notes on building systems whose requirements are, honestly, not finished.",
    category: "Software Architecture",
    date: "2026-08-11",
    body: [
      { type: "p", text: "The most common false assumption in software projects is that requirements are a fixed input. In practice, organizations discover what they need by using something. The first version of a system is a question, not an answer." },
      { type: "h2", text: "Design for the second version" },
      { type: "p", text: "If change is certain, the architecture's job is to make change cheap. That shifts priorities: clear domain boundaries over clever abstractions, explicit data models over implicit ones, and configuration where the organization's own rules are likely to move." },
      { type: "list", items: ["Separate what the organization is from what it does. Structure changes slowly; workflows change often.", "Keep integration points thin so a module can be replaced without unpicking everything around it.", "Prefer boring, well-understood infrastructure for the parts that must not fail.", "Instrument the system so the next decision is made on evidence."] },
      { type: "h2", text: "Ship, observe, reshape" },
      { type: "p", text: "The working rhythm this implies is not a long build followed by a launch. It is a sequence of deliberate versions, each one observed closely in real use, each one reshaping the next. That rhythm is only possible when the engineering underneath was built to be revisited." },
      { type: "quote", text: "The first version of a system is a question, not an answer." },
    ],
  },
  {
    slug: "where-ai-belongs-in-organizational-software",
    number: "004",
    title: "Where AI belongs in organizational software, and where it does not.",
    dek: "A cautious view from a team more interested in useful systems than impressive demos.",
    category: "Artificial Intelligence",
    date: "2026-08-25",
    body: [
      { type: "p", text: "It is now easy to attach a language model to almost anything. It is much harder to know where it makes a system genuinely better for the people relying on it. We would rather be slow and right here than fast and decorative." },
      { type: "h2", text: "Good fits" },
      { type: "list", items: ["Turning unstructured input into structured records that a person then confirms.", "Summarizing across many records so a decision-maker sees the shape of things.", "Helping people find and understand what a system already knows.", "Drafting, where the human remains the author."] },
      { type: "h2", text: "Poor fits" },
      { type: "list", items: ["Silent automation of decisions with real consequences for people.", "Any flow where the model's confidence is presented as certainty.", "Replacing clear, deterministic workflows that already work."] },
      { type: "p", text: "Our research interest is in the first list. Specifically, in how AI-assisted features can sit inside operational systems with clear boundaries, visible provenance and a human in control. That is where we are running experiments, and we will write about what we learn, including what does not work." },
      { type: "note", text: "This is a statement of research direction. It does not describe shipped functionality." },
    ],
  },
  {
    slug: "small-teams-first-principles",
    number: "005",
    title: "Small teams and first principles.",
    dek: "Why being early is a working advantage and not only a stage to get through.",
    category: "Product Engineering",
    date: "2026-09-01",
    body: [
      { type: "p", text: "A small team cannot outspend anyone. It can out-think and out-learn, and it can change its mind in an afternoon. That is a real advantage as long as it is used deliberately." },
      { type: "h2", text: "What first principles means in practice" },
      { type: "p", text: "It means refusing to inherit a default because it is common. It means asking what a timetable, a record or a workflow actually is before deciding how it should look in software. Most of the time the conventional answer survives the question. Sometimes it does not, and those are the moments where a product becomes distinct." },
      { type: "h2", text: "Rules we try to keep" },
      { type: "list", items: ["Talk to the people doing the work before designing the work.", "Build the smallest version that can be genuinely used, then watch it closely.", "Write down what we assumed so we can notice when it was wrong.", "Keep the team close to the system in production."] },
      { type: "p", text: "We are early. We do not pretend otherwise. But the habits formed now are the ones a larger company will inherit, so we are choosing them carefully." },
    ],
  },
];

function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.text}`;
        case "quote":
          return `> ${b.text}`;
        case "list":
          return b.items.map((it, i) => `${i + 1}. ${it}`).join("\n");
        case "note":
          return `> **Note:** ${b.text}`;
        default:
          return b.text;
      }
    })
    .join("\n\n");
}

export function seedArticles() {
  return launchEssays.map((a) => ({
    slug: a.slug,
    number: a.number,
    title: a.title,
    dek: a.dek,
    category: a.category,
    markdown: blocksToMarkdown(a.body),
    status: "published" as const,
    date: `${a.date}T00:00:00.000Z`,
  }));
}
