# Bouquet counter: meaning and abuse protection

## What the number means

The displayed metric is **bouquets prepared to share**, not sent, delivered,
or opened gifts. Every share path counts the current draft at most once, all
sharing the same gift ID: a successful clipboard copy (message + link or link
only), a completed native share sheet (whatever target the sender picks,
including its Copy option), or a copy event from the link box that opens when sharing or copying fails.
Previewing, the link box appearing, cancelled or failed share sheets, and
failed clipboard writes do not count. A completed share sheet confirms only
that a target was chosen, not delivery. Copying the address bar or text
outside Bloom's share controls cannot be observed.

Each draft has a random UUID v4, persisted with the browser draft. Edits,
reloads, previews, and retries keep it. Starting another bouquet or applying
a new preset/mood initializes a new ID. Existing drafts without an ID acquire
one when restored; old gift links remain valid. Recipient views do not count.
The ID is also part of new gift URLs; it is not a secret or an access control.

Multiple recipients using the same gift still represent one bouquet. Anyone
can invent new IDs, so the counter remains an anonymous approximate activity
metric, not fraud-proof analytics. The existing `bouquet:count` value is
preserved; historical entries cannot be retrospectively deduplicated or
reclassified under this policy.

## Application protections

- The browser remembers up to 500 counted IDs in local storage, coalesces
  concurrent copies, and honors a server `Retry-After` cooldown. Blocked storage
  falls back to in-memory tracking with a warning; Redis remains authoritative.
- `POST /api/count` accepts only JSON `{ "giftId": "<lowercase UUID v4>" }`,
  streamed to a maximum of 128 bytes regardless of `Content-Length`. Extra
  fields, invalid IDs, unsupported media types, and cross-origin requests
  with a foreign `Origin` are rejected before Redis. Origin checks alone
  do not stop bots; nonbrowser clients can omit or forge Origin.
- One Redis Lua operation checks quotas, detects an existing gift marker,
  and increments the total for a new ID. Concurrent requests and ambiguous
  response-loss retries cannot double-count. Counted-ID markers have no expiry;
  they store `1`, not gift contents, and incur ongoing storage costs.
- Each validated request, **including duplicates**, consumes a quota slot:
  **10 per fixed minute and 50 per fixed hour**, whichever is reached first.
  Limited requests receive HTTP 429 plus `Retry-After` and do not increment.
  Fixed windows can allow adjacent-window bursts; they are not rolling limits.
  Quota keys expire at their window boundary.
- Vercel's `x-vercel-forwarded-for` header is used only when `VERCEL=1`.
  A server-only secret HMACs the normalized IP into quota keys; raw IPs are
  not passed to Redis. Shared-IP users share quotas; distributed IPs and IPv6
  address changes can evade per-IP limits. This is not bot-proof.
- No arbitrary `x-forwarded-for` fallback is trusted. Missing IP/secret on
  Vercel, or production outside Vercel without a trusted adapter, returns 503.
  Standalone Docker can build/serve pages but cannot record production counts
  without a future trusted-client-IP integration. Do not simulate Vercel
  headers on a public untrusted server.
- Local development uses one shared quota and an atomic-rename JSON file,
  serialized in one process. This is not a cross-process production backend.
- Counter errors and limits never prevent clipboard success. An explicit
  later copy can retry safely. The footer explicitly uses request-time
  rendering so its total is not frozen at build time; this makes pages using
  the root footer dynamic rather than statically generated. A full page
  request/refresh or GET reads the current total. The display is not
  live-polled and a reused layout during client navigation can retain its
  earlier value until a refresh.

## Deployment checklist (owner action)

1. Keep the existing Redis store and `bouquet:count` key. Use a writable
   credential pair from [`.env.example`](../.env.example). The provider must
   allow the script's EVAL, TIME, GET, EXISTS, INCR, SET (including EX), and DEL
   commands. All accessed keys are explicitly passed to the script. Retain
   the total and permanent gift markers; flushing or evicting them removes
   their persistence/deduplication guarantees.
2. Generate a private random secret, e.g. `openssl rand -hex 32`, and set
   `COUNTER_RATE_LIMIT_SECRET` in the relevant Vercel environments. Never
   paste it into docs, Git, public env variables, or chat. Keep it stable
   across releases; rotation resets quotas, not the aggregate or gift markers.
