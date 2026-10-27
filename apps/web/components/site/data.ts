/**
 * The eight Foundry stages — single source of truth for the hero cycle
 * diagram, the stage ledger, and the documentation reference page.
 * Copy condensed from the repository README.
 */
export type Stage = {
  id: string;
  name: string;
  verb: string;
  tagline: string;
  detail: string;
  bullets: string[];
  /** Where this stage's evidence hands off next in the cycle. */
  next: string;
};

export const STAGES: Stage[] = [
  {
    id: "01",
    name: "Idea Lab",
    verb: "Capture",
    tagline: "Where ideas take shape.",
    detail:
      "Capture early-stage concepts and turn unstructured thoughts into structured product opportunities.",
    bullets: [
      "Capture and organize startup ideas",
      "Define the problem, audience, and solution",
      "Document assumptions and value propositions",
      "Compare and prioritize competing ideas",
    ],
    next: "02 Market Intelligence",
  },
  {
    id: "02",
    name: "Market Intelligence",
    verb: "Investigate",
    tagline: "Understand the market before entering it.",
    detail:
      "Investigate the environment your product will compete in — segments, competitors, opportunities and threats.",
    bullets: [
      "Define target markets and customer segments",
      "Research competitors and alternatives",
      "Identify opportunities and potential threats",
      "Turn research into actionable insights",
    ],
    next: "03 Validation Lab",
  },
  {
    id: "03",
    name: "Validation Lab",
    verb: "Validate",
    tagline: "Test assumptions before investing heavily.",
    detail:
      "Test whether the idea addresses a real problem before committing serious time or money.",
    bullets: [
      "Define hypotheses and validation criteria",
      "Design experiments and customer interviews",
      "Collect and track evidence and findings",
      "Make evidence-informed go, pivot, or stop calls",
    ],
    next: "04 MVP Studio",
  },
  {
    id: "04",
    name: "MVP Studio",
    verb: "Build",
    tagline: "Turn validated ideas into tangible products.",
    detail:
      "Define a focused path from a validated concept to a product that delivers its core value.",
    bullets: [
      "Define MVP scope and essential features",
      "Separate must-haves from future work",
      "Connect requirements to validated problems",
      "Keep the first release focused on core value",
    ],
    next: "05 Product Roadmap",
  },
  {
    id: "05",
    name: "Product Roadmap",
    verb: "Plan",
    tagline: "Give the product a clear direction.",
    detail:
      "Translate product goals into an evolving, prioritized plan of milestones and phases.",
    bullets: [
      "Define milestones and product objectives",
      "Prioritize features and improvements",
      "Organize work into development phases",
      "Adapt the roadmap as new evidence emerges",
    ],
    next: "06 Launch Center",
  },
  {
    id: "06",
    name: "Launch Center",
    verb: "Launch",
    tagline: "Prepare the product to meet the world.",
    detail:
      "Coordinate everything required to introduce the product to its target audience.",
    bullets: [
      "Define launch objectives and audiences",
      "Organize launch tasks and milestones",
      "Plan positioning and messaging",
      "Track launch and post-launch actions",
    ],
    next: "07 Feedback Hub",
  },
  {
    id: "07",
    name: "Feedback Hub",
    verb: "Listen",
    tagline: "Turn real user experiences into improvements.",
    detail:
      "Create a structured connection between real user experiences and product decisions.",
    bullets: [
      "Collect and organize user feedback",
      "Identify recurring problems and requests",
      "Categorize feedback by topic and priority",
      "Connect feedback to product decisions",
    ],
    next: "08 Founder Analytics",
  },
  {
    id: "08",
    name: "Founder Analytics",
    verb: "Learn",
    tagline: "Make decisions with evidence, not guesswork.",
    detail:
      "Bring product and startup signals together so decisions rest on evidence, not guesswork.",
    bullets: [
      "Monitor product and startup metrics",
      "Track progress against objectives",
      "Analyze feedback and performance trends",
      "Use insights to guide the next iteration",
    ],
    next: "01 Idea Lab — insights & iteration",
  },
];

/** Who Foundry is for — shared by the landing page and the About page. */
export const AUDIENCES: [string, string, string][] = [
  ["01", "Aspiring founders", "Turning early ideas into structured opportunities."],
  ["02", "Indie hackers", "Looking for a more organized product-building workflow."],
  ["03", "Startup teams", "Coordinating research, validation and execution."],
  ["04", "Product builders", "Wanting decisions grounded in customer evidence."],
  ["05", "Entrepreneurs", "Managing the journey from concept to launch and beyond."],
];