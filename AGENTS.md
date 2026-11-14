# AGENTS.md

## Project Overview

[DonationWatch](https://donation.watch/) is an open-source Next.js application that tracks and visualizes political party donations across multiple countries. There is no database—all data is ingested by country loaders (`tasks/load-data/`) and pre-generated into static JSON files under `src/data/`.

## Target Audience

All user-facing copy, documentation, methodology notes, i18n strings, and data explanations serve five core groups:

- **Students (School & University):** Need accessible, educational explanations of political finance mechanisms, clear data structures, and foundational context for essays or research.
- **Investigative Journalists & Researchers:** Need exact transaction details, normalized figures, and verifiable methodology.
- **Transparency Advocates & Watchdogs:** Focus on institutional accountability, structural clarity, and open-source reporting.
- **Data Scientists & Developers:** Look for schema details, reporting/inclusion thresholds, and bulk data access.
- **Civic Citizens & Voters:** Need clear, jargon-free breakdowns of political funding sources.

## Tone & Writing Style

When writing UI copy, documentation, methodology notes, or generated content:

- **Non-partisan & Neutral:** Present facts without editorializing, political bias, or speculation about donor intent. Let the verified figures speak for themselves.
- **Accessible yet Precise:** Use plain, jargon-free language for civic readers and students, while keeping figures, currencies, dates, and legal/reporting thresholds exact for journalists and researchers. Define domain-specific terms (e.g., PAC, reporting threshold, soft money) briefly on first use.
- **Verifiable & Transparent:** Cite official government sources, state inclusion/exclusion rules, and distinguish clearly between raw official records and normalized/enriched fields (e.g., Wikipedia links, donor relations). Never invent or extrapolate missing data.
- **Structured & Scannable:** Prefer short sentences, concrete examples, tables, and clear headings over dense prose. Avoid marketing fluff, hype, or sensationalism.
- **Privacy-Aware:** Note anonymization or removal caveats accurately without claiming to alter upstream public government records.
- **No AI Filler or Em-Dashes:** Avoid em-dashes (`—`) and repetitive summary blocks that restate definitions already given above.

## UI & Frontend Conventions

- **shadcn & Base UI:** Install `src/components/ui/*` primitives via `pnpm dlx shadcn@latest add <component>` (or `npx shadcn@latest add <component>`) rather than hand-rolling them. This repo uses `@base-ui/react`, so active states use `data-pressed`, `aria-pressed`, or `data-checked` instead of `data-[state=on]`.
- **Default Text Color & Formatting:** Keep default foreground text color for textual sections, list items, and descriptions; avoid `text-muted-foreground` or hover color changes on non-interactive text. Do not bold currency sums in prose paragraphs.
- **Top-to-Bottom Control Placement:** Place static introductory copy above interactive controls, and place dynamic text or lists controlled by them below.

## Country-Specific Features & Data Loading

- **Feature Flags (`Features`):** Gate country-specific features with `Features` in `src/utils/features.ts` and `hasFeature(country, Features.<Flag>)` instead of hardcoding `country.id === "..."`. Enable flags per country in `src/utils/country-config.ts`.
- **Server-Loaded Country Datasets:** Load optional per-country datasets in Server Components (`page.tsx`) via dynamic `import()` gated by `hasFeature(...)`, then pass the data down as props. Do not statically import `src/data/<country>/*` inside `"use client"` components, so other countries' client bundles do not ship unused country data.

## i18n & Routing

- **Scoped Client Translations:** Client components using `useClientTranslations` only receive namespaces listed in `pick(messages, [...])` in the route's `layout.tsx` or `page.tsx`. Add new namespaces there and keep all `src/messages/*.json` files in sync.
- **Route vs. Formatting Locale:** Use `useLocale()` from `next-intl` for URL paths (`/${routeLocale}/${country.id}/...`), and `useBrowserBasedLocale()` only for currency, number, and date formatting.

## Key References

- [README.md](README.md) — Setup, project structure, and data pipeline overview.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Data loader maintenance, donor metadata, and Wikipedia sync.
- [.agents/skills/add-country-data/SKILL.md](.agents/skills/add-country-data/SKILL.md) — Step-by-step workflow for adding a new country.