3. Configure Vercel Firewall/rate limiting for **POST `/api/count`**, according
   to the available plan. Start with a per-IP burst rule (for example 20
   requests per 60 seconds), retain platform DDoS protection, and inspect
   matched/blocked requests. If available, protect excessive GET traffic too.
   Do not throttle recipient gift pages or asset delivery using this rule.
   Verify actual plan capabilities and cost rather than assuming this rule
   has been deployed by repository changes.
   **Configured 2026-10-28:** custom rule "Counter POST rate limit" (Path
   equals `/api/count` AND Method equals POST; fixed window, 20 requests per
   60 seconds, keyed by IP; 429). It is a dashboard setting, not code, and
   applies to Production and Preview. GET is not rate-limited by it.
4. Each valid API attempt still invokes one Redis operation, even if the
   script rejects it as limited. Only edge blocking prevents that upstream
   traffic. Watch request volume, Redis command/storage usage, and 429/503
   rates; rate limiting is not a guarantee against unexpected bills.
5. Record the live total, deploy, and confirm it survives. Copy a new gift,
   repeat every share path (Share and both copy buttons),
   edit/reload it, and try from another browser:
   the same ID must add at most one. Start a new gift: one more is allowed.
6. In a controlled preview environment, issue 11 valid requests from one IP
   within one fixed minute: at most 10 are admitted and the next gets 429.
   Exercise 50 across minutes in one hour and verify hourly limiting.
   Confirm a retry after the boundary works. Shared-network behavior is
   intentional; tune only with measured evidence.
7. Verify concurrent duplicate requests, response-loss retry, and a Redis
   outage. Confirm correct counts, controlled 503s, logs without raw IPs or
   gift contents, and unaffected copying. Check edge rules block a controlled
   excess burst before it reaches the function/Redis.

Do not load-test the public deployment without approval. B01/B05/B10 retain
production acceptance gates until these results are recorded.

## Diagnosing unavailable counts

Server logs expose allowlisted diagnostic codes, never credentials, raw
upstream bodies, client IPs, or arbitrary exception messages:

- `redis_config_missing` / `redis_config_incomplete`: check the deployment's
  environment scope and use one complete REST credential pair. KV variables
  take precedence over native Upstash variables.
- `redis_url_invalid` / `redis_token_invalid`: use individual raw values, not
  shell assignments, quotes, spaces, or a `redis://` connection string.
- `redis_http_error` with status 401/403: verify the token/database pairing
  and permissions. Other statuses require provider availability/quota checks.
- `redis_timeout` / `redis_network_error`: check provider availability and
  connectivity; timeouts are bounded at three seconds.
- `redis_command_error` / `redis_response_invalid` / `counter_value_invalid`:
  inspect the provider console privately for command permissions or corrupt
  stored values; do not reset the existing total as a troubleshooting shortcut.
- `client_ip_missing` / `rate_limit_secret_invalid`: recording configuration
  failed; these cannot explain a failing GET.
- `client_platform_unsupported`: production writes lack a trusted IP adapter.

Redeploy after environment changes. Start with GET `/api/count` before testing
copies. Never paste tokens or full environment exports into support messages.

An absent key (`nil` in the Redis console, `null` in REST) is valid and reads
as zero. It does not explain an unavailable count. Owner configuration checks
and a console read alone do not verify the deployed app's REST access.

Diagnostic changes passed the full local suite (52 files / 253 tests),
type-check, lint, and production build. The deployed Redis failure remains
unresolved until a new deployment's diagnostic code identifies the cause.

## Local verification (2026-10-22)

- 51 test files / 244 tests passed, plus type-check, lint, and production build.
- The built Next.js app was probed over HTTP against an isolated miniredis
  v2.35.0 Lua runtime behind a local Redis-REST adapter. No real credentials,
  production counters, or public deployments were used.
- Thirty simultaneous requests for one ID from separate client identities
  yielded exactly one increment and 29 duplicates, retaining a seeded total.
- A concurrent 100-request burst from one identity admitted exactly 10 and
  rejected 90 with 429 and `Retry-After`. Fifty across successive minutes
  reached the hourly limit; advancing to the next hour restored admission.
- Restarting the app with the same fixture preserved the total and duplicate
  markers. A request to About showed the current footer total rather than a
  build snapshot. Stopping the fixture yielded controlled GET/POST 503s while
  the homepage remained HTTP 200.

The emulator is useful execution evidence, not proof of actual Upstash script
permissions, Vercel header behavior, distributed deployment durability, or
edge filtering. Those require the deployment checklist above.
