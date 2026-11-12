"use client";

import { useQuery } from "@tanstack/react-query";
import { getWorkspace, type Workspace } from "./api";

export function useWorkspace() {
  const workspace = useQuery<Workspace | null>({
    queryKey: ["workspace"],
    queryFn: () => getWorkspace(),
  });

  return workspace;
}
