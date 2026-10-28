import type { DashboardSnapshot, GateDecision, Initiative, Week } from "./types";

/**
 * The sample workspace.
 *
 * `apps/api` has no analytics endpoints yet (it serves `GET /` only), so this is
 * the single, explicitly-labelled source of dashboard figures. It is static —
 * no randomness and no `Date.now()` — so server and client renders agree and
 * the numbers never drift between visits.
 *
 * To go live, replace this snapshot (or the module that reads it) with real
 * data of the same shape; the charts keep working unchanged.
 */

/** Mondays, 26 weeks back from the reference date. */
const weeksRaw: Array<[string, number, number, number, number, number, number, number]> = [
  //  start          captured validated launched interviews experiments feedback surveys
  ["2026-04-27", 3, 2, 0, 4, 2, 6, 1],
  ["2026-05-04", 4, 2, 1, 5, 2, 7, 2],
  ["2026-05-11", 2, 1, 0, 3, 1, 4, 1],
  ["2026-05-18", 5, 3, 1, 6, 3, 9, 2],
  ["2026-05-25", 3, 2, 0, 4, 2, 6, 1],
  ["2026-06-01", 4, 2, 0, 5, 3, 8, 2],
  ["2026-06-08", 3, 2, 1, 4, 2, 7, 1],
  ["2026-06-15", 6, 4, 1, 7, 4, 11, 3],
  ["2026-06-22", 4, 3, 0, 5, 3, 8, 2],
  ["2026-06-29", 3, 2, 1, 4, 2, 6, 1],
  ["2026-07-06", 5, 3, 0, 6, 3, 9, 2],
  ["2026-07-13", 4, 2, 1, 5, 3, 8, 2],
  ["2026-07-20", 4, 3, 0, 5, 3, 8, 2],
  ["2026-07-27", 6, 4, 2, 7, 4, 12, 3],
  ["2026-08-03", 3, 2, 0, 4, 2, 6, 1],
  ["2026-08-10", 4, 2, 1, 5, 3, 7, 2],
  ["2026-08-17", 5, 3, 0, 6, 3, 9, 2],
  ["2026-08-24", 3, 2, 0, 4, 2, 6, 1],
  ["2026-08-31", 4, 2, 1, 5, 3, 8, 2],
  ["2026-09-07", 6, 4, 1, 7, 4, 11, 3],
  ["2026-09-14", 4, 3, 0, 5, 3, 8, 2],
  ["2026-09-21", 5, 3, 1, 6, 3, 9, 2],
  ["2026-09-28", 3, 2, 0, 4, 2, 6, 1],
  ["2026-10-05", 4, 2, 0, 5, 3, 8, 2],
  ["2026-10-12", 6, 4, 1, 7, 4, 11, 3],
  ["2026-10-19", 4, 3, 1, 6, 3, 9, 2],
];

export const DEMO_WEEKS: Week[] = weeksRaw.map(
  ([start, captured, validated, launched, interviews, experiments, feedback, surveys]) => ({
    start,
    captured,
    validated,
    launched,
    interviews,
    experiments,
    feedback,
    surveys,
  }),
);

