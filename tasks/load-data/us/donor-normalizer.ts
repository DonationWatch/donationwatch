import { DonationField } from "@/utils/types";

import type { ExtractedYearData } from "../data-loader";

const NICKNAMES: Record<string, string> = {
  TOM: "THOMAS",
  TOMMY: "THOMAS",
  BOB: "ROBERT",
  BOBBY: "ROBERT",
  ROB: "ROBERT",
  BILL: "WILLIAM",
  BILLY: "WILLIAM",
  JIM: "JAMES",
  JIMMY: "JAMES",
  MIKE: "MICHAEL",
  MICKEY: "MICHAEL",
  DICK: "RICHARD",
  RICK: "RICHARD",
  DAN: "DANIEL",
  DANNY: "DANIEL",
  DAVE: "DAVID",
  JOE: "JOSEPH",
  JOEY: "JOSEPH",
  KEN: "KENNETH",
  KENNY: "KENNETH",
  CHUCK: "CHARLES",
  CHARLIE: "CHARLES",
  CHRIS: "CHRISTOPHER",
  STEVE: "STEVEN",
  DON: "DONALD",
  DONNIE: "DONALD",
  RON: "RONALD",
  RONNIE: "RONALD",
  ED: "EDWARD",
  EDDIE: "EDWARD",
  ANDY: "ANDREW",
  MATT: "MATTHEW",
  NICK: "NICHOLAS",
  SAM: "SAMUEL",
  SAMMY: "SAMUEL",
  TONY: "ANTHONY",
  BEN: "BENJAMIN",
  BENNY: "BENJAMIN",
  GREG: "GREGORY",
  JEFF: "JEFFREY",
  DOUG: "DOUGLAS",
  ALEX: "ALEXANDER",
  LARRY: "LAWRENCE",
  PETE: "PETER",
};

const TITLE_REGEX =
  /\b(MR|MRS|MS|MISS|DR|MD|M\.D|PHD|PH\.D|ESQ|HON|HONORABLE|JUDGE|JUSTICE|DELEGATE|SEN|SENATOR|REP|REPRESENTATIVE|GOV|GOVERNOR|MAYOR|PROF|PROFESSOR|REV|REVEREND|PASTOR|RABBI|FATHER|GEN|GENERAL|COL|COLONEL|CAPT|CAPTAIN|MAJ|MAJOR|LT|LIEUTENANT|SGT|SERGEANT|ADM|ADMIRAL)(?:\.|\b)/gi;

const SUFFIX_REGEX = /(?:^|\s)(JR\.?|SR\.?|II\.?|III\.?|IV\.?|V\.?)(?:$|\s)/i;

/**
 * Normalizes an individual US donor name:
 * - Strips titles and honorifics (MR, MRS, MS, DR, DELEGATE, etc.)
 * - Strips parenthetical / quoted nicknames
 * - Standardizes suffixes (JR., SR., II, III, IV)
 * - Standardizes single-letter middle initials to have a dot
 */
