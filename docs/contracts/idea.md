# Idea — data contract (Idea Lab)

Single source of truth for the `Idea` entity the API will expose.
Frontend counterparts: `Idea` and `IdeaDraft` in `apps/web/lib/idea-lab/types.ts`.

Field names below are the **entity/response** names. Where the create request
uses a different key, the mapping is listed under [Create request](#create-request).

## Entity fields

| Field | Type | Required | Default | Rules |
| --- | --- | --- | --- | --- |
| `id` | `string` (ULID) | server | — | **Server-generated, client never sends it.** Opaque and non-guessable; immutable for the lifetime of the record. |
| `ref` | `string` | server | — | **Server-generated, client never sends it.** Format `IDEA-{NNN}` (zero-padded, e.g. `IDEA-001`). Counter is **per workspace**. A number is **never reused after deletion** — gaps are expected, duplicates are not. Display-only: shown in list rows and headers. |
| `name` | `string` | yes | — | Comes from `title` in the create request, trimmed. |
| `headline` | `string \| null` | no | `null` | One-liner shown under the name in the list and detail views. |
| `summary` | `string` | yes | — | One-line description. |
| `problem` | `string` | yes | — | Problem or opportunity. |
| `audience` | `string` | yes | — | Target audience. |
| `solution` | `string \| null` | no | `null` | Proposed solution. |
| `category` | `string \| null` | no | `null` | **Free text, not an enum and not a closed list.** No membership validation — only a length limit of **40 characters** (proposed; keep the limit here as the single place to change it) and trimming. Empty string normalises to `null`. UI renders `null`/empty as `Uncategorised`. |
| `tags` | `string[]` | no | `[]` | Each entry trimmed; empty entries dropped. |
| `keyAssumption` | `string \| null` | no | `null` | The single key assumption as one sentence. Comes from `assumption` in the create request. Multiple hypotheses live in Validation Lab, not here. |
| `context` | `string \| null` | no | `null` | Supporting context (where the idea came from). |
| `status` | `inbox \| exploring \| shortlisted` | no | `inbox` | Enum. Absent on create → `inbox`. |
| `source` | `string` | server | `manual` | **Server-only; the client never sends it.** Provenance of the idea. |
| `openQuestions` | `string[]` | no | `[]` | Server-managed on create. |
| `notes` | `array` of notes (`id`, `author`, `initials`, `date`, `body`) | no | `[]` | Server-managed on create. |
| `capturedAt` | `string` (ISO 8601) | server | request time | Immutable after creation. |
| `updatedAt` | `string` (ISO 8601) | server | request time | Bumped on every write. |

## Create request

Request body mirrors `IdeaDraft` (the shape the capture form already builds):

| Request field | → Entity field | Notes |
| --- | --- | --- |
| `title` | `name` | required, trimmed |
| `summary` | `summary` | required |
| `problem` | `problem` | required |
| `audience` | `audience` | required |
| `headline` | `headline` | optional (planned UI field) |
| `solution` | `solution` | optional (planned UI field) |
| `category` | `category` | optional; trim, `"" → null`, max 40 chars, no closed-list check |
| `tags` | `tags` | optional; default `[]` |
| `assumption` | `keyAssumption` | optional; `"" → null` |
| `context` | `context` | optional; `"" → null` |
| `status` | `status` | optional; default `inbox` |

Never accepted from the client: `id`, `ref`, `source`, `capturedAt`,
`updatedAt`, `openQuestions`, `notes`.
