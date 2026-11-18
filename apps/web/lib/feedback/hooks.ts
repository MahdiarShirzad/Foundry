"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as feedbackApi from "./api";
import type {
  CreateFeatureRequestInput,
  CreateFeedbackInput,
  CreateProductAreaInput,
  CreateThemeInput,
  UpdateFeatureRequestInput,
  UpdateFeedbackInput,
  UpdateProductAreaInput,
  UpdateThemeInput,
} from "./api";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireProductId(productId: string | undefined): string {
  if (!productId) {
    throw new Error("Select a product before working with feedback.");
  }
  return productId;
}

/* ─── Feedback items ──────────────────────────────────────────────────────── */

export function useFeedback(productId?: string) {
  const query = useQuery({
    queryKey: ["feedback", productId ?? null],
    queryFn: () => feedbackApi.getFeedback(productId as string),
    enabled: Boolean(productId),
  });

  return {
    feedback: query.data ?? [],
    items: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch feedback"),
    refetch: query.refetch,
  };
}

export function useCreateFeedback(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateFeedbackInput) =>
      feedbackApi.createFeedback(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createFeedback: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create feedback"),
    reset: mutation.reset,
  };
}

export function useUpdateFeedback(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFeedbackInput }) =>
      feedbackApi.updateFeedback(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateFeedbackInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateFeedback: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update feedback"),
    reset: mutation.reset,
  };
}

export function useDeleteFeedback(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      feedbackApi.deleteFeedback(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feedback", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteFeedback: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete feedback"),
    reset: mutation.reset,
  };
}

/** Summarise the product's feedback into key themes. */
export function useSummarizeFeedback(productId?: string) {
  const mutation = useMutation({
    mutationFn: () =>
      feedbackApi.summarizeFeedback(requireProductId(productId)),
  });

  return {
    summarize: mutation.mutateAsync,
    summarizeFeedback: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to summarize feedback"),
    reset: mutation.reset,
  };
}

/* ─── Themes ──────────────────────────────────────────────────────────────── */

export function useThemes(productId?: string) {
  const query = useQuery({
    queryKey: ["themes", productId ?? null],
    queryFn: () => feedbackApi.getThemes(productId as string),
    enabled: Boolean(productId),
  });

  return {
    themes: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch themes"),
    refetch: query.refetch,
  };
}

export function useCreateTheme(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateThemeInput) =>
      feedbackApi.createTheme(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["themes", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createTheme: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create theme"),
    reset: mutation.reset,
  };
}

export function useUpdateTheme(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateThemeInput }) =>
      feedbackApi.updateTheme(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["themes", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateThemeInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateTheme: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update theme"),
    reset: mutation.reset,
  };
}

export function useDeleteTheme(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      feedbackApi.deleteTheme(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["themes", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteTheme: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete theme"),
    reset: mutation.reset,
  };
}

/* ─── Feature requests ────────────────────────────────────────────────────── */

export function useFeatureRequests(productId?: string) {
  const query = useQuery({
    queryKey: ["requests", productId ?? null],
    queryFn: () => feedbackApi.getFeatureRequests(productId as string),
    enabled: Boolean(productId),
  });

  return {
    requests: query.data ?? [],
    featureRequests: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch feature requests"),
    refetch: query.refetch,
  };
}

export function useCreateFeatureRequest(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateFeatureRequestInput) =>
      feedbackApi.createFeatureRequest(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createFeatureRequest: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create feature request"),
    reset: mutation.reset,
  };
}

export function useUpdateFeatureRequest(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateFeatureRequestInput;
    }) =>
      feedbackApi.updateFeatureRequest(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateFeatureRequestInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateFeatureRequest: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update feature request"),
    reset: mutation.reset,
  };
}

export function useDeleteFeatureRequest(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      feedbackApi.deleteFeatureRequest(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requests", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteFeatureRequest: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete feature request"),
    reset: mutation.reset,
  };
}

/* ─── Product areas ───────────────────────────────────────────────────────── */

export function useProductAreas(productId?: string) {
  const query = useQuery({
    queryKey: ["areas", productId ?? null],
    queryFn: () => feedbackApi.getProductAreas(productId as string),
    enabled: Boolean(productId),
  });

  return {
    areas: query.data ?? [],
    definitions: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch product areas"),
    refetch: query.refetch,
  };
}

export function useCreateProductArea(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateProductAreaInput) =>
      feedbackApi.createProductArea(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createProductArea: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create product area"),
    reset: mutation.reset,
  };
}

export function useUpdateProductArea(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductAreaInput }) =>
      feedbackApi.updateProductArea(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateProductAreaInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateProductArea: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update product area"),
    reset: mutation.reset,
  };
}

export function useDeleteProductArea(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      feedbackApi.deleteProductArea(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["areas", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteProductArea: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete product area"),
    reset: mutation.reset,
  };
}
