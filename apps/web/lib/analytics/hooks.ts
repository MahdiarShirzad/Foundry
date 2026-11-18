"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as analyticsApi from "./api";
import type {
  CreateMetricInput,
  CreateObservationInput,
  CreateReportInput,
  CreateWeekSampleInput,
  UpdateMetricInput,
  UpdateObservationInput,
  UpdateReportInput,
  UpdateWeekSampleInput,
} from "./api";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireProductId(productId: string | undefined): string {
  if (!productId) {
    throw new Error("Select a product before working with analytics.");
  }
  return productId;
}

/* ─── Week samples ────────────────────────────────────────────────────────── */

export function useWeekSamples(productId?: string) {
  const query = useQuery({
    queryKey: ["weeks", productId ?? null],
    queryFn: () => analyticsApi.getWeekSamples(productId as string),
    enabled: Boolean(productId),
  });

  return {
    weeks: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch week samples"),
    refetch: query.refetch,
  };
}

export function useCreateWeekSample(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateWeekSampleInput) =>
      analyticsApi.createWeekSample(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks", productId ?? null] });
    },
  });

  return {
    create: mutation.mutateAsync,
    createWeekSample: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create week sample"),
    reset: mutation.reset,
  };
}

export function useUpdateWeekSample(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateWeekSampleInput;
    }) => analyticsApi.updateWeekSample(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks", productId ?? null] });
    },
  });

  const update = (id: string, input: UpdateWeekSampleInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateWeekSample: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update week sample"),
    reset: mutation.reset,
  };
}

export function useDeleteWeekSample(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      analyticsApi.deleteWeekSample(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weeks", productId ?? null] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteWeekSample: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete week sample"),
    reset: mutation.reset,
  };
}

/* ─── Metric definitions ──────────────────────────────────────────────────── */

export function useMetrics(productId?: string) {
  const query = useQuery({
    queryKey: ["metrics", productId ?? null],
    queryFn: () => analyticsApi.getMetrics(productId as string),
    enabled: Boolean(productId),
  });

  return {
    metrics: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch metrics"),
    refetch: query.refetch,
  };
}

export function useCreateMetric(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateMetricInput) =>
      analyticsApi.createMetric(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics", productId ?? null] });
    },
  });

  return {
    create: mutation.mutateAsync,
    createMetric: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create metric"),
    reset: mutation.reset,
  };
}

export function useUpdateMetric(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMetricInput }) =>
      analyticsApi.updateMetric(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics", productId ?? null] });
    },
  });

  const update = (id: string, input: UpdateMetricInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateMetric: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update metric"),
    reset: mutation.reset,
  };
}

export function useDeleteMetric(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      analyticsApi.deleteMetric(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics", productId ?? null] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteMetric: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete metric"),
    reset: mutation.reset,
  };
}

/* ─── Observations ────────────────────────────────────────────────────────── */

export function useObservations(productId?: string) {
  const query = useQuery({
    queryKey: ["observations", productId ?? null],
    queryFn: () => analyticsApi.getObservations(productId as string),
    enabled: Boolean(productId),
  });

  return {
    observations: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch observations"),
    refetch: query.refetch,
  };
}

export function useCreateObservation(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateObservationInput) =>
      analyticsApi.createObservation(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["observations", productId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createObservation: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create observation"),
    reset: mutation.reset,
  };
}

export function useUpdateObservation(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateObservationInput }) =>
      analyticsApi.updateObservation(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["observations", productId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateObservationInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateObservation: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update observation"),
    reset: mutation.reset,
  };
}

export function useDeleteObservation(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      analyticsApi.deleteObservation(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["observations", productId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteObservation: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete observation"),
    reset: mutation.reset,
  };
}

/* ─── Reports ─────────────────────────────────────────────────────────────── */

export function useReports(productId?: string) {
  const query = useQuery({
    queryKey: ["reports", productId ?? null],
    queryFn: () => analyticsApi.getReports(productId as string),
    enabled: Boolean(productId),
  });

  return {
    reports: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch reports"),
    refetch: query.refetch,
  };
}

export function useCreateReport(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateReportInput) =>
      analyticsApi.createReport(requireProductId(productId), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", productId ?? null] });
    },
  });

  return {
    create: mutation.mutateAsync,
    createReport: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create report"),
    reset: mutation.reset,
  };
}

export function useUpdateReport(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReportInput }) =>
      analyticsApi.updateReport(requireProductId(productId), id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", productId ?? null] });
    },
  });

  const update = (id: string, input: UpdateReportInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateReport: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update report"),
    reset: mutation.reset,
  };
}

export function useDeleteReport(productId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      analyticsApi.deleteReport(requireProductId(productId), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", productId ?? null] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteReport: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete report"),
    reset: mutation.reset,
  };
}

/* ─── AI ──────────────────────────────────────────────────────────────────── */

/** Interpret the latest weekly samples into trends, risks and opportunities. */
export function useInterpretMetrics(productId?: string) {
  const mutation = useMutation({
    mutationFn: () => analyticsApi.interpretMetrics(requireProductId(productId)),
  });

  return {
    interpret: mutation.mutateAsync,
    interpretMetrics: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to interpret metrics"),
    reset: mutation.reset,
  };
}
