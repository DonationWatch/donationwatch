# Loader Reference

Disclosed reference for [`add-country-data`](../SKILL.md). Consult this from step 2 onward — registering `COUNTRY_CONFIG` and writing the loader both draw on it.

## File map

| Path                                                                                              | Written by                  | Contents                                                         |
| ------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------- |
| `tasks/load-data/<code>/<code>-loader.ts`                                                         | you                         | the `DataLoader` subclass                                        |
| `tasks/load-data/<code>/donor-meta.ts`                                                            | you                         | `DonorMetaDefinition` — usually `{ donors: {} }`                 |
| `tasks/load-data/<code>/.donations-cache/`                                                        | loader, at runtime          | raw fetched files, one per year                                  |
| `tasks/load-data/<code>/anonymized-donors.json`                                                   | you, optional               | array of donor names to redact — loaded automatically if present |
| `tasks/data/<code>/donations.ts`, `donor-meta.ts`, `transparency.ts`                              | `DataLoader.run()`          | generated, don't hand-edit                                       |
| `src/data/<country>/country-config.ts`, `parties.ts`, `build.ts`                                  | `DataLoader.run()`          | generated, don't hand-edit                                       |
| `src/data/<country>/party-sums.ts`, `biggest-donors.ts`, `biggest-donations.ts`, `most-recent.ts` | `pnpm run data:postprocess` | generated, don't hand-edit                                       |
| `src/data/<country>/wikipedia-articles.ts`, `public/data/<country>/wikipedia/by-pageId/*.json`    | `pnpm run data:wikipedia`   | generated, don't hand-edit                                       |

## `DataLoader` contract

Abstract members you implement (`tasks/load-data/data-loader.ts`):

- `parties: Record<string, PartyConfig>` — keyed by whatever string identifies the party in _your_ extracted data (source name, numeric id, etc.) — this key does not need to match the final `code`.
- `donorMeta: DonorMetaDefinition`.
- `cacheFile(year): string` — where the raw file for a year lives under `this.cacheDir`.
- `loadYearDataToCache(year): Promise<void>` — fetch/write the raw file. Only called when `FETCH_FROM_REMOTE=true` (see SKILL.md step 6 for the fetch-once-iterate-on-cache workflow this implies).
- `extractYearData(year): Promise<ExtractedYearData[]>` — parse the cached file into rows.

`ExtractedYearData` is a `Donation` minus `Id`/`Address`, plus a required `idx` (a per-row string unique within the year, e.g. `` `r${index}` ``, used for stable id generation) and `Address` typed as `ExtractedDonationAddress` (adds an optional `Zip`).

Useful overridable hooks: `normalizeDonor(donor, address)`, `normalizeReceiver(receiver)`, `partyId(party)`, `redactDonor(suffix?)`. Protected helpers: `normalizeIsoDate`, `cachedYearData(year, encoding?)`.

What the base class already does for you — don't reimplement:

- Filters donations below `minPublicDonationAmount` and before `minYear`.
- Drops any donor whose running sum across all their donations is ≤ 0 (refund handling) and any party whose running sum is negative.
- Generates `DonationField.Id` as `` `${year}-${index}` `` (oldest→newest) unless you set it yourself.
- Applies `color: RANDOM_COLOR_MARKER` → a deterministic generated color at write time.
- Throws a descriptive "N unknown parties" error (with a stub entry per party) for any party crossing `knownPartyRequirements` that isn't in your `parties` map.

### When you _do_ need to set `Id` yourself

If `COUNTRY_CONFIG[...].features` includes `Features.ExternalDonationIds`, set `[DonationField.Id]` in `extractYearData` to the source's own reference id (see `lv-loader.ts`, `uk-loader.ts`) instead of leaving it for auto-generation.

## `PartyConfig` fields

