import { api } from "../apiClient";

import type {
  ApiIdea,
  ApiIdeaNote,
  CreateIdeaInput,
  CreateIdeaNoteInput,
  Idea,
  IdeaApiStatus,
  IdeaNote,
  IdeaStatusKey,
  UpdateIdeaInput,
} from "./types";

/** The API stores statuses in upper case; the UI uses lower-case keys. */
const STATUS_FROM_API: Record<IdeaApiStatus, IdeaStatusKey> = {
  INBOX: "inbox",
  EXPLORING: "exploring",
  SHORTLISTED: "shortlisted",
};

/**
 * The API returns full ISO timestamps while the presentation helpers expect
 * `YYYY-MM-DD`. Missing values become an empty string so date formatting never
 * produces `NaN`.
 */
function toDateOnly(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

function toIdeaNote(note: ApiIdeaNote): IdeaNote {
  return {
    id: note.id,
    author: note.author,
    initials: note.initials,
    date: toDateOnly(note.date),
    body: note.body,
  };
}

/** Map an API idea row onto the presentation `Idea` shape. */
export function toIdea(idea: ApiIdea): Idea {
  return {
    id: idea.id,
    ref: idea.ref,
    name: idea.name,
    headline: idea.headline ?? "",
    summary: idea.summary ?? "",
    problem: idea.problem ?? "",
    audience: idea.audience ?? "",
    // The idea table has no `solution` column yet, so the panel shows a blank
    // section until the backend exposes it.
    solution: "",
    category: idea.category,
    tags: idea.tags ?? [],
    status: STATUS_FROM_API[idea.status] ?? "inbox",
    capturedAt: toDateOnly(idea.capturedAt),
    updatedAt: toDateOnly(idea.updatedAt),
    source: idea.source ?? "",
    context: idea.context ?? "",
    openQuestions: idea.openQuestions ?? [],
    notes: (idea.notes ?? []).map(toIdeaNote),
  };
}

export async function getIdeas(productId: string): Promise<Idea[]> {
  const ideas = await api.get<ApiIdea[]>(
    `/ideas?productId=${encodeURIComponent(productId)}`,
  );
  return (ideas ?? []).map(toIdea);
}

export async function getIdeaById(id: string): Promise<Idea> {
  const idea = await api.get<ApiIdea>(`/ideas/${id}`);
  return toIdea(idea);
}

export async function createIdea(input: CreateIdeaInput): Promise<Idea> {
  const idea = await api.post<ApiIdea>("/ideas", input);
  return toIdea(idea);
}

export async function updateIdea(
  id: string,
  input: UpdateIdeaInput,
): Promise<Idea> {
  const idea = await api.patch<ApiIdea>(`/ideas/${id}`, input);
  return toIdea(idea);
}

export async function deleteIdea(id: string): Promise<void> {
  await api.delete<ApiIdea>(`/ideas/${id}`);
}

export async function addNote(
  ideaId: string,
  dto: CreateIdeaNoteInput,
): Promise<IdeaNote> {
  const note = await api.post<ApiIdeaNote>(`/ideas/${ideaId}/notes`, dto);
  return toIdeaNote(note);
}

export async function removeNote(
  ideaId: string,
  noteId: string,
): Promise<void> {
  await api.delete<ApiIdeaNote>(`/ideas/${ideaId}/notes/${noteId}`);
}