export function cleanUsDonorName(raw: string): string {
  if (!raw) return "";
  let name = raw.trim();

  // If this doesn't look like an individual name (no comma separating Last, First), preserve as cleaned company/org
  if (!name.includes(",")) {
    return name.replace(/\s+/g, " ").trim();
  }

  // Strip parenthetical nicknames e.g. "(ANDY)", "(BOB)", "(RETIRED)"
  name = name.replace(/\s*\([^)]*\)/g, "");
  // Strip quoted nicknames e.g. "BOB"
  name = name.replace(/\s*"[^"]*"/g, "");

  // Split into Last and First/Middle/Suffix so titles are stripped only from the given name part,
  // preventing real surnames like "SERGEANT, ALEX", "JUSTICE, FRANK", or "PASTOR, GERALD" from being mutilated.
  const commaIdx = name.indexOf(",");
  let last = name.slice(0, commaIdx).trim();
  let first = name.slice(commaIdx + 1).trim();

  // Handle rare source typo where honorific was placed before comma: e.g. "MR, PENCE ROBERT F MR"
  if (/^(MR|MRS|MS|MISS|DR)\.?$/i.test(last)) {
    const parts = first.split(/\s+/);
    last = parts[0] || "";
    first = parts.slice(1).join(" ");
  }

  // If the given-name part consists solely of titles/honorifics (e.g. "AARON, DR." or "HUGHES, MR"),
  // preserve the standardized title rather than stripping it to an empty given name / bare mononym.
  const strippedFirst = first.replace(TITLE_REGEX, " ").trim();
  if (!strippedFirst) {
    let cleanTitle = first.toUpperCase().replace(/\.+/g, "").trim();
    if (
      [
        "MR",
        "MRS",
        "MS",
        "DR",
        "HON",
        "REV",
        "PROF",
        "GEN",
        "COL",
        "CAPT",
        "MAJ",
        "LT",
        "SGT",
      ].includes(cleanTitle)
    ) {
      cleanTitle += ".";
    }
    return `${last}, ${cleanTitle}`;
  }

  first = strippedFirst;
  name = `${last}, ${first}`;

  // Standardize suffixes
  name = name
    .replace(/\bJR\.?\b/gi, "JR.")
    .replace(/\bSR\.?\b/gi, "SR.")
    .replace(/\bII\.?\b/gi, "II")
    .replace(/\bIII\.?\b/gi, "III")
    .replace(/\bIV\.?\b/gi, "IV");

  // Normalize spaces, commas, and dots
  name = name
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();

  // Single-letter middle initial without dot: e.g. "GATES, WILLIAM H III" -> "GATES, WILLIAM H. III"
  name = name.replace(
    /^([^,]+,\s*[A-Z]+)\s+([A-Z])(?=\s+(?:JR\.|SR\.|II|III|IV)|$)/i,
    "$1 $2.",
  );

  // Clean multiple consecutive dots
  name = name.replace(/\.+/g, ".");

  // Single-letter middle initial without dot at end of name: e.g. "RYAN, SHIRLEY W" -> "RYAN, SHIRLEY W."
  name = name.replace(
    /^([^,]+,\s*[A-Z]+(?:\s+[A-Z]\.?)*)\s+([A-Z])$/i,
    "$1 $2.",
  );

  // Remove trailing comma or stray dots, preserving valid trailing suffix dot (JR., SR.) or middle initial ([A-Z].)
  if (!/\b(JR\.|SR\.|[A-Z]\.)\s*$/i.test(name)) {
    name = name.replace(/[,.\s]+$/, "").trim();
  }

  return name;
}

/**
 * Explicit manual donor aliases for US donors where automatic heuristic merging
 * would otherwise be impossible or ambiguous.
 */
export const US_MANUAL_DONOR_ALIASES: Record<string, string> = {
  // Melinda French Gates variations
  "FRENCH-GATES, MELINDA": "GATES, MELINDA FRENCH",
  "GATES, MELINDA": "GATES, MELINDA FRENCH",
  // S. Donald Sussman
  "SUSSMAN, S DONALD": "SUSSMAN, DONALD",
  "SUSSMAN, S. DONALD": "SUSSMAN, DONALD",
  "SUSSMAN, SELWYN DONALD": "SUSSMAN, DONALD",
  // Eric E. Schmidt
  "SCHMIDT, ERIC E.": "SCHMIDT, ERIC",
  "SCHMIDT, ERIC E": "SCHMIDT, ERIC",
  "SCHMIDT, ERIC M.": "SCHMIDT, ERIC",
  // J. Joe Ricketts
  "RICKETTS, J JOE": "RICKETTS, J. JOE",
  "RICKETTS, JOHN JOE": "RICKETTS, J. JOE",
  "RICKETTS, JOE": "RICKETTS, J. JOE",
  // Pete Ricketts
  "RICKETTS, J P.": "RICKETTS, J. PETER",
  "RICKETTS, JOHN PETER": "RICKETTS, J. PETER",
  "RICKETTS, PETE": "RICKETTS, J. PETER",
  // Biden campaign
  "BIDEN FOR PRESIDENT INC.": "BIDEN FOR PRESIDENT",
  "BIDEN FOR PRESIDENT INC": "BIDEN FOR PRESIDENT",
};

/**
 * Builds an alias map uniting middle-name / initial variants, nicknames, and
 * compound/maiden surname variations for matching individuals.
 */
