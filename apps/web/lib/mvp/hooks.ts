"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as mvpApi from "./api";
import type {
  CreateFeatureInput,
  CreateProjectInput,
  CreateScopeItemInput,
  UpdateFeatureInput,
  UpdateProjectInput,
  UpdateScopeItemInput,
} from "./api";
import type { Feature, MVPProject } from "../mvp-studio/types";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireId(value: string | undefined, message: string): string {
  if (!value) throw new Error(message);
  return value;
}

/* ─── Projects ────────────────────────────────────────────────────────────── */

/** Collection of MVP projects for the active product. */
export function useProjects(productId?: string) {
  const query = useQuery({
    queryKey: ["projects", productId ?? null],
    queryFn: () => mvpApi.getProjects(productId as string),
    enabled: Boolean(productId),
  });

  return {
    projects: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch MVP projects"),
    refetch: query.refetch,
  };
}

/** A single MVP project. */
export function useProject(productId?: string, id?: string) {
  const query = useQuery({
    queryKey: ["project", productId ?? null, id ?? null],
    queryFn: () =>
      mvpApi.getProject(productId as string, id as string),
    enabled: Boolean(productId && id),
  });

  return {
    project: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch MVP project"),
    refetch: query.refetch,
  };
}

export function useCreateProject(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateProjectInput) =>
      mvpApi.createProject(
        requireId(productId, "Select a product before creating an MVP project."),
        input,
      ),
    onSuccess: (project) => {
      queryClient.setQueryData<MVPProject>(
        ["project", productId ?? null, project.id],
        project,
      );
      queryClient.invalidateQueries({
        queryKey: ["projects", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createProject: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create MVP project"),
    reset: mutation.reset,
  };
}

export function useUpdateProject(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      mvpApi.updateProject(
        requireId(productId, "Select a product before updating an MVP project."),
        id,
        input,
      ),
    onSuccess: (project) => {
      queryClient.setQueryData<MVPProject>(
        ["project", productId ?? null, project.id],
        project,
      );
      queryClient.invalidateQueries({
        queryKey: ["projects", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateProjectInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateProject: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update MVP project"),
    reset: mutation.reset,
  };
}

export function useDeleteProject(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      mvpApi.deleteProject(
        requireId(productId, "Select a product before deleting an MVP project."),
        id,
      ),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["project", productId ?? null, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteProject: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete MVP project"),
    reset: mutation.reset,
  };
}

/* ─── Features ────────────────────────────────────────────────────────────── */

/** Collection of features for an MVP project. */
export function useFeatures(productId?: string, projectId?: string) {
  const query = useQuery({
    queryKey: ["features", projectId ?? null],
    queryFn: () => mvpApi.getFeatures(productId as string, projectId as string),
    enabled: Boolean(productId && projectId),
  });

  return {
    features: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch features"),
    refetch: query.refetch,
  };
}

/** A single feature. */
export function useFeature(
  productId?: string,
  projectId?: string,
  id?: string,
) {
  const query = useQuery({
    queryKey: ["feature", projectId ?? null, id ?? null],
    queryFn: () =>
      mvpApi.getFeature(productId as string, projectId as string, id as string),
    enabled: Boolean(productId && projectId && id),
  });

  return {
    feature: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch feature"),
    refetch: query.refetch,
  };
}

export function useCreateFeature(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateFeatureInput) =>
      mvpApi.createFeature(
        requireId(productId, "Select a product before adding a feature."),
        requireId(projectId, "Select an MVP project before adding a feature."),
        input,
      ),
    onSuccess: (feature) => {
      queryClient.setQueryData<Feature>(
        ["feature", projectId ?? null, feature.id],
        feature,
      );
      queryClient.invalidateQueries({
        queryKey: ["features", projectId ?? null],
      });
      queryClient.invalidateQueries({
        queryKey: ["scope", projectId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createFeature: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create feature"),
    reset: mutation.reset,
  };
}

export function useUpdateFeature(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFeatureInput }) =>
      mvpApi.updateFeature(
        requireId(productId, "Select a product before updating a feature."),
        requireId(projectId, "Select an MVP project before updating a feature."),
        id,
        input,
      ),
    onSuccess: (feature) => {
      queryClient.setQueryData<Feature>(
        ["feature", projectId ?? null, feature.id],
        feature,
      );
      queryClient.invalidateQueries({
        queryKey: ["features", projectId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateFeatureInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateFeature: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update feature"),
    reset: mutation.reset,
  };
}

export function useDeleteFeature(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      mvpApi.deleteFeature(
        requireId(productId, "Select a product before deleting a feature."),
        requireId(projectId, "Select an MVP project before deleting a feature."),
        id,
      ),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["feature", projectId ?? null, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["features", projectId ?? null],
      });
      queryClient.invalidateQueries({
        queryKey: ["scope", projectId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteFeature: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete feature"),
    reset: mutation.reset,
  };
}

/* ─── Scope items ─────────────────────────────────────────────────────────── */

/** Collection of scope items for an MVP project. */
export function useScopeItems(productId?: string, projectId?: string) {
  const query = useQuery({
    queryKey: ["scope", projectId ?? null],
    queryFn: () =>
      mvpApi.getScopeItems(productId as string, projectId as string),
    enabled: Boolean(productId && projectId),
  });

  return {
    scopeItems: query.data ?? [],
    items: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch scope items"),
    refetch: query.refetch,
  };
}

export function useCreateScopeItem(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateScopeItemInput) =>
      mvpApi.createScopeItem(
        requireId(productId, "Select a product before adding a scope item."),
        requireId(
          projectId,
          "Select an MVP project before adding a scope item.",
        ),
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scope", projectId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createScopeItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create scope item"),
    reset: mutation.reset,
  };
}

export function useUpdateScopeItem(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateScopeItemInput }) =>
      mvpApi.updateScopeItem(
        requireId(productId, "Select a product before updating a scope item."),
        requireId(
          projectId,
          "Select an MVP project before updating a scope item.",
        ),
        id,
        input,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scope", projectId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateScopeItemInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateScopeItem: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update scope item"),
    reset: mutation.reset,
  };
}

export function useDeleteScopeItem(productId?: string, projectId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      mvpApi.deleteScopeItem(
        requireId(productId, "Select a product before deleting a scope item."),
        requireId(
          projectId,
          "Select an MVP project before deleting a scope item.",
        ),
        id,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scope", projectId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteScopeItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete scope item"),
    reset: mutation.reset,
  };
}

/* ─── AI ──────────────────────────────────────────────────────────────────── */

/** Suggest five essential features from the project's concept. */
export function useSuggestFeatures(productId?: string, projectId?: string) {
  const mutation = useMutation({
    mutationFn: () =>
      mvpApi.suggestFeatures(
        requireId(productId, "Select a product before requesting suggestions."),
        requireId(
          projectId,
          "Select an MVP project before requesting suggestions.",
        ),
      ),
  });

  return {
    suggest: mutation.mutateAsync,
    suggestFeatures: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to suggest features"),
    reset: mutation.reset,
  };
}

/** Generate a user story and acceptance criteria for one feature. */
export function useGenerateUserStory(
  productId?: string,
  projectId?: string,
  id?: string,
) {
  const mutation = useMutation({
    mutationFn: () =>
      mvpApi.generateUserStory(
        requireId(productId, "Select a product before generating a user story."),
        requireId(
          projectId,
          "Select an MVP project before generating a user story.",
        ),
        requireId(id, "Select a feature before generating a user story."),
      ),
  });

  return {
    generate: mutation.mutateAsync,
    generateUserStory: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to generate user story"),
    reset: mutation.reset,
  };
}
