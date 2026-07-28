---
name: add-country-data
description: Scaffold a new country's political-donation data loader for donationwatch — registering the country, wiring its flag and translations, and writing the DataLoader subclass that turns a government transparency source into donations/parties/country-config. Use when adding a new country's donation data to donationwatch. Does not cover changes to an already-registered country's existing loader.
---

# Adding a Country Data Loader

A country loader is a `DataLoader` subclass (see [`tasks/load-data/data-loader.ts`](../../../tasks/load-data/data-loader.ts)) that turns one government transparency source into the app's canonical `Donation`/`Party`/`CountryConfig` shape. Everything else — id generation, refund/negative-sum filtering, donor normalization bookkeeping, writing the output files — is handled by the base class; the subclass only fetches, caches, and extracts.

Full field-by-field reference (PartyConfig, COUNTRY_CONFIG, Features, and the quirks seen in production loaders) lives in [references/loader-reference.md](references/loader-reference.md) — open it from step 2 onward.

## Steps

### 1. Get ground truth from the user, don't invent it

Ask the user for, rather than guessing:

- An official flag SVG. **Never hand-write or programmatically generate a flag SVG** — ask the user to save one at `public/flags/<name>.svg` and optimize it first via [SVGOMG](https://jakearchibald.github.io/svgomg/). Hand-rolled flag paths are consistently wrong in ways that are easy to miss at review time (proportions, exact shades, missing charges), and nobody diff-reviews an SVG path at the point level before shipping it.
- The source name/URL, currency, minimum public-donation-disclosure amount, minimum data year, and (if elections drive the story) the relevant election dates.

Completion criterion: you have a real flag file path and the facts above confirmed by the user — no placeholder or memory-recalled values.

### 2. Register the country

In [`src/utils/countries.ts`](../../../src/utils/countries.ts):

- Add the lowercase full name to the `Country` const enum and the `COUNTRIES` set.
- Add the 2-letter code to `CountryCode`, and the currency to `Currency` if it's new.
- Add a `COUNTRY_CONFIG[Country.x]` entry (`id`, `minYear`, `legislativeYears`, `features`, `minPublicDonationAmount`, `currency`, `source`, `code`, `wikiCountry`, `markers`, `states`; `donorFilters`/`receiverFilters`/`knownPartyRequirements`/`projection` as needed — see the reference doc).

Completion criterion: `pnpm run lint` reports no errors touching `countries.ts`, and every field above holds a real value, not a placeholder.

### 3. Wire the flag

In [`src/utils/country-flags.ts`](../../../src/utils/country-flags.ts), import the SVG from step 1 and add it to the `countryFlags` map under the new `Country` key.

Completion criterion: the import resolves (the file from step 1 exists at that path) and the map has the new entry.

### 4. Add translations everywhere, not just `en.json`

`pnpm run test:i18n` enforces identical key sets across every file in `src/messages/*.json`. For the new country add, to **every** locale file:

- `countries.<CODE>` and `ref_countries.<CODE>` (the country's own name).
- `home.what.source.<country>` — the paragraph(s) describing the data source, keyed by the `Country` enum value (not the code).

English prose in the non-`en` files is an acceptable placeholder for a first pass (existing entries do this); the key must exist everywhere regardless.

`home.what.source.<country>` isn't just "here's who publishes this" — every existing entry states the disclosure threshold and start date, then a second paragraph of methodology caveats: update cadence, what's excluded (e.g. South Africa excludes indirect Multi-Party Democracy Fund contributions), scope changes mid-history (e.g. Germany's threshold dropped from €50,000 to €35,000 in 2024, Czechia's covers only parties crossing a count-or-sum threshold), or how ambiguous fields are classified (e.g. Czechia infers donor type from which name fields are present). Pull these from the same source you used for `minPublicDonationAmount`/`minYear` in step 2 — don't write a generic sentence and skip the caveats, they're what a reader actually needs to interpret the numbers correctly.

Completion criterion: `pnpm run test:i18n` passes.

### 5. Scaffold the loader shell

Create `tasks/load-data/<code>/<code>-loader.ts` (lowercase code) extending `DataLoader`, plus `tasks/load-data/<code>/donor-meta.ts` (usually just `export const donorMeta: DonorMetaDefinition = { donors: {} };`). Implement `cacheFile`, `loadYearDataToCache`, and `extractYearData`; start `parties` as `{}` — the next step fills it in. Register the class in [`tasks/load-data/loaders.ts`](../../../tasks/load-data/loaders.ts).

Completion criterion: the file type-checks (all abstract members implemented) and appears in `loaders.ts`.

### 6. Fetch once, then iterate against the cache

`loadYearDataToCache` (the network call) only runs when `FETCH_FROM_REMOTE=true`; `extractYearData` (the parsing you'll actually be debugging) always reads straight from the cache file on disk instead. So fetch from the live source exactly once per country per year range, then do all further development — the `parties` map, `extractYearData` bugs, `normalizeDonor`/`normalizeReceiver` fixes — against that cache. Re-fetching on every iteration is slow and repeatedly hits a government server for files that haven't changed.

`tasks/load-data/index.ts` normally prompts with checkboxes for country and years; `tasks/utils.ts` also accepts `COUNTRIES`/`YEARS` env vars that skip both prompts entirely — set **both**, since the years-checkbox still fires even when its answer goes unused (and note it only controls what gets _fetched_; `loader.run()` always processes every year from `minYear` onward regardless, so `YEARS=all` is what gets full-history party discovery in one pass). For a brand new country there's nothing cached yet, so the one live fetch looks like:

```bash
COUNTRIES=<CODE> YEARS=all pnpm run data:rebuild
```

Confirm with the user before running this one — it's the only command in this workflow that's `FETCH_FROM_REMOTE=true` and reaches an external endpoint. Every rerun after this, here and in later steps, uses `data:rebuild:cached` instead — never go back to `data:rebuild` just to re-check your extraction logic.

With an empty `parties` map, the run throws a `N unknown parties` error containing a stub JSON entry per party (name, sum, count). This is expected — it's your worklist, not a bug. Copy each stub into the `parties` map, then re-run against the now-populated cache to check your work:

```bash
COUNTRIES=<CODE> YEARS=all pnpm run data:rebuild:cached
```

Completion criterion: you have one `parties` entry per party named in the error, or a `knownPartyRequirements` threshold set deliberately to exclude the long tail of micro-parties.

### 7. Fill in verified party metadata, don't guess

For each party the stub gave you a fake `code` (`"<COUNTRY><i>"`) and a fake `color` (`"#ff0<i>"`) — replace both with real values:

- **Color**: source it from the party's official brand palette or logo. Do not recall it from memory — agent-recalled hex codes for foreign political parties are frequently wrong, sometimes matching a _different_ party's color entirely. If no reliable source color exists, set `color: RANDOM_COLOR_MARKER` (from `../util`) rather than inventing one — the data loader replaces it with a deterministic generated color at build time.
- **`wiki`**: this is a numeric Wikipedia **page id**, not a title. Do not recall it from memory — look it up (e.g. via the MediaWiki API, `action=query&titles=<Title>` against `https://<wikiCountry>.wikipedia.org/w/api.php`, using the country's `wikiCountry`) and read the real `pageid` key back from the response. A wrong id doesn't error at load time — `loadWikipediaPageExtract` swallows the failure — it just silently produces no article, caught only later by `tests/data-integrity.test.ts`.

Completion criterion: every party has a real code and short/long name reviewed by the user; every color is either a sourced brand color or the explicit `RANDOM_COLOR_MARKER`; every `wiki` id has been confirmed to resolve to the correct party's page via a live lookup, not memory.

### 8. Rebuild and verify

Run, in order:

```bash
COUNTRIES=<CODE> YEARS=all pnpm run data:rebuild:cached  # should complete with no unknown-parties error now
COUNTRIES=<CODE> pnpm run data:wikipedia                 # fetches article summaries for the wiki ids from step 7
pnpm run data:postprocess                                # derives party-sums/biggest-donors/most-recent/ai-docs, reads the wiki articles
pnpm run test:unit                                       # tests/data-integrity.test.ts and tests/countries.test.ts iterate all COUNTRIES automatically
pnpm run test:i18n
```

Completion criterion: every command above passes, and `src/data/<country>/party-sums.ts` and `wikipedia-articles.ts` exist and are non-empty.