export function buildUsDonorAliasMap(
  extractedData: ExtractedYearData[],
): Map<string, string> {
  const nameFreq = new Map<string, number>();

  for (const item of extractedData) {
    const raw = item[DonationField.DonorName];
    if (!raw) continue;
    const cleaned = cleanUsDonorName(raw);
    nameFreq.set(cleaned, (nameFreq.get(cleaned) || 0) + 1);
  }

  // Group cleaned individual names by Last, CanonicalFirst
  const groups = new Map<string, Set<string>>();

  for (const name of nameFreq.keys()) {
    const m = name.match(/^([^,]+),\s*([A-Z0-9]+)(.*)$/i);
    if (!m) continue;
    const last = m[1].trim().toUpperCase();
    const first = m[2].trim().toUpperCase();
    const canonicalFirst = NICKNAMES[first] || first;
    const key = `${last}|${canonicalFirst}`;
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key)!.add(name);
  }

  const aliasMap = new Map<string, string>();

  for (const [key, namesSet] of groups.entries()) {
    const names = Array.from(namesSet);
    if (names.length <= 1) continue;

    const [last, first] = key.split("|");
    const baseForm = `${last}, ${first}`;

    // Check suffixes
    const suffixMatches = names
      .map((n) => n.match(SUFFIX_REGEX)?.[1]?.toUpperCase().replace(/\.$/, ""))
      .filter(Boolean);
    const uniqueSuffixes = new Set(suffixMatches);

    // If conflicting suffixes exist (e.g. JR and SR, or II and III), do not merge across them
    if (uniqueSuffixes.size > 1) {
      continue;
    }

    // Check middle initials in this group
    const middleInitials = new Set<string>();
    for (const n of names) {
      const afterComma = n.split(", ")[1];
      if (!afterComma) continue;
      const parts = afterComma.split(" ");
      if (parts.length > 1) {
        const mid = parts[1].replace(/[^A-Z]/gi, "");
        if (mid && !["JR", "SR", "II", "III", "IV", "V"].includes(mid)) {
          middleInitials.add(mid[0]);
        }
      }
    }

    // If multiple different middle initials exist (e.g. A vs B), do not merge
    if (middleInitials.size > 1) {
      continue;
    }

    const singleSuffix =
      uniqueSuffixes.size === 1 ? Array.from(uniqueSuffixes)[0] : null;

    let target: string;
    if (singleSuffix) {
      // Must preserve the suffix
      const suffixCandidates = names.filter((n) =>
        new RegExp(`(?:^|\\s)${singleSuffix}\\.?(?:$|\\s)`, "i").test(n),
      );
      target = suffixCandidates.sort(
        (a, b) => (nameFreq.get(b) || 0) - (nameFreq.get(a) || 0),
      )[0];
    } else if (names.includes(baseForm)) {
      target = baseForm;
    } else {
      target = names.sort(
        (a, b) => (nameFreq.get(b) || 0) - (nameFreq.get(a) || 0),
      )[0];
    }

    if (!target) continue;

    for (const n of names) {
      if (n !== target) {
        aliasMap.set(n, target);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Compound & Maiden Surname Resolution:
  // Detects and links:
  //   - "A-B, FIRST" <-> "B, FIRST A" or "A, FIRST B"
  //   - "A B, FIRST" <-> "B, FIRST A" or "A-B, FIRST"
  // ---------------------------------------------------------------------------
  const currentCanonical = (n: string): string => {
    let curr = n;
    while (aliasMap.has(curr)) {
      curr = aliasMap.get(curr)!;
    }
    return curr;
  };

  const canonicalFreq = new Map<string, number>();
  for (const [name, freq] of nameFreq.entries()) {
    const canon = currentCanonical(name);
    canonicalFreq.set(canon, (canonicalFreq.get(canon) || 0) + freq);
  }

  const allCanonicals = new Set(canonicalFreq.keys());
  const unionParent = new Map<string, string>();

  const findRoot = (i: string): string => {
    if (!unionParent.has(i)) unionParent.set(i, i);
    if (unionParent.get(i) === i) return i;
    const r = findRoot(unionParent.get(i)!);
    unionParent.set(i, r);
    return r;
  };

  const unionElements = (a: string, b: string) => {
    const rootA = findRoot(a);
    const rootB = findRoot(b);
    if (rootA !== rootB) unionParent.set(rootA, rootB);
  };

  for (const name of allCanonicals) {
    if (!name.includes(",")) continue;
    const [last, after] = name.split(", ");
    if (!last || !after) continue;
    if (/\b(JR|SR|II|III|IV|V)\.?$/i.test(last)) continue;

    const first = after.split(" ")[0];

    // Hyphenated surname "L1-L2, FIRST"
    if (last.includes("-")) {
      const parts = last.split("-");
      if (parts.length === 2 && parts[0] && parts[1]) {
        const [l1, l2] = parts;
        const cand1 = `${l2}, ${first} ${l1}`;
        const cand2 = `${l1}, ${first} ${l2}`;
        if (allCanonicals.has(cand1)) unionElements(name, cand1);
        if (allCanonicals.has(cand2)) unionElements(name, cand2);
      }
    }

    // Unhyphenated compound surname "L1 L2, FIRST"
    if (last.includes(" ") && !last.includes("-")) {
      const parts = last.split(" ");
      if (
        parts.length === 2 &&
        parts[0] &&
        parts[1] &&
        ![
          "VAN",
          "DE",
          "DEL",
          "VON",
          "ST",
          "LA",
          "LE",
          "MC",
          "DI",
          "DU",
        ].includes(parts[0])
      ) {
        const [l1, l2] = parts;
        const cand1 = `${l2}, ${first} ${l1}`;
        const cand2 = `${l1}, ${first} ${l2}`;
        const candH = `${l1}-${l2}, ${after}`;
        if (allCanonicals.has(cand1)) unionElements(name, cand1);
        if (allCanonicals.has(cand2)) unionElements(name, cand2);
        if (allCanonicals.has(candH)) unionElements(name, candH);
      }
    }
  }

  // Merge connected compound surname components to the highest frequency member
  const compoundGroups = new Map<string, string[]>();
  for (const k of unionParent.keys()) {
    const r = findRoot(k);
    if (!compoundGroups.has(r)) compoundGroups.set(r, []);
    compoundGroups.get(r)!.push(k);
  }

  for (const group of compoundGroups.values()) {
    if (group.length <= 1) continue;
    const target = group.sort(
      (a, b) => (canonicalFreq.get(b) || 0) - (canonicalFreq.get(a) || 0),
    )[0];
    for (const member of group) {
      if (member !== target) {
        aliasMap.set(member, target);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Organization Legal Suffix Resolution:
  // Detects and links organizations differing only by legal suffixes:
  //   - "ORG INC" / "ORG INC." <-> "ORG"
  //   - "ORG LLC" / "ORG L.L.C." <-> "ORG"
  // ---------------------------------------------------------------------------
  const orgSuffixRegex =
    /\s*,?\s*\b(INC|LLC|L\.L\.C|CORP|CORPORATION|CO|COMPANY|LTD|LIMITED)\.?$/i;
  const orgGroups = new Map<string, string[]>();

  for (const name of allCanonicals) {
    if (name.includes(",")) continue; // skip individuals
    const baseOrg = name.replace(orgSuffixRegex, "").trim();
    if (!baseOrg) continue;
    if (!orgGroups.has(baseOrg)) orgGroups.set(baseOrg, []);
    orgGroups.get(baseOrg)!.push(name);
  }

  for (const group of orgGroups.values()) {
    if (group.length <= 1) continue;
    const target = group.sort((a, b) => {
      const freqDiff =
        (canonicalFreq.get(b) || 0) - (canonicalFreq.get(a) || 0);
      if (freqDiff !== 0) return freqDiff;
      return a.length - b.length;
    })[0];
    for (const member of group) {
      if (member !== target) {
        aliasMap.set(member, target);
      }
    }
  }

  // Apply explicit manual aliases
  for (const [source, target] of Object.entries(US_MANUAL_DONOR_ALIASES)) {
    const cleanedSource = cleanUsDonorName(source);
    const cleanedTarget = cleanUsDonorName(target);
    aliasMap.set(cleanedSource, cleanedTarget);
  }

  // Flatten transitive alias mappings (A -> B -> C becomes A -> C and B -> C)
  for (const [source, target] of aliasMap.entries()) {
    let resolved = target;
    const visited = new Set<string>([source]);
    while (aliasMap.has(resolved) && !visited.has(aliasMap.get(resolved)!)) {
      visited.add(resolved);
      resolved = aliasMap.get(resolved)!;
    }
    aliasMap.set(source, resolved);
  }

  return aliasMap;
}
