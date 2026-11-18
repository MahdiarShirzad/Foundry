"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as roadmapApi from "./api";
import type {
  CreateInitiativeInput,
  CreateMilestoneInput,
  CreatePlanningNoteInput,
  CreateReleaseInput,
  UpdateInitiativeInput,
  UpdateMilestoneInput,
  UpdatePlanningNoteInput,
  UpdateReleaseInput,
} from "./api";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireProductId(productId: string | undefined): string {
  if (!productId) {
    throw new Error("Select a product before working with the roadmap.");
  }
  return productId;
}

/* ─── Initiatives ─────────────────────────────────────────────────────────── */

export function useInitiatives(productId?: string) {
  const query = useQuery({
    queryKey: ["initiatives", productId ?? null],
    queryFn: () => roadmapApi.getInitiatives(productId as string),
    enabled: Boolean(productId),
  });

  return {
    initiatives: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch initiatives"),
    refetch: query.refetch,
  };
}

export function useCreateInitiative(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateInitiativeInput) =>
      roadmapApi.createInitiative(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["initiatives", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createInitiative: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create initiative"),
    reset: mutation.reset,
  };
}

export function useUpdateInitiative(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInitiativeInput }) =>
      roadmapApi.updateInitiative(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["initiatives", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateInitiativeInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateInitiative: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update initiative"),
    reset: mutation.reset,
  };
}

export function useDeleteInitiative(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      roadmapApi.deleteInitiative(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["initiatives", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteInitiative: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete initiative"),
    reset: mutation.reset,
  };
}

/** Suggest five strategic initiatives for the product. */
export function useSuggestInitiatives(productId?: string) {
  const mutation = useMutation({
    mutationFn: () =>
      roadmapApi.suggestInitiatives(requireProductId(productId)),
  });

  return {
    suggest: mutation.mutateAsync,
    suggestInitiatives: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to suggest initiatives"),
    reset: mutation.reset,
  };
}

/* ─── Releases ────────────────────────────────────────────────────────────── */

export function useReleases(productId?: string) {
  const query = useQuery({
    queryKey: ["releases", productId ?? null],
    queryFn: () => roadmapApi.getReleases(productId as string),
    enabled: Boolean(productId),
  });

  return {
    releases: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch releases"),
    refetch: query.refetch,
  };
}

export function useCreateRelease(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateReleaseInput) =>
      roadmapApi.createRelease(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["releases", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createRelease: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create release"),
    reset: mutation.reset,
  };
}

export function useUpdateRelease(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReleaseInput }) =>
      roadmapApi.updateRelease(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["releases", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateReleaseInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateRelease: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update release"),
    reset: mutation.reset,
  };
}

export function useDeleteRelease(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      roadmapApi.deleteRelease(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["releases", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteRelease: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete release"),
    reset: mutation.reset,
  };
}

/* ─── Milestones ──────────────────────────────────────────────────────────── */

export function useMilestones(productId?: string) {
  const query = useQuery({
    queryKey: ["milestones", productId ?? null],
    queryFn: () => roadmapApi.getMilestones(productId as string),
    enabled: Boolean(productId),
  });

  return {
    milestones: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch milestones"),
    refetch: query.refetch,
  };
}

export function useCreateMilestone(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateMilestoneInput) =>
      roadmapApi.createMilestone(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createMilestone: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create milestone"),
    reset: mutation.reset,
  };
}

export function useUpdateMilestone(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMilestoneInput }) =>
      roadmapApi.updateMilestone(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateMilestoneInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateMilestone: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update milestone"),
    reset: mutation.reset,
  };
}

export function useDeleteMilestone(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      roadmapApi.deleteMilestone(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteMilestone: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete milestone"),
    reset: mutation.reset,
  };
}

/* ─── Planning notes ──────────────────────────────────────────────────────── */

export function usePlanningNotes(productId?: string) {
  const query = useQuery({
    queryKey: ["notes", productId ?? null],
    queryFn: () => roadmapApi.getPlanningNotes(productId as string),
    enabled: Boolean(productId),
  });

  return {
    notes: query.data ?? [],
    planningNotes: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch planning notes"),
    refetch: query.refetch,
  };
}

export function useCreatePlanningNote(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreatePlanningNoteInput) =>
      roadmapApi.createPlanningNote(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createPlanningNote: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create planning note"),
    reset: mutation.reset,
  };
}

export function useUpdatePlanningNote(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePlanningNoteInput }) =>
      roadmapApi.updatePlanningNote(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdatePlanningNoteInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updatePlanningNote: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update planning note"),
    reset: mutation.reset,
  };
}

export function useDeletePlanningNote(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      roadmapApi.deletePlanningNote(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deletePlanningNote: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete planning note"),
    reset: mutation.reset,
  };
}
