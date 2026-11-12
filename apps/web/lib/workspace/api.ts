import { api } from "../apiClient";

/** Workspace row returned by `GET /workspace` (or `null` when the user has none). */
export type Workspace = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export function getWorkspace() {
  return api.get<Workspace | null>("/workspace");
}

export function updateWorkspace(name: string) {
  return api.patch<Workspace>("/workspace", { name });
}