export const DEMO_INITIATIVES: Initiative[] = [
  {
    id: "init-signal",
    name: "Signal — competitor radar",
    stageId: "02",
    owner: "MH",
    stageSince: "2026-09-14",
    nextGate: "2026-10-30",
    openFeedback: 4,
    blocker: null,
  },
  {
    id: "init-ledger",
    name: "Ledger — invoice triage",
    stageId: "05",
    owner: "AR",
    stageSince: "2026-08-03",
    nextGate: "2026-11-02",
    openFeedback: 2,
    blocker: "Waiting on three customer interviews",
  },
  {
    id: "init-hatch",
    name: "Hatch — onboarding kit",
    stageId: "03",
    owner: "MH",
    stageSince: "2026-09-28",
    nextGate: "2026-10-28",
    openFeedback: 6,
    blocker: null,
  },
  {
    id: "init-cadence",
    name: "Cadence — weekly ritual",
    stageId: "07",
    owner: "SK",
    stageSince: "2026-10-05",
    nextGate: "2026-11-06",
    openFeedback: 3,
    blocker: null,
  },
  {
    id: "init-nimbus",
    name: "Nimbus — deploy previews",
    stageId: "06",
    owner: "JD",
    stageSince: "2026-08-24",
    nextGate: "2026-10-29",
    openFeedback: 1,
    blocker: null,
  },
  {
    id: "init-ember",
    name: "Ember — retention loops",
    stageId: "04",
    owner: "MH",
    stageSince: "2026-10-12",
    nextGate: "2026-11-09",
    openFeedback: 2,
    blocker: null,
  },
  {
    id: "init-atlas",
    name: "Atlas — pricing experiments",
    stageId: "08",
    owner: "AR",
    stageSince: "2026-09-07",
    nextGate: "2026-11-03",
    openFeedback: 5,
    blocker: null,
  },
  {
    id: "init-quill",
    name: "Quill — changelog writer",
    stageId: "01",
    owner: "SK",
    stageSince: "2026-10-19",
    nextGate: null,
    openFeedback: 0,
    blocker: null,
  },
  {
    id: "init-kiln",
    name: "Kiln — design tokens",
    stageId: "04",
    owner: "JD",
    stageSince: "2026-07-20",
    nextGate: "2026-11-16",
    openFeedback: 0,
    blocker: null,
  },
  {
    id: "init-compass",
    name: "Compass — ICP scoring",
    stageId: "03",
    owner: "MH",
    stageSince: "2026-09-21",
    nextGate: "2026-10-27",
    openFeedback: 7,
    blocker: "Blocked: no analyst access to usage data",
  },
  {
    id: "init-runway",
    name: "Runway — burn forecast",
    stageId: "05",
    owner: "AR",
    stageSince: "2026-10-01",
    nextGate: "2026-11-12",
    openFeedback: 2,
    blocker: null,
  },
  {
    id: "init-loom",
    name: "Loom — interview library",
    stageId: "02",
    owner: "SK",
    stageSince: "2026-06-29",
    nextGate: "2026-11-20",
    openFeedback: 1,
    blocker: null,
  },
];

export const DEMO_DECISIONS: GateDecision[] = [
  {
    id: "dec-01",
    date: "2026-10-24",
    initiative: "Hatch — onboarding kit",
    gate: "Validation Lab",
    outcome: "pivot",
    note: "Narrow to solo operators; B2B path has no evidence",
  },
  {
    id: "dec-02",
    date: "2026-10-22",
    initiative: "Nimbus — deploy previews",
    gate: "Launch Center",
    outcome: "go",
    note: "Preview builds ship behind a flag",
  },
  {
    id: "dec-03",
    date: "2026-10-18",
    initiative: "Cadence — weekly ritual",
    gate: "Feedback Hub",
    outcome: "go",
  },
  {
    id: "dec-04",
    date: "2026-10-11",
    initiative: "Atlas — pricing experiments",
    gate: "Founder Analytics",
    outcome: "pivot",
    note: "Metric definition still unresolved",
  },
  {
    id: "dec-05",
    date: "2026-10-06",
    initiative: "Quill — changelog writer",
    gate: "Idea Lab",
    outcome: "go",
  },
  {
    id: "dec-06",
    date: "2026-09-30",
    initiative: "Ember — retention loops",
    gate: "MVP Studio",
    outcome: "stop",
    note: "Overlaps Kiln; folded into the token work",
  },
];

export const DEMO_SNAPSHOT: DashboardSnapshot = {
  workspace: {
    name: "Helio Labs",
    owner: "Mahdyar",
    asOf: "2026-10-26",
  },
  weeks: DEMO_WEEKS,
  initiatives: DEMO_INITIATIVES,
  decisions: DEMO_DECISIONS,
};
