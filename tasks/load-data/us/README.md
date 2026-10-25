# United States (FEC) Data Pipeline & PAC Discovery

This document explains how US campaign finance data from the Federal Election Commission (FEC) is ingested, how committee affiliations work, and how to discover and sync independent expenditure committees (Super PACs and Joint Fundraising Committees) for each election cycle.

---

## 1. Why PAC Affiliation Mapping Is Necessary

Under US federal election law:

- **Candidate Committees** (Presidential `P`, House `H`, Senate `S`) and **Official Party Committees** (National `X`, State `Y`, Local `Z`) report an official political party code in the FEC Committee Master (`cm.txt`), such as `DEM` or `REP`. These are **automatically ingested** without any manual configuration.
- **Super PACs** (independent expenditure-only committees, FEC type `O` or `U`) and **Joint Fundraising Committees** (type `J`) cannot legally coordinate directly with candidates and therefore have a **blank / empty party field** in FEC filings.

Because entities like _Make America Great Again Inc._ or _Future Forward USA PAC_ are partisan vehicles that channel hundreds of millions of dollars to one party's candidates and causes, DonationWatch attributes these committees to their supported party using [`tasks/load-data/us/pac-affiliations.ts`](./pac-affiliations.ts).

---

## 2. Integrity Safeguards

To prevent manual errors or regressions (such as misattributing a candidate or typo-ing an ID):

1. **Official Party Assertion**: If an FEC committee has an official party in `cm.txt`, the loader asserts that any manual mapping in `PAC_AFFILIATIONS` matches the official record. Any conflict throws a fatal build error.
2. **Name Verification**: Every entry in `PAC_AFFILIATIONS` requires `expectedNames: string[]`. During loading, the FEC committee name is validated against `expectedNames`. An ID typo or transposition immediately aborts the run.

---

## 3. Discovering Unmapped PACs for New Cycles

When ingesting a new election cycle or updating bulk files, newly established PACs may receive millions of dollars. Use the discovery CLI:

```bash
# Scan all cached cycles (2016–2026)
pnpm run us:discover-pacs

# Or analyze a specific cycle (e.g. 2026)
YEAR=2026 pnpm run us:discover-pacs
```

The script:

1. Inspects the FEC committee master (`cm.txt`) and individual contribution records (`indiv.zip`).
2. Totals all contributions $\ge \$10,000$ for committees without an official FEC party.
3. Filters out any committees already mapped in `PAC_AFFILIATIONS` and conduits (`CONDUIT_COMMITTEES`).
4. Prints a ranked table of the top unmapped committees by total receipts, showing their FEC Committee ID, Type, and Name.

### Example Output:

```text
C00835959  |    $173,984,881 | Type: U  | FAIRSHAKE
C00834077  |    $140,877,669 | Type: U  | NEVER BACK DOWN INC.
C00571588  |     $90,377,682 | Type: U  | RESTORATION PAC
C00838912  |     $55,047,458 | Type: J  | HARRIS ACTION FUND
```

---

## 4. How to Map a Newly Discovered Committee

1. Review the PAC's filings or public profile (e.g. OpenSecrets / FEC candidate endorsements).
2. If the PAC is aligned with a specific political party (e.g. _HARRIS ACTION FUND_ $\to$ `DEM`, _RESTORATION PAC_ $\to$ `REP`), map it to `DEM` or `REP`.
3. If the PAC is an independent, bipartisan, or issue-advocacy committee backing candidates of both parties (e.g. _FAIRSHAKE_ $\to$ `NON`, _UNITED DEMOCRACY PROJECT_ $\to$ `NON`), map it to `NON` so its megadonors appear in overall rankings under the neutral "Bipartisan & Nonpartisan PACs" category without distorting party totals.
4. Add the entry to [`tasks/load-data/us/pac-affiliations.ts`](./pac-affiliations.ts):

```typescript
C00838912: {
  party: "DEM",
  expectedNames: ["HARRIS ACTION FUND"],
},
C00835959: {
  party: "NON",
  expectedNames: ["FAIRSHAKE"],
},
```

---

## 5. Automated Build-Time Audit

During extraction (`loadYearDataToCache`), the pipeline continuously monitors contributions to unmapped committees. If any unmapped committee accumulates $\ge \$5,000,000$ in receipts, the loader issues a prominent alert:

```text
⚠️  [US Loader Audit] Found 1 unmapped committee(s) in cycle 2024 with >= $5M receipts:
   - C00834077 ($140,877,669): NEVER BACK DOWN INC.
   Run 'YEAR=2024 pnpm run us:discover-pacs' to inspect and categorize them in pac-affiliations.ts.
```

This ensures newly formed megadonor vehicles are never silently overlooked in future election cycles.
