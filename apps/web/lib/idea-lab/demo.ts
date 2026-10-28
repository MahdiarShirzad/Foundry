import type { Idea } from "./types";

/**
 * The sample idea collection for the Idea Lab presentation.
 *
 * Static and deterministic — no dates are derived from the clock, no values are
 * randomised and nothing here is read from or written to a backend. The order
 * is the default "last updated" order; the toolbar never re-sorts it.
 */
export const DEMO_IDEAS: Idea[] = [
  {
    id: "quill",
    ref: "IDEA 01",
    name: "Quill",
    headline: "A changelog that writes itself.",
    summary:
      "A release-notes workspace that turns merged work into a changelog people outside engineering can actually read.",
    problem:
      "Small product teams ship continuously, but release notes are written in a panic the night before a launch. Support learns about changes from customers. Sales hears about them last. The work exists; the meaning is missing.",
    audience:
      "Product teams of five to thirty engineers who ship every week and already live in GitHub or Linear.",
    solution:
      "Quill reads merged pull requests, groups them by user-facing outcome, and drafts a release note with an editor's pass. A human approves the story; Quill handles structure, tone, and publishing.",
    category: "Developer tools",
    tags: ["release notes", "workflow", "devtools"],
    status: "shortlisted",
    capturedAt: "2026-10-19",
    updatedAt: "2026-10-28",
    source: "Observed while shipping three small releases in one week.",
    context:
      "It started as a weekend script that summarised merged pull requests. The script was easier to read than the release it described, which felt like the actual signal.",
    openQuestions: [
      "Will teams trust a draft that reorders their work?",
      "Is the pain worth paying for, or is this a chore teams tolerate?",
      "Does the editor belong in GitHub, in Linear, or on its own?",
    ],
    notes: [
      {
        id: "quill-note-1",
        author: "Mahdyar",
        initials: "MH",
        date: "2026-10-22",
        body: "Two teams said the same thing: the changelog is written by whoever shipped last, and nobody wants to be that person. The reluctance felt sharper than the time cost.",
      },
      {
        id: "quill-note-2",
        author: "Sana",
        initials: "SK",
        date: "2026-10-24",
        body: "The strongest angle is legibility, not automation. Support and sales need a version they can forward without rewriting it first.",
      },
    ],
  },
  {
    id: "relay",
    ref: "IDEA 02",
    name: "Relay",
    headline: "Warm introductions without the awkward ask.",
    summary:
      "A structured way for early founders to ask for the one introduction that would actually move the needle.",
    problem:
      "Founders know the introduction they need, but asking for it feels transactional. Connectors want to help, yet a vague request gives them nothing to forward.",
    audience:
      "Pre-seed founders and operators with a dense, informal network and no CRM.",
    solution:
      "Relay turns a vague ask into a short, specific request: who, why, and what happens next. The connector forwards one link; both sides opt in. No contact list is shared.",
    category: "B2B SaaS",
    tags: ["network", "founders", "introductions"],
    status: "inbox",
    capturedAt: "2026-10-21",
    updatedAt: "2026-10-27",
    source: "Three intro requests, two forwards, one reply.",
    context:
      "The first version existed as a template in a founder's notes app. The template was forwarded more often than the product ever was.",
    openQuestions: [
      "Can a founder write a specific ask without sounding transactional?",
      "Does the connector need a reason to forward beyond goodwill?",
      "What reciprocity keeps the network from becoming a queue?",
    ],
    notes: [
      {
        id: "relay-note-1",
        author: "Ari",
        initials: "AR",
        date: "2026-10-26",
        body: "The ask is rarely the hard part. The hard part is giving the connector enough context to say yes without a second conversation.",
      },
    ],
  },
  {
    id: "stoop",
    ref: "IDEA 03",
    name: "Stoop",
    headline: "The tool library at the end of the street.",
    summary:
      "A neighbour-to-neighbour tool library for the drill, ladder, or steam cleaner you need twice a year.",
    problem:
      "City households own shelves of things they use twice a year, while the same items sit unused three doors away. Buying is instant; borrowing still requires knowing the right neighbour and making the right ask.",
    audience:
      "Renters and small households in dense neighbourhoods with limited storage and a shared street or building.",
    solution:
      "A small, hyperlocal inventory built around buildings and blocks rather than an abstract map. Lenders list what they are happy to share; borrowers ask for a window, not a favour.",
    category: "Consumer",
    tags: ["local", "community", "sharing"],
    status: "exploring",
    capturedAt: "2026-10-12",
    updatedAt: "2026-10-26",
    source: "A group chat, a shared hallway, and one very expensive steam cleaner.",
    context:
      "Four neighbours realised they owned the same ladder. The conversation moved from laughing about it to comparing storage space in under ten minutes.",
    openQuestions: [
      "Does trust come from proximity, or does it still need a reputation layer?",
      "What makes a lender comfortable saying yes to a stranger?",
      "Is the unit a building, a street, or a friend group?",
    ],
    notes: [
      {
        id: "stoop-note-1",
        author: "Mahdyar",
        initials: "MH",
        date: "2026-10-23",
        body: "The idea is less about stuff and more about permission. People need a social script for asking.",
      },
      {
        id: "stoop-note-2",
        author: "Ari",
        initials: "AR",
        date: "2026-10-25",
        body: "Every tool library I have seen dies on supply, not demand. The first job is making listing effortless.",
      },
    ],
  },
  {
    id: "sundial",
    ref: "IDEA 04",
    name: "Sundial",
    headline: "A day planned around energy, not hours.",
    summary:
      "A quiet planner that asks when you think best, then protects those hours from meetings.",
    problem:
      "Calendars treat every hour as interchangeable. Deep work gets the scraps between calls, then founders wonder why the thinking feels shallow by Thursday.",
    audience:
      "Solo founders and makers who control their own calendar but not their attention.",
    solution:
      "A short morning check-in shapes the day around two or three energy windows. Sundial protects the first one and negotiates the rest around existing commitments.",
    category: "Productivity",
    tags: ["focus", "calendar", "wellbeing"],
    status: "inbox",
    capturedAt: "2026-10-17",
    updatedAt: "2026-10-25",
    source: "A week of self-logged energy, kept in the margin of a notebook.",
    context:
      "The best thinking kept happening in the same two hours, and the calendar kept filling them with other people's priorities.",
    openQuestions: [
      "Can a planner ask about energy without becoming another wellness ritual?",
      "What happens when the calendar is not yours to control?",
      "Is the useful unit a day, a week, or a season?",
    ],
    notes: [
      {
        id: "sundial-note-1",
        author: "Sana",
        initials: "SK",
        date: "2026-10-24",
        body: "The restraint is the product. One question in the morning, one protected block, no dashboard to maintain.",
      },
    ],
  },
  {
    id: "tally",
    ref: "IDEA 05",
    name: "Tally",
    headline: "Research notes that compare themselves.",
    summary:
      "An interview workspace that clusters what customers said without flattening what they meant.",
    problem:
      "Teams run interviews, then lose the week to re-reading transcripts and colour-coding quotes. Themes arrive late, stripped of the context that made them credible.",
    audience:
      "Product researchers and founders who run their own customer interviews but do not have a research team.",
    solution:
      "Capture interviews, tag moments in place, and arrange themes side by side. Every claim stays attached to the quote, the person, and the moment it came from.",
    category: "Productivity",
    tags: ["research", "interviews", "synthesis"],
    status: "exploring",
    capturedAt: "2026-09-30",
    updatedAt: "2026-10-23",
    source: "Six interviews with the same confirmation problem.",
    context:
      "The useful insight was not in the summary document. It was in the third interview, when someone contradicted the first two.",
    openQuestions: [
      "Does synthesis need AI, or does it need a better place to put the quotes?",
      "Will researchers trust clusters they did not make themselves?",
      "Is the buyer the researcher or the founder reading the summary?",
    ],
    notes: [
      {
        id: "tally-note-1",
        author: "Mahdyar",
        initials: "MH",
        date: "2026-10-21",
        body: "The output teams want is not a report. It is the confidence to say 'three of six customers described this without prompting'.",
      },
      {
        id: "tally-note-2",
        author: "Jonah",
        initials: "JD",
        date: "2026-10-23",
        body: "Compare this with the clipboard workflow. The clipboard is fast because it refuses to preserve context. That is also its limit.",
      },
    ],
  },
  {
    id: "margin",
    ref: "IDEA 06",
    name: "Margin",
    headline: "Contracts, annotated in plain language.",
    summary:
      "A reading companion for freelance contracts that flags the clauses worth asking about.",
    problem:
      "Independent studios sign client contracts without counsel and without the vocabulary to negotiate. The risky clauses are rarely hidden; they are just written in a language that rewards skimming.",
    audience:
      "Freelance designers, developers, and small studios signing five to twenty client contracts a year.",
    solution:
      "A contract is read clause by clause and paired with a plain-language summary and a short list of questions to raise before signing. Margin does not give legal advice; it makes the conversation with a lawyer shorter.",
    category: "Fintech",
    tags: ["contracts", "freelance", "legal"],
    status: "exploring",
    capturedAt: "2026-10-08",
    updatedAt: "2026-10-20",
    source: "A contract that owned the work and the process, signed on a Friday.",
    context:
      "A friend understood every word individually. Together, the clauses transferred more than they intended.",
    openQuestions: [
      "Where is the line between explanation and advice?",
      "Will studios pay per contract or keep a subscription open?",
      "Does the value sit in the review, or in the negotiation script?",
    ],
    notes: [
      {
        id: "margin-note-1",
        author: "Ari",
        initials: "AR",
        date: "2026-10-19",
        body: "Freelancers do not want a legal education. They want three sentences they can send to a client before the kickoff call.",
      },
    ],
  },
  {
    id: "cinder",
    ref: "IDEA 07",
    name: "Cinder",
    headline: "Postmortems for teams without an incident process.",
    summary:
      "A lightweight way to turn a bad deploy into a durable lesson, not another document nobody reads.",
    problem:
      "Small engineering teams fix the incident and move on. The same failure returns six weeks later because the fix lived in one person's memory.",
    audience:
      "Engineering teams of five to twenty people without a dedicated reliability function.",
    solution:
      "A guided postmortem triggered after an incident: a short timeline, the contributing factors, and one owner per follow-up. Designed to take thirty minutes, not a committee.",
    category: "B2B SaaS",
    tags: ["incidents", "teams", "reliability"],
    status: "inbox",
    capturedAt: "2026-10-04",
    updatedAt: "2026-10-18",
    source: "One Friday deploy, repeated six weeks later.",
    context:
      "The first fix was a message in a channel that scrolled away by Monday. The second incident was almost identical.",
    openQuestions: [
      "Will teams write one when nobody is asking them to?",
      "Does the value show up in the follow-ups or in the conversation itself?",
      "Should this live where the deploy happened?",
    ],
    notes: [
      {
        id: "cinder-note-1",
        author: "Jonah",
        initials: "JD",
        date: "2026-10-16",
        body: "The first version should be a checklist, not a platform. If it cannot survive a tired Tuesday, it will not be used.",
      },
    ],
  },
];

export const IDEA_CATEGORIES = Array.from(
  new Set(DEMO_IDEAS.map((idea) => idea.category)),
).sort((a, b) => a.localeCompare(b));

export const IDEA_CATEGORY_OPTIONS = [
  { value: "all", label: "All categories", shortLabel: "All" },
  ...IDEA_CATEGORIES.map((category) => ({ value: category, label: category })),
];

export const IDEA_SORT_OPTIONS = [
  { value: "updated", label: "Last updated", shortLabel: "Updated" },
  { value: "captured", label: "Newest first", shortLabel: "Newest" },
  { value: "alpha", label: "A–Z" },
  { value: "status", label: "Status" },
];

export const IDEA_STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "inbox", label: "Inbox" },
  { value: "exploring", label: "Exploring" },
  { value: "shortlisted", label: "Shortlisted" },
] as const;