```ts
interface PartyConfig {
  color: `#${string}`; // or RANDOM_COLOR_MARKER — see step 7 of SKILL.md
  code: string; // final receiver id used across the app; must be unique per country
  short: string; // short display name; must be unique per country
  name: string; // full display name; only shown if different from `short`
  wiki?: number; // Wikipedia PAGE ID, not a title — see step 7 of SKILL.md
}
```

`tests/countries.test.ts` enforces uniqueness of `code`, `color`, `short`, and the long name within a country — a copy-pasted color or code from another party is a real failure mode when there are 50+ minor parties (see `ge-loader.ts`, which resorts to placeholder colors like `#ff0027` for parties with no known brand color — that pattern is a last resort, not a first choice).

## `COUNTRY_CONFIG` fields worth knowing

- `features` — bitmask of `Features` (`src/utils/features.ts`): `Date` (day-level dates vs. year-only), `Origin` (address has country/state), `DonorType`, `ExternalDonationIds`, `Donors` (has real donor names, as opposed to aggregate-only sources), `DonationType`.
- `knownPartyRequirements: { count, sum }` — a party only _needs_ an entry in `parties` once it crosses this count OR this sum (use `-1` on one side to check only the other). Without it, every single-donation micro-party demands an entry. See `cz`/`lv`/`hr`/`ge`/`ca`/`fr`/`ua` for real thresholds.
- `donorFilters` / `receiverFilters` — arrays of regex strings (case-insensitive) matched against the _normalized_ donor/receiver name to drop known noise (government bodies acting as pass-through, deregistered fringe committees). See `at`, `uk`, `au` for large examples — `au`'s receiver filter list in particular is a good template for handling independents/individual-politician "parties".
- `projection` — Lambert Conformal Conic params, only needed if the country gets a choropleth map.
- `wikiCountry: "en" | "de"` — which Wikipedia language edition `wiki` ids resolve against; must match how you looked the id up.

## Quirks seen in production loaders

- **Aggregate-only sources** (no individual donor names, only party totals per year): mark the donor with the `DONOR_TO_PARTY_BY_YEAR` sentinel from `@/utils/config` instead of inventing a fake name (see `se-loader.ts`).
- **Source returns everything in one request**, not segmented by year: guard `loadYearDataToCache`/`extractYearData` with a `loadedOnce`/`extractedOnce` instance flag so repeated calls (once per selected year) don't refetch or reprocess (see `se-loader.ts`).
- **Non-UTF8 / non-comma exports**: check the actual encoding and delimiter before parsing — `se-loader.ts` needs `utf16le` decoding and tab-delimited rows despite being a `.csv`.
- **Positional destructuring for wide rows**: destructure XLSX/CSV rows into named local variables in one place (a `rowFields()` helper) rather than indexing by number scattered through the code — makes source-language column names self-documenting and safe to reuse for dedup comparisons (see `ch-loader.ts`).
- **Duplicate/subtotal/grand-total rows** in spreadsheet exports: some sources repeat a row as a running subtotal on the next line — compare against the previous row's key fields and skip the duplicate (see `ch-loader.ts`'s dedup check) rather than assuming one row = one donation.
- **DataTables-style paginated APIs**: loop on `start`/`length`/`recordsTotal` until exhausted, incrementing a `draw` counter (see `ge-loader.ts`).
- **Currency/unit changes mid-history**: some countries change currency or convert amounts over time (e.g. `hr-loader.ts` converts HRK→EUR using period-specific historical rates for donations before the country's 2024 euro changeover) — don't assume one static conversion factor applies to the whole date range.
- **Party renames**: source data may keep using a party's old name after a real-world rename — map it in `normalizeReceiver` (see `ee-loader.ts` remapping several historical renames) rather than adding a second `parties` entry for the same party.
- **Redacted vs. anonymized donors** are different concepts: `redactDonor()` generates a unique per-row placeholder for a donor the source itself withheld; the `anonymized-donors.json` file (loaded automatically if present) instead maps specific _known_ donor names to the shared anonymized bucket at build time — use the file when you want to anonymize a real name across the whole dataset.
