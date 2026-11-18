"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as launchApi from "./api";
import type {
  CreateChannelInput,
  CreateChecklistItemInput,
  CreateLaunchAssetInput,
  CreateLaunchTaskInput,
  UpdateChannelInput,
  UpdateChecklistItemInput,
  UpdateLaunchAssetInput,
  UpdateLaunchTaskInput,
} from "./api";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireProductId(productId: string | undefined): string {
  if (!productId) {
    throw new Error("Select a product before working with the launch plan.");
  }
  return productId;
}

/* ─── Tasks ───────────────────────────────────────────────────────────────── */

export function useTasks(productId?: string) {
  const query = useQuery({
    queryKey: ["tasks", productId ?? null],
    queryFn: () => launchApi.getTasks(productId as string),
    enabled: Boolean(productId),
  });

  return {
    tasks: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch launch tasks"),
    refetch: query.refetch,
  };
}

export function useCreateTask(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateLaunchTaskInput) =>
      launchApi.createTask(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createTask: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create launch task"),
    reset: mutation.reset,
  };
}

export function useUpdateTask(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLaunchTaskInput }) =>
      launchApi.updateTask(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateLaunchTaskInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateTask: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update launch task"),
    reset: mutation.reset,
  };
}

export function useDeleteTask(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      launchApi.deleteTask(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteTask: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete launch task"),
    reset: mutation.reset,
  };
}

/** Suggest a go-to-market launch checklist for the product. */
export function useSuggestTasks(productId?: string) {
  const mutation = useMutation({
    mutationFn: () => launchApi.suggestTasks(requireProductId(productId)),
  });

  return {
    suggest: mutation.mutateAsync,
    suggestTasks: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to suggest launch tasks"),
    reset: mutation.reset,
  };
}

/* ─── Assets ──────────────────────────────────────────────────────────────── */

export function useAssets(productId?: string) {
  const query = useQuery({
    queryKey: ["assets", productId ?? null],
    queryFn: () => launchApi.getAssets(productId as string),
    enabled: Boolean(productId),
  });

  return {
    assets: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch launch assets"),
    refetch: query.refetch,
  };
}

export function useCreateAsset(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateLaunchAssetInput) =>
      launchApi.createAsset(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createAsset: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create launch asset"),
    reset: mutation.reset,
  };
}

export function useUpdateAsset(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLaunchAssetInput }) =>
      launchApi.updateAsset(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateLaunchAssetInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateAsset: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update launch asset"),
    reset: mutation.reset,
  };
}

export function useDeleteAsset(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      launchApi.deleteAsset(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assets", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteAsset: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete launch asset"),
    reset: mutation.reset,
  };
}

/* ─── Channels ────────────────────────────────────────────────────────────── */

export function useChannels(productId?: string) {
  const query = useQuery({
    queryKey: ["channels", productId ?? null],
    queryFn: () => launchApi.getChannels(productId as string),
    enabled: Boolean(productId),
  });

  return {
    channels: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch launch channels"),
    refetch: query.refetch,
  };
}

export function useCreateChannel(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateChannelInput) =>
      launchApi.createChannel(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createChannel: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create channel"),
    reset: mutation.reset,
  };
}

export function useUpdateChannel(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateChannelInput }) =>
      launchApi.updateChannel(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateChannelInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateChannel: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update channel"),
    reset: mutation.reset,
  };
}

export function useDeleteChannel(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      launchApi.deleteChannel(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteChannel: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete channel"),
    reset: mutation.reset,
  };
}

/* ─── Checklist ───────────────────────────────────────────────────────────── */

export function useChecklist(productId?: string) {
  const query = useQuery({
    queryKey: ["checklist", productId ?? null],
    queryFn: () => launchApi.getChecklist(productId as string),
    enabled: Boolean(productId),
  });

  return {
    checklist: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch launch checklist"),
    refetch: query.refetch,
  };
}

export function useCreateChecklistItem(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateChecklistItemInput) =>
      launchApi.createChecklistItem(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createChecklistItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create checklist item"),
    reset: mutation.reset,
  };
}

export function useUpdateChecklistItem(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateChecklistItemInput;
    }) => launchApi.updateChecklistItem(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateChecklistItemInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateChecklistItem: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update checklist item"),
    reset: mutation.reset,
  };
}

export function useDeleteChecklistItem(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      launchApi.deleteChecklistItem(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checklist", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteChecklistItem: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete checklist item"),
    reset: mutation.reset,
  };
}
