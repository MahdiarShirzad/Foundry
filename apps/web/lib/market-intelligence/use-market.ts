"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useWorkspace } from "../workspace/use-workspace";

import * as marketApi from "./api";
import type {
  CreateCompetitorInput,
  CreateOpportunityInput,
  CreateResearchNoteInput,
  CreateSegmentInput,
  MarketAggregate,
  UpdateCompetitorInput,
  UpdateOpportunityInput,
  UpdateSegmentInput,
} from "./api";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function requireIdeaId(ideaId: string | undefined): string {
  if (!ideaId) {
    throw new Error("Select an idea before working with market research.");
  }
  return ideaId;
}

/**
 * The whole market workspace for an idea — competitors, segments,
 * opportunities and notes in one aggregate. `null` means the workspace was
 * never initialized for this idea; every add below creates it first.
 */
export function useMarketIdea(ideaId?: string) {
  const query = useQuery<MarketAggregate | null>({
    queryKey: ["market-idea", ideaId ?? null],
    queryFn: () => marketApi.getMarketIdea(ideaId as string),
    enabled: Boolean(ideaId),
  });

  return {
    market: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to load market research"),
    refetch: query.refetch,
  };
}

/**
 * `POST /market-intelligence/:ideaId/init` is a get-or-create, so calling it
 * before the first add is safe even when the workspace already exists.
 */
function useEnsureMarketIdea(ideaId?: string) {
  const { data: workspace } = useWorkspace();

  return async () => {
    if (!workspace?.id) {
      throw new Error(
        "Your workspace is still loading. Try saving again in a moment.",
      );
    }
    await marketApi.initMarketIdea(requireIdeaId(ideaId), workspace.id);
  };
}

/** Every write invalidates the aggregate; the API keeps all lists in one GET. */
function useMarketInvalidation(ideaId?: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["market-idea", ideaId ?? null] });
  };
}

export function useMarketCompetitors(ideaId?: string) {
  const invalidate = useMarketInvalidation(ideaId);
  const ensureMarket = useEnsureMarketIdea(ideaId);

  const add = useMutation({
    mutationFn: async (input: CreateCompetitorInput) => {
      const id = requireIdeaId(ideaId);
      await ensureMarket();
      return marketApi.addCompetitor(id, input);
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCompetitorInput }) =>
      marketApi.updateCompetitor(requireIdeaId(ideaId), id, input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (competitorId: string) =>
      marketApi.removeCompetitor(requireIdeaId(ideaId), competitorId),
    onSuccess: invalidate,
  });

  return {
    addCompetitor: add.mutateAsync,
    updateCompetitor: update.mutateAsync,
    removeCompetitor: remove.mutateAsync,
    loading: add.isPending || update.isPending || remove.isPending,
    error: toErrorMessage(
      add.error ?? update.error ?? remove.error,
      "Failed to update competitors",
    ),
    reset: () => {
      add.reset();
      update.reset();
      remove.reset();
    },
  };
}

export function useMarketSegments(ideaId?: string) {
  const invalidate = useMarketInvalidation(ideaId);
  const ensureMarket = useEnsureMarketIdea(ideaId);

  const add = useMutation({
    mutationFn: async (input: CreateSegmentInput) => {
      const id = requireIdeaId(ideaId);
      await ensureMarket();
      return marketApi.addSegment(id, input);
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSegmentInput }) =>
      marketApi.updateSegment(requireIdeaId(ideaId), id, input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (segmentId: string) =>
      marketApi.removeSegment(requireIdeaId(ideaId), segmentId),
    onSuccess: invalidate,
  });

  return {
    addSegment: add.mutateAsync,
    updateSegment: update.mutateAsync,
    removeSegment: remove.mutateAsync,
    loading: add.isPending || update.isPending || remove.isPending,
    error: toErrorMessage(
      add.error ?? update.error ?? remove.error,
      "Failed to update market segments",
    ),
    reset: () => {
      add.reset();
      update.reset();
      remove.reset();
    },
  };
}

export function useMarketOpportunities(ideaId?: string) {
  const invalidate = useMarketInvalidation(ideaId);
  const ensureMarket = useEnsureMarketIdea(ideaId);

  const add = useMutation({
    mutationFn: async (input: CreateOpportunityInput) => {
      const id = requireIdeaId(ideaId);
      await ensureMarket();
      return marketApi.addOpportunity(id, input);
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOpportunityInput }) =>
      marketApi.updateOpportunity(requireIdeaId(ideaId), id, input),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (opportunityId: string) =>
      marketApi.removeOpportunity(requireIdeaId(ideaId), opportunityId),
    onSuccess: invalidate,
  });

  return {
    addOpportunity: add.mutateAsync,
    updateOpportunity: update.mutateAsync,
    removeOpportunity: remove.mutateAsync,
    loading: add.isPending || update.isPending || remove.isPending,
    error: toErrorMessage(
      add.error ?? update.error ?? remove.error,
      "Failed to update opportunities",
    ),
    reset: () => {
      add.reset();
      update.reset();
      remove.reset();
    },
  };
}

export function useMarketNotes(ideaId?: string) {
  const invalidate = useMarketInvalidation(ideaId);
  const ensureMarket = useEnsureMarketIdea(ideaId);

  const add = useMutation({
    mutationFn: async (input: CreateResearchNoteInput) => {
      const id = requireIdeaId(ideaId);
      await ensureMarket();
      return marketApi.addNote(id, input);
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (noteId: string) =>
      marketApi.removeNote(requireIdeaId(ideaId), noteId),
    onSuccess: invalidate,
  });

  return {
    addNote: add.mutateAsync,
    removeNote: remove.mutateAsync,
    loading: add.isPending || remove.isPending,
    error: toErrorMessage(
      add.error ?? remove.error,
      "Failed to update research notes",
    ),
    reset: () => {
      add.reset();
      remove.reset();
    },
  };
}
