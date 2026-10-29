import type {
  Channel,
  ChecklistItem,
  LaunchAsset,
  LaunchProduct,
  LaunchTask,
} from "./types";

import { LAUNCH_PRODUCTS } from "./types";

export const DEMO_LAUNCH_PRODUCTS = [...LAUNCH_PRODUCTS];

export const DEMO_LAUNCH_TASKS: LaunchTask[] = [
  {
    id: "t-001",
    productId: "helio-notes",
    title: "Finalize landing page copy",
    description: "Write and review hero copy and value proposition.",
    phase: "Preparation",
    date: "2027-01-20",
    status: "In Progress",
    owner: "Founder",
    relatedAssetId: "a-001",
    relatedChannelId: "c-001",
  },
  {
    id: "t-002",
    productId: "helio-notes",
    title: "Draft launch announcement",
    description: "Compose the announcement email and social posts.",
    phase: "Pre-launch",
    date: "2027-02-05",
    status: "Not Started",
    owner: "Founder",
    relatedAssetId: "a-003",
    relatedChannelId: "c-002",
  },
  {
    id: "t-003",
    productId: "helio-notes",
    title: "Prepare demo script",
    description: "Record a 2-minute product demo video.",
    phase: "Pre-launch",
    date: "2027-02-08",
    status: "Not Started",
    relatedAssetId: "a-008",
    relatedChannelId: "c-003",
  },
  {
    id: "t-004",
    productId: "helio-notes",
    title: "Launch day push",
    description: "Publish announcement and update product pages.",
    phase: "Launch Day",
    date: "2027-02-14",
    status: "Not Started",
    relatedChannelId: "c-001",
  },
  {
    id: "t-005",
    productId: "atlas-scout",
    title: "Confirm beta shortlist",
    description: "Finalize the first 10 beta founders.",
    phase: "Preparation",
    date: "2027-03-10",
    status: "Completed",
    owner: "Founder",
  },
  {
    id: "t-006",
    productId: "atlas-scout",
    title: "Launch outreach emails",
    description: "Send launch-day emails to shortlisted prospects.",
    phase: "Launch Day",
    date: "2027-04-01",
    status: "Not Started",
    relatedChannelId: "c-005",
  },
];

export const DEMO_LAUNCH_ASSETS: LaunchAsset[] = [
  {
    id: "a-001",
    productId: "helio-notes",
    title: "Hero tagline",
    type: "Product tagline",
    preview: "Capture decisions in seconds. Recall them forever.",
    status: "Ready",
    lastUpdated: "2027-01-15",
    relatedChannelId: "c-001",
  },
  {
    id: "a-002",
    productId: "helio-notes",
    title: "Short product description",
    type: "Product description",
    preview: "Helio Notes helps knowledge workers capture decisions and never lose context again.",
    status: "Draft",
    lastUpdated: "2027-01-18",
  },
  {
    id: "a-003",
    productId: "helio-notes",
    title: "Launch announcement email",
    type: "Email announcement",
    preview: "Helio Notes is now available for early adopters.",
    status: "In Review",
    lastUpdated: "2027-02-03",
    relatedChannelId: "c-002",
  },
  {
    id: "a-004",
    productId: "helio-notes",
    title: "Landing page copy",
    type: "Landing-page copy",
    preview: "Full page copy including hero, features, and FAQ.",
    status: "Draft",
    lastUpdated: "2027-01-22",
    relatedChannelId: "c-001",
  },
  {
    id: "a-008",
    productId: "helio-notes",
    title: "Demo script",
    type: "Demo script",
    preview: "Two-minute walkthrough of the capture and recall flow.",
    status: "Draft",
    lastUpdated: "2027-01-25",
    relatedChannelId: "c-003",
  },
];

export const DEMO_CHANNELS: Channel[] = [
  {
    id: "c-001",
    productId: "helio-notes",
    name: "Product website",
    campaignObjective: "Convert visitors into early adopters.",
    targetAudience: "Knowledge workers and product teams",
    plannedActivity: "Update landing page and publish announcement.",
    phase: "Launch Day",
    status: "In Progress",
    relatedAssetIds: ["a-001", "a-004"],
    date: "2027-02-14",
  },
  {
    id: "c-002",
    productId: "helio-notes",
    name: "Email",
    campaignObjective: "Notify subscribers of the launch.",
    targetAudience: "Waitlist and newsletter subscribers",
    plannedActivity: "Send launch announcement email.",
    phase: "Pre-launch",
    status: "Not Started",
    relatedAssetIds: ["a-003"],
    date: "2027-02-12",
  },
  {
    id: "c-003",
    productId: "helio-notes",
    name: "Social media",
    campaignObjective: "Share the launch with the community.",
    targetAudience: "Product and tech communities",
    plannedActivity: "Post demo video and announcement links.",
    phase: "Launch Day",
    status: "Not Started",
    relatedAssetIds: ["a-008"],
    date: "2027-02-14",
  },
];

export const DEMO_CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "cl-001",
    productId: "helio-notes",
    category: "Product Readiness",
    item: "Core user journey reviewed.",
    completed: true,
  },
  {
    id: "cl-002",
    productId: "helio-notes",
    category: "Product Readiness",
    item: "Important product flows tested.",
    completed: true,
  },
  {
    id: "cl-003",
    productId: "helio-notes",
    category: "Product Readiness",
    item: "Known launch blockers documented.",
    completed: false,
  },
  {
    id: "cl-004",
    productId: "helio-notes",
    category: "Website & Content",
    item: "Landing page reviewed.",
    completed: false,
  },
  {
    id: "cl-005",
    productId: "helio-notes",
    category: "Website & Content",
    item: "Product description finalized.",
    completed: false,
  },
  {
    id: "cl-006",
    productId: "helio-notes",
    category: "Website & Content",
    item: "Screenshots and product visuals prepared.",
    completed: false,
  },
  {
    id: "cl-007",
    productId: "helio-notes",
    category: "Marketing & Distribution",
    item: "Launch announcement drafted.",
    completed: false,
  },
  {
    id: "cl-008",
    productId: "helio-notes",
    category: "Marketing & Distribution",
    item: "Promotional channels selected.",
    completed: true,
  },
  {
    id: "cl-009",
    productId: "helio-notes",
    category: "Operations",
    item: "Support contact and process documented.",
    completed: false,
  },
  {
    id: "cl-010",
    productId: "helio-notes",
    category: "Operations",
    item: "Feedback collection method identified.",
    completed: false,
  },
];

export function getLaunchProduct(id: string): LaunchProduct {
  return DEMO_LAUNCH_PRODUCTS.find((p) => p.id === id) ?? DEMO_LAUNCH_PRODUCTS[0];
}

export function getLaunchTasksForProduct(id: string): LaunchTask[] {
  return DEMO_LAUNCH_TASKS.filter((t) => t.productId === id);
}

export function getLaunchAssetsForProduct(id: string): LaunchAsset[] {
  return DEMO_LAUNCH_ASSETS.filter((a) => a.productId === id);
}

export function getChannelsForProduct(id: string): Channel[] {
  return DEMO_CHANNELS.filter((c) => c.productId === id);
}

export function getChecklistItemsForProduct(id: string): ChecklistItem[] {
  return DEMO_CHECKLIST_ITEMS.filter((i) => i.productId === id);
}
