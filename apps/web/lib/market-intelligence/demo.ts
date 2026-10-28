import type { MarketIdea } from "./types";

/**
 * Static sample research for the Market Intelligence workspace.
 *
 * The three ideas match the Idea Lab sample set. Competitor websites use the
 * reserved `.example` domain and every source label is illustrative. Nothing
 * here was fetched, scraped, scored or verified by the platform.
 */
export const DEMO_MARKET_IDEAS: MarketIdea[] = [
  {
    id: "quill",
    ref: "IDEA 01",
    name: "Quill",
    headline: "A changelog that writes itself.",
    summary:
      "A release-notes workspace that turns merged work into a changelog people outside engineering can actually read.",
    hypothesis:
      "Small product teams would pay to make releases legible, but the real bottleneck is editorial judgment — not drafting speed.",
    targetAudience:
      "Product leads at SaaS teams of 10–50 people who ship weekly and already work in GitHub or Linear.",
    problem:
      "Release notes are written late, by whoever shipped last, and rarely reach support or sales in a form they can reuse.",
    competitiveSummary:
      "Most tools automate a draft from merged work. Fewer help a team decide what the release means, who should hear it, and how it gets forwarded internally.",
    updatedAt: "2026-10-28",
    openQuestions: [
      "Is the buyer the product lead, the support lead, or whoever owns the release?",
      "Will teams trust a draft that reorders and rewrites their work?",
      "Does the editor need to live inside GitHub, or can it stand alone?",
      "What would make a changelog worth forwarding rather than skimming?",
    ],
    competitors: [
      {
        id: "q-c1",
        name: "ReleaseNote",
        category: "Release communication",
        website: "releasenote.example",
        description:
          "A hosted changelog that drafts entries from merged pull requests and publishes them to a public page.",
        audience: "Product and engineering teams at 10–100 people.",
        pricing: "$29 / month per workspace · sample pricing",
        strengths: [
          "Clear public changelog with a familiar reading experience.",
          "Drafting flow connects directly to merged work.",
        ],
        weaknesses: [
          "The published result still reads like a list of engineering changes.",
          "Internal forwarding and approval are largely manual.",
        ],
        differentiation:
          "Quill should compete on editorial framing and internal reach, not on the number of integrations.",
        observations: [
          "Their sample changelog leads with feature names rather than customer outcomes.",
          "Pricing is published openly, which makes the entry point easy to compare.",
        ],
        questions: [
          "Do their customers edit the generated draft, or publish it as-is?",
          "Is the public page the product, or a by-product of the drafting workflow?",
        ],
        status: "reviewed",
        evidence: "observation",
        updatedAt: "2026-10-27",
      },
      {
        id: "q-c2",
        name: "ShipNote",
        category: "Developer tooling",
        website: "shipnote.example",
        description:
          "A lightweight release workflow that turns a milestone into a short note for the team and a longer post for customers.",
        audience: "Engineering-led startups shipping several times a week.",
        pricing: "Not published · sample profile",
        strengths: [
          "Two audiences are treated as separate outputs from one source.",
          "The workflow starts at the milestone, before the release is cut.",
        ],
        weaknesses: [
          "The product appears closer to a writing prompt than a durable workspace.",
          "No visible support for approval or internal distribution.",
        ],
        differentiation:
          "Quill can win by owning the handoff from engineering language to customer language, with a clear review step.",
        observations: [
          "The sample positioning is closer to developer productivity than customer communication.",
          "Their strongest idea is the split between internal and external notes.",
        ],
        questions: [
          "Who owns the external note once the release ships?",
          "Is there a review history, or only a final published version?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-24",
      },
      {
        id: "q-c3",
        name: "Cycle Brief",
        category: "Project planning add-on",
        website: "cyclebrief.example",
        description:
          "A planning add-on that summarises completed cycles into a short update for stakeholders.",
        audience: "Product operations and team leads using cycle-based planning.",
        pricing: "Bundled with a planning plan · sample profile",
        strengths: [
          "Fits an existing planning ritual instead of adding a new one.",
          "Summaries are tied to the work that was actually completed.",
        ],
        weaknesses: [
          "The output is aimed at internal stakeholders, not customers.",
          "No public changelog or customer-facing publishing surface.",
        ],
        differentiation:
          "Quill should not compete as a planning add-on. The release moment and the customer audience are the sharper wedge.",
        observations: [
          "The product is sold as a reporting convenience, not a communication tool.",
          "The sample page emphasises time saved rather than clarity gained.",
        ],
        questions: [
          "Do teams reuse the cycle summary as a release note?",
          "What happens when a cycle ends without a customer-facing change?",
        ],
        status: "not-researched",
        evidence: "needs-research",
        updatedAt: "2026-10-21",
      },
      {
        id: "q-c4",
        name: "Plainly",
        category: "Docs & knowledge",
        website: "plainly.example",
        description:
          "A writing workspace for product docs that offers plain-language rewrites and reusable snippets.",
        audience: "Product marketers and technical writers.",
        pricing: "Free tier, then $18 / seat / month · sample pricing",
        strengths: [
          "Strong emphasis on plain language and consistent tone.",
          "Reusable snippets make repeat explanations cheaper.",
        ],
        weaknesses: [
          "Not connected to the release workflow or merged work.",
          "Requires someone to remember to write the note at all.",
        ],
        differentiation:
          "Quill can bring Plainly's editorial standard into the release moment, where the context already exists.",
        observations: [
          "Their writing guidance is the most concrete part of the sample material.",
          "The product assumes a dedicated writer, which most small teams do not have.",
        ],
        questions: [
          "Would a small team adopt this just for release notes?",
          "Is plain-language editing a feature or the whole product?",
        ],
        status: "in-progress",
        evidence: "unverified",
        updatedAt: "2026-10-23",
      },
    ],
    segments: [
      {
        id: "q-s1",
        name: "Product leads at small SaaS teams",
        description:
          "The person who owns the release narrative, often a PM or founder, with no dedicated writer on the team.",
        customerType: "Buyer · editor",
        painPoints: [
          "Release notes are written in a rush the night before a launch.",
          "The output is too technical for customers and too thin for sales.",
          "Nobody wants to be the person who writes the changelog.",
        ],
        alternatives: [
          "A shared document updated by whoever shipped last.",
          "A public changelog tool with minimal editing.",
          "Skipping the note and announcing only major releases.",
        ],
        needs: [
          "A draft that preserves the meaning of the work.",
          "An editorial pass that does not require a writer.",
          "Confidence that the final note is accurate.",
        ],
        questions: [
          "How much editing is acceptable before the tool feels like extra work?",
          "Does this person control the budget for a release tool?",
        ],
        status: "reviewed",
        evidence: "observation",
        updatedAt: "2026-10-27",
      },
      {
        id: "q-s2",
        name: "Support & success teams",
        description:
          "The internal readers who need to know what changed before customers ask, but rarely write the note themselves.",
        customerType: "Reader · internal distributor",
        painPoints: [
          "They learn about changes from customers rather than from the release.",
          "Engineering notes require rewriting before they can be forwarded.",
          "Recurring questions are answered in private threads that disappear.",
        ],
        alternatives: [
          "A release channel in chat that scrolls away.",
          "Manual summaries pasted into a support wiki.",
          "Asking an engineer directly for context.",
        ],
        needs: [
          "A short version they can forward without editing.",
          "Enough context to answer the first follow-up question.",
          "A reliable place to find the latest change.",
        ],
        questions: [
          "Would support pay for this separately from the product team?",
          "What level of detail is actually useful in a forwarded note?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-25",
      },
      {
        id: "q-s3",
        name: "Solo maintainers",
        description:
          "Independent developers maintaining a small product or open-source project with an audience but no team.",
        customerType: "User · occasional writer",
        painPoints: [
          "Release notes compete with shipping time and rarely get written.",
          "There is no one else to review or improve the draft.",
          "The audience is small enough that skipping feels acceptable.",
        ],
        alternatives: [
          "A one-line note in a repository release.",
          "A social post written from memory.",
          "No release note at all.",
        ],
        needs: [
          "A draft that requires almost no editing.",
          "A publishing step that fits an existing habit.",
          "A reason to believe the note matters.",
        ],
        questions: [
          "Is this segment willing to pay, or only to use a free tool?",
          "Does a solo maintainer care about internal distribution at all?",
        ],
        status: "not-researched",
        evidence: "needs-research",
        updatedAt: "2026-10-20",
      },
    ],
    opportunities: [
      {
        id: "q-o1",
        title: "A release note nobody wants to write",
        description:
          "Own the release moment with a draft that reads like a person wrote it, then ask for one editorial decision instead of a blank page.",
        segmentId: "q-s1",
        problem:
          "The note is written late by whoever shipped last, and the reluctance is sharper than the time cost.",
        alternatives:
          "A shared document, a public changelog tool, or skipping the note entirely.",
        differentiation:
          "Editorial framing plus a single review step, rather than more automation.",
        noteId: "q-n1",
        questions: [
          "Does the draft need to be perfect, or only good enough to edit?",
          "Which editorial decisions can be reduced to one choice?",
        ],
        status: "investigating",
        evidence: "observation",
        updatedAt: "2026-10-27",
      },
      {
        id: "q-o2",
        title: "A changelog support can forward",
        description:
          "Treat support and success as first-class readers: a short internal version that can be forwarded without rewriting.",
        segmentId: "q-s2",
        problem:
          "Support learns about changes from customers, then rewrites engineering notes into something sendable.",
        alternatives:
          "Chat release channels, manual wiki summaries, or asking an engineer.",
        differentiation:
          "Two outputs from one source: a customer note and a forwardable internal brief.",
        noteId: "q-n4",
        questions: [
          "Is the internal brief a separate product or a view of the same note?",
          "Who approves the internal version before it goes out?",
        ],
        status: "open",
        evidence: "hypothesis",
        updatedAt: "2026-10-25",
      },
      {
        id: "q-o3",
        title: "Publish where the release happened",
        description:
          "Meet teams inside GitHub or Linear so the note is a step in the release, not a separate destination to remember.",
        segmentId: "q-s1",
        problem:
          "A separate changelog tool adds a second place to visit after the work is already done.",
        alternatives:
          "Repository releases, planning-cycle summaries, or a public changelog page.",
        differentiation:
          "Bring the editorial workspace to the moment of release instead of asking the team to come to it.",
        noteId: "q-n3",
        questions: [
          "Which integration is the real centre of gravity for a small team?",
          "Can the experience stay focused if it lives inside another product?",
        ],
        status: "open",
        evidence: "unverified",
        updatedAt: "2026-10-22",
      },
      {
        id: "q-o4",
        title: "A quarterly rollup for sales",
        description:
          "Group related releases into a short quarterly story that sales can use in conversations, without a separate reporting project.",
        segmentId: "q-s2",
        problem:
          "Sales hears about changes last and has no narrative that connects several releases.",
        alternatives:
          "A manually assembled slide, a folder of changelog links, or nothing.",
        differentiation:
          "Reuse the release archive as a source for a customer-facing story.",
        noteId: "q-n7",
        questions: [
          "Is a quarterly view useful, or does it arrive too late to matter?",
          "Would sales trust a summary they did not help shape?",
        ],
        status: "parked",
        evidence: "needs-research",
        updatedAt: "2026-10-19",
      },
    ],
    notes: [
      {
        id: "q-n1",
        title: "The changelog is whoever shipped last",
        excerpt:
          "Two teams described the same reluctance: the note is not hard to write, but nobody wants to be the person who has to write it.",
        observations:
          "In two sample conversations, the release note was owned by the last engineer to merge. Both described the task as a chore that arrives after the real work is finished. The time cost was estimated at under an hour; the reluctance was described more strongly than the time.",
        interpretation:
          "The friction may be ownership and timing rather than drafting effort. A tool that only speeds up writing may not change who feels responsible.",
        followUp: [
          "Ask who currently decides when a release note is finished.",
          "Test whether one editorial choice feels lighter than a blank page.",
        ],
        source: "Founder conversations · sample notes",
        date: "2026-10-22",
        relatedType: "opportunity",
        relatedId: "q-o1",
        relatedLabel: "A release note nobody wants to write",
        evidence: "observation",
      },
      {
        id: "q-n2",
        title: "Support rewrites every release note",
        excerpt:
          "A support lead described copying engineering notes into a shorter internal message, then answering the same questions in chat.",
        observations:
          "The sample support workflow has three steps: read the engineering note, rewrite it for the support team, then answer follow-ups in a private thread. The rewriting step was described as necessary but invisible in any release process.",
        interpretation:
          "The internal reader may be a stronger wedge than the public changelog. The value is a note that can be forwarded without translation.",
        followUp: [
          "Collect two real examples of a note before and after rewriting.",
          "Ask whether the rewritten version is ever shared with customers.",
        ],
        source: "Support workflow walkthrough · sample notes",
        date: "2026-10-24",
        relatedType: "segment",
        relatedId: "q-s2",
        relatedLabel: "Support & success teams",
        evidence: "observation",
      },
      {
        id: "q-n3",
        title: "Where teams already publish",
        excerpt:
          "Repository releases and cycle summaries are the two places teams said they would look first. A separate changelog is a third destination.",
        observations:
          "Both sample teams publish something at the end of a release or cycle. Neither visits a dedicated changelog daily. The public changelog is checked mainly when a customer asks for a link.",
        interpretation:
          "Distribution may matter more than a new publishing surface. The product could begin as a companion to an existing release step.",
        followUp: [
          "Ask which existing surface a team would give up first.",
          "Test a workflow that ends inside the existing release step.",
        ],
        source: "Workflow notes · sample interview",
        date: "2026-10-23",
        relatedType: "competitor",
        relatedId: "q-c3",
        relatedLabel: "Cycle Brief",
        evidence: "hypothesis",
      },
      {
        id: "q-n4",
        title: "Drafting is not the bottleneck",
        excerpt:
          "Across three sample conversations, the draft was rarely the blocker. Someone still had to decide what the release meant.",
        observations:
          "Every sample team already had a way to produce a list of changes. The unresolved step was deciding which changes mattered, how to describe them, and whether they were ready for customers.",
        interpretation:
          "The product should be positioned around editorial judgment and approval, not generation. This is the central hypothesis to test.",
        followUp: [
          "Ask a team to narrate the last release decision from memory.",
          "Compare a generated draft with the version they actually published.",
        ],
        source: "Three founder conversations · sample synthesis",
        date: "2026-10-24",
        relatedType: "opportunity",
        relatedId: "q-o2",
        relatedLabel: "A changelog support can forward",
        evidence: "hypothesis",
      },
      {
        id: "q-n5",
        title: "Solo maintainers skip the note",
        excerpt:
          "A solo maintainer publishes a one-line repository release and considers that sufficient. The audience is small enough that a fuller note feels optional.",
        observations:
          "The sample maintainer ships weekly and has an audience of a few hundred. A repository release is the default; a longer note is written only after a major change. There is no internal reader to serve.",
        interpretation:
          "This segment may use the product but is unlikely to pay for it. It should not shape the first commercial version.",
        followUp: [
          "Check whether the pattern holds beyond one maintainer.",
          "Ask what would make a fuller note worth the extra step.",
        ],
        source: "Maintainer conversation · sample note",
        date: "2026-10-20",
        relatedType: "segment",
        relatedId: "q-s3",
        relatedLabel: "Solo maintainers",
        evidence: "unverified",
      },
      {
        id: "q-n6",
        title: "What the competitor pages do not answer",
        excerpt:
          "Public pages make pricing and positioning legible, but say nothing about approval, editing or internal distribution.",
        observations:
          "Four sample competitor pages describe drafting and publishing. None describes a review history or an internal brief. Pricing is visible on two of the four.",
        interpretation:
          "There may be room to compete on the review and distribution layer, but the sample material cannot confirm that customers want it.",
        followUp: [
          "Look for public documentation of approval workflows.",
          "Ask teams what happens between the draft and the published note.",
        ],
        source: "Public page review · sample material",
        date: "2026-10-21",
        relatedType: "competitor",
        relatedId: "q-c1",
        relatedLabel: "ReleaseNote",
        evidence: "needs-research",
      },
      {
        id: "q-n7",
        title: "Three teams asked for a quarterly view",
        excerpt:
          "The request came up unprompted in three sample conversations, always from someone close to sales rather than engineering.",
        observations:
          "Three people described assembling a quarterly summary by hand. The motivation was a customer conversation, not internal reporting. None had a repeatable format.",
        interpretation:
          "There may be a secondary opportunity in reuse, but the sample is too small to treat it as more than a signal.",
        followUp: [
          "Ask what a salesperson actually does with the summary.",
          "Check whether the quarterly view is worth maintaining separately.",
        ],
        source: "Cross-team conversations · sample synthesis",
        date: "2026-10-19",
        relatedType: "opportunity",
        relatedId: "q-o4",
        relatedLabel: "A quarterly rollup for sales",
        evidence: "reviewed",
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
    hypothesis:
      "People would borrow from neighbours if the ask felt normal and the item was close enough to collect on foot.",
    targetAudience:
      "Renters and small households in dense neighbourhoods with limited storage and a shared building or street.",
    problem:
      "Households own things they use twice a year while the same items sit unused a few doors away. Buying is instant; borrowing requires knowing the right neighbour and making the right ask.",
    competitiveSummary:
      "Existing options split into general marketplaces that optimise for reach, and community shelves that optimise for trust. Neither makes the first ask feel ordinary.",
    updatedAt: "2026-10-26",
    openQuestions: [
      "Does trust come from proximity, or does it still need a reputation layer?",
      "What makes a lender comfortable saying yes to a stranger?",
      "Is the unit a building, a street, or a friend group?",
      "Would a building organiser act as the first supply-side user?",
    ],
    competitors: [
      {
        id: "s-c1",
        name: "BorrowBox",
        category: "Neighbourhood marketplace",
        website: "borrowbox.example",
        description:
          "A local classifieds board for lending and borrowing household items, organised around a map.",
        audience: "Neighbours in urban areas willing to meet strangers.",
        pricing: "Free to list · optional verification fee · sample profile",
        strengths: [
          "Large browsing surface for a wide range of items.",
          "Familiar marketplace pattern with profiles and messages.",
        ],
        weaknesses: [
          "Map-first browsing makes distance feel abstract.",
          "The first message still carries the social risk of asking.",
        ],
        differentiation:
          "Stoop should make the ask smaller and the boundary clearer: a building, a window, and a simple yes.",
        observations: [
          "Listings emphasise the item, not the handoff or the relationship.",
          "The sample interface treats a request like a marketplace transaction.",
        ],
        questions: [
          "How often does a listing result in an actual borrow?",
          "Do neighbours meet in person, or use a locker or doorstep?",
        ],
        status: "reviewed",
        evidence: "observation",
        updatedAt: "2026-10-26",
      },
      {
        id: "s-c2",
        name: "Street Share",
        category: "Community platform",
        website: "streetshare.example",
        description:
          "A community board for streets and buildings to coordinate borrowing, notices and small favours.",
        audience: "Building groups and neighbourhood organisers.",
        pricing: "Free · community plan available · sample profile",
        strengths: [
          "Starts from an existing group rather than a global map.",
          "Mixes borrowing with other reasons to stay in touch.",
        ],
        weaknesses: [
          "The broad scope can make borrowing feel incidental.",
          "Success depends on an active organiser maintaining the group.",
        ],
        differentiation:
          "Stoop can be narrower and more useful: one shared inventory, one handoff, no general community feed.",
        observations: [
          "The sample product is strongest when a building already has an organiser.",
          "Borrowing is one of several features, not the centre of the experience.",
        ],
        questions: [
          "Does a broad community board reduce the friction of asking?",
          "What happens when the organiser leaves?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-24",
      },
      {
        id: "s-c3",
        name: "Lendly",
        category: "Peer rental",
        website: "lendly.example",
        description:
          "A peer-to-peer rental service for tools and equipment, with payments and damage protection.",
        audience: "Occasional renters and semi-professional tool owners.",
        pricing: "Per-day rental plus a service fee · sample pricing",
        strengths: [
          "Clear payment and protection model.",
          "Useful for expensive equipment with a known rental value.",
        ],
        weaknesses: [
          "Rental framing makes a neighbourly favour feel commercial.",
          "The process is heavier than borrowing a ladder for an afternoon.",
        ],
        differentiation:
          "Stoop should stay non-monetary at the start. The product is permission and proximity, not inventory monetisation.",
        observations: [
          "The sample flow assumes the item has a daily price.",
          "Trust is handled through a platform guarantee rather than a relationship.",
        ],
        questions: [
          "Would neighbours prefer a paid rental to an open-ended favour?",
          "Is damage protection the real barrier to lending?",
        ],
        status: "not-researched",
        evidence: "needs-research",
        updatedAt: "2026-10-22",
      },
    ],
    segments: [
      {
        id: "s-s1",
        name: "Dense renters with limited storage",
        description:
          "Households in apartments or small homes who need occasional tools but cannot justify owning or storing them.",
        customerType: "Borrower · primary user",
        painPoints: [
          "Storage is scarce, so each purchase has a hidden cost.",
          "The item is needed for one afternoon, then sits untouched.",
          "Asking a neighbour feels like a favour rather than a normal exchange.",
        ],
        alternatives: [
          "Buying a cheap version and discarding it later.",
          "Asking a friend outside the neighbourhood.",
          "Renting from a hardware shop or peer rental service.",
        ],
        needs: [
          "A clear view of what is nearby and available.",
          "A low-pressure way to ask for a specific window.",
          "Confidence that the item will be returned.",
        ],
        questions: [
          "How far is close enough to make borrowing easier than buying?",
          "Does a shared building hallway change the comfort level?",
        ],
        status: "reviewed",
        evidence: "observation",
        updatedAt: "2026-10-26",
      },
      {
        id: "s-s2",
        name: "Building organisers",
        description:
          "The neighbour who already coordinates a group chat, keeps a shared key, or runs the building's informal notice board.",
        customerType: "Supply-side catalyst · organiser",
        painPoints: [
          "The group chat is the only shared inventory and it is unsearchable.",
          "They field the same requests and repeat the same explanations.",
          "They want the building to feel neighbourly without becoming a manager.",
        ],
        alternatives: [
          "A pinned message in the building chat.",
          "A spreadsheet shared with a few neighbours.",
          "Informal door-knocking and memory.",
        ],
        needs: [
          "A simple way to see what the building already has.",
          "A handoff process that does not require mediating every request.",
          "A reason for neighbours to list something without being asked.",
        ],
        questions: [
          "Would an organiser start the inventory, or wait for neighbours?",
          "What makes the role feel like hosting rather than administration?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-23",
      },
    ],
    opportunities: [
      {
        id: "s-o1",
        title: "The ask is harder than the item",
        description:
          "Design the request as a specific, time-boxed ask — “a ladder, Saturday morning” — instead of an open favour.",
        segmentId: "s-s1",
        problem:
          "People know what they need, but asking a neighbour feels transactional or presumptuous.",
        alternatives:
          "Buying, asking a friend outside the area, or going without.",
        differentiation:
          "A social script and a clear window, not a marketplace listing.",
        noteId: "s-n1",
        questions: [
          "Does a time window make the ask feel lighter or more formal?",
          "Who should make the first move: the borrower or the lender?",
        ],
        status: "investigating",
        evidence: "observation",
        updatedAt: "2026-10-26",
      },
      {
        id: "s-o2",
        title: "A building-level lending shelf",
        description:
          "Start with one building's shared inventory rather than a neighbourhood map, so proximity and trust arrive together.",
        segmentId: "s-s2",
        problem:
          "A map of strangers does not solve the first ask; a building already has a reason to cooperate.",
        alternatives:
          "A group chat, a spreadsheet, or a building notice board.",
        differentiation:
          "The unit is a building, not a radius. Supply starts with people who already share a hallway.",
        noteId: "s-n2",
        questions: [
          "Does a building need an organiser to start, or can it emerge?",
          "What happens when a building has only one active lender?",
        ],
        status: "open",
        evidence: "hypothesis",
        updatedAt: "2026-10-24",
      },
      {
        id: "s-o3",
        title: "A trusted handoff window",
        description:
          "Make collection and return a visible, low-coordination moment — a doorstep handoff or a shared shelf with a named window.",
        segmentId: "s-s1",
        problem:
          "Even a willing lender worries about timing, damage and getting the item back.",
        alternatives:
          "Repeated messages, a key left with a neighbour, or an open-ended loan.",
        differentiation:
          "The product owns the handoff, not just the introduction.",
        noteId: "s-n3",
        questions: [
          "Is a doorstep handoff enough, or does trust need a third place?",
          "Would a return reminder feel helpful or intrusive?",
        ],
        status: "open",
        evidence: "unverified",
        updatedAt: "2026-10-22",
      },
    ],
    notes: [
      {
        id: "s-n1",
        title: "The social script matters more than the inventory",
        excerpt:
          "Four neighbours owned the same ladder. The conversation moved from laughing about it to comparing storage space in under ten minutes.",
        observations:
          "The sample conversation was not about the ladder's cost. It was about the awkwardness of asking and the relief of discovering someone nearby had one. The group immediately proposed a shared list, then hesitated over who would maintain it.",
        interpretation:
          "The product may need to solve permission before supply. A familiar script could be more valuable than a larger inventory.",
        followUp: [
          "Ask what exact words someone would use to ask a neighbour.",
          "Test whether a time window makes the ask easier to accept.",
        ],
        source: "Neighbour conversation · sample notes",
        date: "2026-10-23",
        relatedType: "opportunity",
        relatedId: "s-o1",
        relatedLabel: "The ask is harder than the item",
        evidence: "observation",
      },
      {
        id: "s-n2",
        title: "Every tool library dies on supply",
        excerpt:
          "A sample community organiser described two failed shelves: demand arrived quickly, but listing an item never became a habit.",
        observations:
          "Both attempts started with an enthusiastic launch and a burst of listings. Within weeks, the inventory was stale and borrowers stopped checking. The organiser believed the problem was upkeep, not interest.",
        interpretation:
          "Supply is the constraint. The first job is making listing effortless and recurring, not recruiting more borrowers.",
        followUp: [
          "Ask what would make listing an item a two-minute habit.",
          "Find out whether an organiser or a lender should own the listing.",
        ],
        source: "Community organiser interview · sample note",
        date: "2026-10-25",
        relatedType: "segment",
        relatedId: "s-s2",
        relatedLabel: "Building organisers",
        evidence: "hypothesis",
      },
      {
        id: "s-n3",
        title: "What makes a lender say yes",
        excerpt:
          "Lenders in the sample were less worried about damage than about the item disappearing into an open-ended loan.",
        observations:
          "Two sample lenders said they would lend for a defined afternoon but not indefinitely. Both mentioned wanting to know when it would come back. Damage came up second.",
        interpretation:
          "A visible return window may reduce more friction than insurance or verification. This is still an unverified pattern.",
        followUp: [
          "Test a handoff flow with a named return window.",
          "Ask whether a reminder is reassuring or annoying.",
        ],
        source: "Lender conversations · sample notes",
        date: "2026-10-22",
        relatedType: "opportunity",
        relatedId: "s-o3",
        relatedLabel: "A trusted handoff window",
        evidence: "unverified",
      },
      {
        id: "s-n4",
        title: "Rental platforms solve a different problem",
        excerpt:
          "Peer rental products make the transaction legible, but they also make a neighbourly favour feel like a booking.",
        observations:
          "The sample rental flow includes a price, a protection policy and a formal acceptance. It is efficient for expensive equipment, but heavier than borrowing a ladder for an afternoon.",
        interpretation:
          "Stoop should avoid monetisation at the start. The absence of a price may be part of what makes the ask normal.",
        followUp: [
          "Check whether any peer rental product has a free neighbour tier.",
          "Ask whether a deposit would help or hurt trust.",
        ],
        source: "Public product review · sample material",
        date: "2026-10-21",
        relatedType: "competitor",
        relatedId: "s-c1",
        relatedLabel: "BorrowBox",
        evidence: "needs-research",
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
    hypothesis:
      "Founders would ask for introductions more often if the request gave the connector something specific and easy to forward.",
    targetAudience:
      "Pre-seed founders and operators with a dense, informal network and no CRM.",
    problem:
      "Founders know the introduction they need, but asking feels transactional. Connectors want to help, yet a vague request gives them nothing to forward.",
    competitiveSummary:
      "Most tools manage a network after it exists. Few help with the moment of asking, where the request is formed and the connector decides whether to forward it.",
    updatedAt: "2026-10-27",
    openQuestions: [
      "Can a founder write a specific ask without sounding transactional?",
      "Does the connector need a reason to forward beyond goodwill?",
      "What reciprocity keeps the network from becoming a queue?",
      "Does the product need a network graph, or only a better request?",
    ],
    competitors: [
      {
        id: "r-c1",
        name: "IntroPath",
        category: "Network CRM",
        website: "intropath.example",
        description:
          "A lightweight relationship manager that reminds founders to follow up and keeps context on people they have met.",
        audience: "Founders and operators with an existing network.",
        pricing: "$12 / month · sample pricing",
        strengths: [
          "Useful memory aid for a network that already exists.",
          "Follow-up reminders make dormant relationships visible.",
        ],
        weaknesses: [
          "Assumes the founder knows whom to ask.",
          "Does not help form or forward the actual request.",
        ],
        differentiation:
          "Relay should own the ask and the forward, not the contact database.",
        observations: [
          "The sample product is organised around people, not requests.",
          "The value is retention and memory rather than a single successful introduction.",
        ],
        questions: [
          "Do founders maintain a network tool when they are not fundraising?",
          "Would a request-shaped product sit beside this, or replace it?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-26",
      },
      {
        id: "r-c2",
        name: "Warmline",
        category: "Introduction marketplace",
        website: "warmline.example",
        description:
          "A paid introduction service that matches founders with connectors and handles scheduling.",
        audience: "Fundraising founders and sales teams.",
        pricing: "Per-introduction fee · sample profile",
        strengths: [
          "Clear outcome and a managed handoff.",
          "Connectors are given a reason beyond goodwill.",
        ],
        weaknesses: [
          "Paid framing can make the introduction feel like a transaction.",
          "The founder's own network is not the source of the introduction.",
        ],
        differentiation:
          "Relay should stay inside the founder's existing relationships, where trust is already present.",
        observations: [
          "The sample product sells access, not a better ask.",
          "Payment resolves reciprocity, but changes the nature of the favour.",
        ],
        questions: [
          "Would founders pay for access instead of learning to ask?",
          "Can a non-monetary product sustain connector motivation?",
        ],
        status: "not-researched",
        evidence: "needs-research",
        updatedAt: "2026-10-23",
      },
    ],
    segments: [
      {
        id: "r-s1",
        name: "Pre-seed founders without a CRM",
        description:
          "First-time founders running a fundraising or customer-development push from a notes app and a calendar.",
        customerType: "Buyer · requester",
        painPoints: [
          "The needed introduction is clear, but the ask feels presumptuous.",
          "Requests live in scattered messages with no follow-up.",
          "A vague ask gives the connector nothing to forward.",
        ],
        alternatives: [
          "A direct message written from scratch.",
          "Asking a close friend to make the introduction.",
          "Paying for access through an introduction service.",
        ],
        needs: [
          "A short, specific request that explains why.",
          "Confidence that the connector can say no.",
          "A simple way to see what happened next.",
        ],
        questions: [
          "Is the founder asking for a meeting, a reply, or a decision?",
          "How much context can a connector forward without a second conversation?",
        ],
        status: "reviewed",
        evidence: "observation",
        updatedAt: "2026-10-26",
      },
      {
        id: "r-s2",
        name: "Well-connected operators",
        description:
          "The connector in the middle: someone with a dense network who is willing to help but receives vague requests.",
        customerType: "Connector · supply side",
        painPoints: [
          "Vague requests require a second conversation to understand.",
          "Forwarding feels risky when the ask is unclear.",
          "Goodwill is hard to ration without a system.",
        ],
        alternatives: [
          "Replying with questions, delaying, or declining quietly.",
          "Forwarding the raw message and hoping for the best.",
          "Making introductions only for people they know well.",
        ],
        needs: [
          "A request that is specific enough to forward as-is.",
          "A way to help without becoming a gatekeeper.",
          "Some reciprocity or recognition over time.",
        ],
        questions: [
          "What makes a connector comfortable forwarding to a close contact?",
          "Does reciprocity need to be visible, or can it stay informal?",
        ],
        status: "in-progress",
        evidence: "hypothesis",
        updatedAt: "2026-10-25",
      },
    ],
    opportunities: [
      {
        id: "r-o1",
        title: "A specific ask the connector can forward",
        description:
          "Turn a vague request into one short, forwardable message: who, why, and what happens next.",
        segmentId: "r-s1",
        problem:
          "The connector needs enough context to say yes without a second conversation.",
        alternatives:
          "A direct message written from scratch, or a friend acting as intermediary.",
        differentiation:
          "The unit is a forwardable request, not a contact record or a paid introduction.",
        noteId: "r-n1",
        questions: [
          "Which details are essential for a connector to forward with confidence?",
          "Does the requester need to approve the final wording?",
        ],
        status: "investigating",
        evidence: "observation",
        updatedAt: "2026-10-27",
      },
      {
        id: "r-o2",
        title: "Reciprocity without a scoreboard",
        description:
          "Give connectors a lightweight reason to keep helping without turning the network into a points system.",
        segmentId: "r-s2",
        problem:
          "Goodwill is finite, but visible reciprocity can make a favour feel transactional.",
        alternatives:
          "Informal thank-yous, future favours, or paid introductions.",
        differentiation:
          "Recognition and reciprocity that stay out of the request itself.",
        noteId: "r-n2",
        questions: [
          "What would a connector value beyond a thank-you?",
          "Can reciprocity be private without becoming invisible?",
        ],
        status: "open",
        evidence: "unverified",
        updatedAt: "2026-10-24",
      },
    ],
    notes: [
      {
        id: "r-n1",
        title: "The ask is rarely the hard part",
        excerpt:
          "A connector described the real problem: giving them enough context to say yes without scheduling another call.",
        observations:
          "The sample connector receives several requests a month. Most are a sentence long and require a follow-up question. The requests that get forwarded include a specific person, a reason, and a clear next step.",
        interpretation:
          "The product should optimise for forwardability, not for the elegance of the ask. The connector is the real reader.",
        followUp: [
          "Collect three requests that were forwarded and three that were not.",
          "Ask what a connector does when the request is almost good enough.",
        ],
        source: "Connector interview · sample notes",
        date: "2026-10-26",
        relatedType: "opportunity",
        relatedId: "r-o1",
        relatedLabel: "A specific ask the connector can forward",
        evidence: "observation",
      },
      {
        id: "r-n2",
        title: "Goodwill needs a boundary",
        excerpt:
          "Connectors in the sample wanted to help, but worried about becoming a permanent queue for every founder they knew.",
        observations:
          "Two connectors described rationing their help informally. Neither wanted a public score or a leaderboard. Both mentioned liking the idea of a private record of who they had helped.",
        interpretation:
          "Reciprocity may need to be private and low-effort. A visible score could solve the wrong problem.",
        followUp: [
          "Test a private thank-you note against a visible badge.",
          "Ask whether connectors want to know the outcome of an introduction.",
        ],
        source: "Connector conversations · sample notes",
        date: "2026-10-24",
        relatedType: "opportunity",
        relatedId: "r-o2",
        relatedLabel: "Reciprocity without a scoreboard",
        evidence: "unverified",
      },
      {
        id: "r-n3",
        title: "Network tools assume the network exists",
        excerpt:
          "A sample review of network CRMs found rich contact context but no help forming the one request that matters.",
        observations:
          "The products reviewed are organised around contacts, reminders and follow-ups. None starts from the introduction being requested. The workflow begins after the founder has already decided whom to ask.",
        interpretation:
          "There may be a gap before the CRM layer. The next question is whether that gap is a product or a feature.",
        followUp: [
          "Check whether any network tool supports a shareable request.",
          "Ask founders where they currently write the ask.",
        ],
        source: "Public product review · sample material",
        date: "2026-10-23",
        relatedType: "competitor",
        relatedId: "r-c1",
        relatedLabel: "IntroPath",
        evidence: "needs-research",
      },
    ],
  },
];

export const MARKET_IDEA_OPTIONS = DEMO_MARKET_IDEAS.map((idea) => ({
  value: idea.id,
  label: idea.name,
  shortLabel: idea.name,
}));

export function getMarketIdea(id: string): MarketIdea {
  return DEMO_MARKET_IDEAS.find((idea) => idea.id === id) ?? DEMO_MARKET_IDEAS[0];
}

export const COMPETITOR_SORT_OPTIONS = [
  { value: "name", label: "Name A–Z", shortLabel: "A–Z" },
  { value: "recent", label: "Recently updated", shortLabel: "Recent" },
  { value: "status", label: "Research status", shortLabel: "Status" },
];

export const SEGMENT_SORT_OPTIONS = [
  { value: "name", label: "Name A–Z", shortLabel: "A–Z" },
  { value: "recent", label: "Recently updated", shortLabel: "Recent" },
  { value: "status", label: "Research status", shortLabel: "Status" },
];

export const OPPORTUNITY_SORT_OPTIONS = [
  { value: "recent", label: "Recently updated", shortLabel: "Recent" },
  { value: "title", label: "Title A–Z", shortLabel: "A–Z" },
  { value: "status", label: "Investigation status", shortLabel: "Status" },
];

export const NOTE_SORT_OPTIONS = [
  { value: "recent", label: "Newest first", shortLabel: "Newest" },
  { value: "oldest", label: "Oldest first", shortLabel: "Oldest" },
  { value: "title", label: "Title A–Z", shortLabel: "A–Z" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses", shortLabel: "All" },
  { value: "not-researched", label: "Not researched", shortLabel: "Not researched" },
  { value: "in-progress", label: "In progress", shortLabel: "In progress" },
  { value: "reviewed", label: "Reviewed", shortLabel: "Reviewed" },
];

export const EVIDENCE_FILTER_OPTIONS = [
  { value: "all", label: "All evidence", shortLabel: "All" },
  { value: "observation", label: "Observation", shortLabel: "Observation" },
  { value: "hypothesis", label: "Hypothesis", shortLabel: "Hypothesis" },
  { value: "unverified", label: "Unverified", shortLabel: "Unverified" },
  { value: "needs-research", label: "Needs research", shortLabel: "Needs research" },
  { value: "reviewed", label: "Reviewed", shortLabel: "Reviewed" },
];

export const OPPORTUNITY_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All investigations", shortLabel: "All" },
  { value: "open", label: "Open", shortLabel: "Open" },
  { value: "investigating", label: "Investigating", shortLabel: "Investigating" },
  { value: "parked", label: "Parked", shortLabel: "Parked" },
];
