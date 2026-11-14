"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as ideaApi from "./api";
import type { CreateIdeaInput, Idea, UpdateIdeaInput } from "./types";

function toErrorMessage(error: unknown, fallback: string): string | null {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/** Collection of ideas for a product. */
export function useIdeas(productId?: string) {
  const query = useQuery({
    queryKey: ["ideas", productId ?? null],
    queryFn: () => ideaApi.getIdeas(productId as string),
    enabled: Boolean(productId),
  });

  return {
    ideas: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch ideas"),
    refetch: query.refetch,
  };
}

/** A single idea, including its notes. */
export function useIdea(id?: string) {
  const query = useQuery({
    queryKey: ["idea", id ?? null],
    queryFn: () => ideaApi.getIdeaById(id as string),
    enabled: Boolean(id),
  });

  return {
    idea: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error, "Failed to fetch idea"),
    refetch: query.refetch,
  };
}

export function useCreateIdea() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input: CreateIdeaInput) => ideaApi.createIdea(input),
    onSuccess: (idea) => {
      queryClient.setQueryData<Idea>(["idea", idea.id], idea);
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });

  return {
    create: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to create idea"),
    reset: mutation.reset,
  };
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateIdeaInput }) =>
      ideaApi.updateIdea(id, input),
    onSuccess: (idea) => {
      queryClient.setQueryData<Idea>(["idea", idea.id], idea);
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });

  const update = (id: string, input: UpdateIdeaInput) =>
    mutation.mutateAsync({ id, input });

  return {
    update,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to update idea"),
    reset: mutation.reset,
  };
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => ideaApi.deleteIdea(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ["idea", id] });
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    loading: mutation.isPending,
    error: toErrorMessage(mutation.error, "Failed to delete idea"),
    reset: mutation.reset,
  };
}

export function useIdeaNotes(ideaId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
    queryClient.invalidateQueries({ queryKey: ["ideas"] });
  };

  const add = useMutation({
    mutationFn: (dto: { author: string; initials: string; body: string }) =>
      ideaApi.addNote(ideaId, dto),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (noteId: string) => ideaApi.removeNote(ideaId, noteId),
    onSuccess: invalidate,
  });

  return {
    addNote: add.mutateAsync,
    removeNote: remove.mutateAsync,
    loading: add.isPending || remove.isPending,
    error: toErrorMessage(
      add.error ?? remove.error,
      "Failed to update idea notes",
    ),
    reset: () => {
      add.reset();
      remove.reset();
    },
  };
}
