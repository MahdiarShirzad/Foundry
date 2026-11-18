"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as validationApi from "./api";
import type {
  CreateEvidenceInput,
  CreateExperimentInput,
  CreateHypothesisInput,
  EvidenceFilters,
  UpdateEvidenceInput,
  UpdateExperimentInput,
  UpdateHypothesisInput,
} from "./api";
import type {
  EvidenceItem,
  Experiment,
  Hypothesis,
} from "../validation-lab/types";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireIdeaId(ideaId: string | undefined): string {
  if (!ideaId) {
    throw new Error("Select an idea before working with validation.");
  }
  return ideaId;
}

/* ─── Hypotheses ──────────────────────────────────────────────────────────── */

/** Collection of hypotheses for an idea. */
export function useHypotheses(ideaId?: string) {
  const query = useQuery({
    queryKey: ["hypotheses", ideaId ?? null],
    queryFn: () => validationApi.getHypotheses(ideaId as string),
    enabled: Boolean(ideaId),
  });

  return {
    hypotheses: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch hypotheses"),
    refetch: query.refetch,
  };
}

/** A single hypothesis. */
export function useHypothesis(ideaId?: string, id?: string) {
  const query = useQuery({
    queryKey: ["hypothesis", ideaId ?? null, id ?? null],
    queryFn: () => validationApi.getHypothesis(ideaId as string, id as string),
    enabled: Boolean(ideaId && id),
  });

  return {
    hypothesis: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch hypothesis"),
    refetch: query.refetch,
  };
}

export function useCreateHypothesis(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateHypothesisInput) =>
      validationApi.createHypothesis(requireIdeaId(ideaId), input),
    onSuccess: (hypothesis) => {
      queryClient.setQueryData<Hypothesis>(
        ["hypothesis", ideaId ?? null, hypothesis.id],
        hypothesis,
      );
      queryClient.invalidateQueries({
        queryKey: ["hypotheses", ideaId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createHypothesis: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create hypothesis"),
    reset: mutation.reset,
  };
}

export function useUpdateHypothesis(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHypothesisInput }) =>
      validationApi.updateHypothesis(requireIdeaId(ideaId), id, input),
    onSuccess: (hypothesis) => {
      queryClient.setQueryData<Hypothesis>(
        ["hypothesis", ideaId ?? null, hypothesis.id],
        hypothesis,
      );
      queryClient.invalidateQueries({
        queryKey: ["hypotheses", ideaId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateHypothesisInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateHypothesis: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update hypothesis"),
    reset: mutation.reset,
  };
}

export function useDeleteHypothesis(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      validationApi.deleteHypothesis(requireIdeaId(ideaId), id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["hypothesis", ideaId ?? null, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["hypotheses", ideaId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteHypothesis: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete hypothesis"),
    reset: mutation.reset,
  };
}

/* ─── Experiments ─────────────────────────────────────────────────────────── */

/** Collection of experiments for an idea, optionally scoped to a hypothesis. */
export function useExperiments(ideaId?: string, hypothesisId?: string) {
  const query = useQuery({
    queryKey: hypothesisId
      ? ["experiments", ideaId ?? null, hypothesisId]
      : ["experiments", ideaId ?? null],
    queryFn: () =>
      validationApi.getExperiments(ideaId as string, hypothesisId),
    enabled: Boolean(ideaId),
  });

  return {
    experiments: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch experiments"),
    refetch: query.refetch,
  };
}

/** A single experiment. */
export function useExperiment(ideaId?: string, id?: string) {
  const query = useQuery({
    queryKey: ["experiment", ideaId ?? null, id ?? null],
    queryFn: () => validationApi.getExperiment(ideaId as string, id as string),
    enabled: Boolean(ideaId && id),
  });

  return {
    experiment: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch experiment"),
    refetch: query.refetch,
  };
}

export function useCreateExperiment(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateExperimentInput) =>
      validationApi.createExperiment(requireIdeaId(ideaId), input),
    onSuccess: (experiment) => {
      queryClient.setQueryData<Experiment>(
        ["experiment", ideaId ?? null, experiment.id],
        experiment,
      );
      queryClient.invalidateQueries({
        queryKey: ["experiments", ideaId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createExperiment: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create experiment"),
    reset: mutation.reset,
  };
}

export function useUpdateExperiment(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateExperimentInput }) =>
      validationApi.updateExperiment(requireIdeaId(ideaId), id, input),
    onSuccess: (experiment) => {
      queryClient.setQueryData<Experiment>(
        ["experiment", ideaId ?? null, experiment.id],
        experiment,
      );
      queryClient.invalidateQueries({
        queryKey: ["experiments", ideaId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateExperimentInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateExperiment: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update experiment"),
    reset: mutation.reset,
  };
}

export function useDeleteExperiment(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      validationApi.deleteExperiment(requireIdeaId(ideaId), id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["experiment", ideaId ?? null, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments", ideaId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteExperiment: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete experiment"),
    reset: mutation.reset,
  };
}

/* ─── Evidence ────────────────────────────────────────────────────────────── */

/** Collection of evidence for an idea, optionally filtered by experiment/hypothesis. */
export function useEvidence(ideaId?: string, filters?: EvidenceFilters) {
  const filtered = Boolean(filters?.experimentId || filters?.hypothesisId);
  const query = useQuery({
    queryKey: filtered
      ? ["evidence", ideaId ?? null, filters]
      : ["evidence", ideaId ?? null],
    queryFn: () => validationApi.getEvidence(ideaId as string, filters),
    enabled: Boolean(ideaId),
  });

  return {
    evidence: query.data ?? [],
    findings: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch evidence"),
    refetch: query.refetch,
  };
}

/** A single evidence item. */
export function useEvidenceItem(ideaId?: string, id?: string) {
  const query = useQuery({
    queryKey: ["evidence-item", ideaId ?? null, id ?? null],
    queryFn: () =>
      validationApi.getEvidenceItem(ideaId as string, id as string),
    enabled: Boolean(ideaId && id),
  });

  return {
    evidence: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch evidence item"),
    refetch: query.refetch,
  };
}

export function useCreateEvidence(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateEvidenceInput) =>
      validationApi.createEvidence(requireIdeaId(ideaId), input),
    onSuccess: (evidence) => {
      queryClient.setQueryData<EvidenceItem>(
        ["evidence-item", ideaId ?? null, evidence.id],
        evidence,
      );
      queryClient.invalidateQueries({
        queryKey: ["evidence", ideaId ?? null],
      });
    },
  });

  return {
    create: mutation.mutateAsync,
    createEvidence: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create evidence"),
    reset: mutation.reset,
  };
}

export function useUpdateEvidence(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEvidenceInput }) =>
      validationApi.updateEvidence(requireIdeaId(ideaId), id, input),
    onSuccess: (evidence) => {
      queryClient.setQueryData<EvidenceItem>(
        ["evidence-item", ideaId ?? null, evidence.id],
        evidence,
      );
      queryClient.invalidateQueries({
        queryKey: ["evidence", ideaId ?? null],
      });
    },
  });

  const update = (id: string, input: UpdateEvidenceInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    updateEvidence: update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update evidence"),
    reset: mutation.reset,
  };
}

export function useDeleteEvidence(ideaId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) =>
      validationApi.deleteEvidence(requireIdeaId(ideaId), id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: ["evidence-item", ideaId ?? null, id],
      });
      queryClient.invalidateQueries({
        queryKey: ["evidence", ideaId ?? null],
      });
    },
  });

  return {
    remove: mutation.mutateAsync,
    deleteEvidence: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete evidence"),
    reset: mutation.reset,
  };
}
