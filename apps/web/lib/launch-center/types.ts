/** Presentation types for the Launch Center workspace. */

export const LAUNCH_PRODUCTS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "LC-001",
    summary: "A lightweight decision log for knowledge workers.",
    launchDate: "2027-02-14",
    phase: "Pre-launch",
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "LC-002",
    summary: "A focused shortlist builder for early B2B outreach.",
    launchDate: "2027-04-01",
    phase: "Preparation",
  },
] as const;

export type LaunchProduct = (typeof LAUNCH_PRODUCTS)[number];

export const LAUNCH_PHASES = ["Preparation", "Pre-launch", "Launch Day", "Post-launch"] as const;
export type LaunchPhase = (typeof LAUNCH_PHASES)[number];

export const LAUNCH_TASK_STATUSES = ["Not Started", "In Progress", "Completed", "Blocked"] as const;
export type LaunchTaskStatus = (typeof LAUNCH_TASK_STATUSES)[number];

export const LAUNCH_ASSET_STATUSES = ["Draft", "In Review", "Ready", "Published"] as const;
export type LaunchAssetStatus = (typeof LAUNCH_ASSET_STATUSES)[number];

export type LaunchTask = {
  id: string;
  productId: (typeof LAUNCH_PRODUCTS)[number]["id"];
  title: string;
  description: string;
  phase: LaunchPhase;
  date: string;
  status: LaunchTaskStatus;
  owner?: string;
  relatedAssetId?: string;
  relatedChannelId?: string;
};

export type LaunchAsset = {
  id: string;
  productId: (typeof LAUNCH_PRODUCTS)[number]["id"];
  title: string;
  type: string;
  preview: string;
  status: LaunchAssetStatus;
  lastUpdated: string;
  relatedChannelId?: string;
};

export type Channel = {
  id: string;
  productId: (typeof LAUNCH_PRODUCTS)[number]["id"];
  name: string;
  campaignObjective: string;
  targetAudience: string;
  plannedActivity: string;
  phase: LaunchPhase;
  status: LaunchTaskStatus;
  relatedAssetIds: string[];
  date: string;
};

export type ChecklistItem = {
  id: string;
  productId: (typeof LAUNCH_PRODUCTS)[number]["id"];
  category: string;
  item: string;
  completed: boolean;
};

export const LAUNCH_SECTIONS = ["Overview", "Launch Plan", "Checklist", "Launch Assets", "Channels & Campaigns"] as const;
export type LaunchSection = (typeof LAUNCH_SECTIONS)[number];
