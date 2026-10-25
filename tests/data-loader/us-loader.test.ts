import fs from "fs";
import path from "path";
import { beforeEach, describe, expect, test } from "vitest";

import { AddressField, DonationField, DonorType } from "@/utils/types";

import type { ExtractedYearData } from "../../tasks/load-data/data-loader";

import {
  buildUsDonorAliasMap,
  cleanUsDonorName,
} from "../../tasks/load-data/us/donor-normalizer";
import { PAC_AFFILIATIONS } from "../../tasks/load-data/us/pac-affiliations";
import {
  getCycleForYear,
  getCycleShort,
  isFecRefund,
  parseFecDate,
  parseFecRow,
  UsLoader,
  validatePacAffiliationEntry,
} from "../../tasks/load-data/us/us-loader";

let loader: UsLoader;

beforeEach(() => {
  loader = new UsLoader();
});

describe("US loader helper functions", () => {
  test.each([
    ["2015", "2016"],
    ["2016", "2016"],
    ["2017", "2018"],
    ["2018", "2018"],
    ["2019", "2020"],
    ["2020", "2020"],
    ["2023", "2024"],
    ["2024", "2024"],
  ])("maps year %s to 2-year FEC cycle %s", (year, expectedCycle) => {
    expect(getCycleForYear(year)).toBe(expectedCycle);
  });

  test.each([
    ["2016", "16"],
    ["2018", "18"],
    ["2020", "20"],
    ["2022", "22"],
    ["2024", "24"],
  ])("extracts short cycle %s -> %s", (cycle, expectedShort) => {
    expect(getCycleShort(cycle)).toBe(expectedShort);
  });

  test.each([
    ["05142020", "2020-05-14"],
    ["12312016", "2016-12-31"],
    ["01012024", "2024-01-01"],
    ["", null],
    ["12345", null],
    ["abcdefgh", null],
  ])("parses FEC MMDDYYYY date %s to ISO %s", (raw, expected) => {
    expect(parseFecDate(raw)).toBe(expected);
  });
});

describe("US loader row extractor and filters", () => {
  const context = {
    committeePartyMap: new Map([
      ["C00003418", "DEM"], // DNC
      ["C00003426", "REP"], // RNC
      ["C00694323", "REP"], // Trump Victory
      ["C00703975", "DEM"], // Mike Bloomberg 2020
      ["C00401224", "DEM"], // ActBlue (conduit)
      ["C00495861", "DEM"], // Senate Majority PAC
      ["C00571703", "REP"], // Senate Leadership Fund
    ]),
    trackedCommitteeNames: new Set([
      "SENATE MAJORITY PAC",
      "SMP",
      "SENATE LEADERSHIP FUND",
      "SLF",
      "DNC SERVICES CORP / DEMOCRATIC NATIONAL COMMITTEE",
    ]),
    priorYear: "2019",
    cycleYear: "2020",
  };

  const makeRow = (overrides: Partial<Record<number, string>> = {}) => {
    const cols = new Array(21).fill("");
    cols[0] = "C00003418"; // CMTE_ID (DNC)
    cols[5] = "15"; // TRANSACTION_TP (contribution)
    cols[6] = "IND"; // ENTITY_TP (individual)
    cols[7] = "SMITH, JOHN"; // NAME
    cols[9] = "CA"; // STATE
    cols[10] = "90210"; // ZIP
    cols[13] = "06152020"; // TRANSACTION_DT (2020-06-15)
    cols[14] = "25000"; // TRANSACTION_AMT ($25,000)
    cols[16] = "TRAN123"; // TRAN_ID
    cols[18] = ""; // MEMO_CD

    for (const [idx, val] of Object.entries(overrides)) {
      cols[Number(idx)] = val;
    }
    return cols;
  };

  test("extracts a valid individual contribution >= $10k", () => {
    const parsed = parseFecRow(makeRow(), context);
    expect(parsed).toBeDefined();
    expect(parsed!.isPrior).toBe(false);
    expect(parsed!.dedupKey).toBe("C00003418|TRAN123");

    const row = parsed!.row;
    expect(row[DonationField.Amount]).toBe(25000);
    expect(row[DonationField.DonorName]).toBe("SMITH, JOHN");
    expect(row[DonationField.Date]).toBe("2020-06-15");
    expect(row[DonationField.Receiver]).toBe("DEM");
    expect(row[DonationField.DonorType]).toBe(DonorType.Individual);
    expect(row[DonationField.Address]).toEqual({
      [AddressField.Country]: "US",
      [AddressField.State]: "CA",
      [AddressField.Zip]: "90210",
    });
  });

  test("assigns prior year flag for transactions in the first year of a cycle", () => {
    const cols = makeRow({ 13: "06152019" }); // 2019-06-15
    const parsed = parseFecRow(cols, context);
    expect(parsed).toBeDefined();
    expect(parsed!.isPrior).toBe(true);
  });

  test("filters out donations below $10,000 threshold", () => {
    const cols = makeRow({ 14: "9999" });
    expect(parseFecRow(cols, context)).toBeNull();
  });

  test("excludes candidate self-funding (15C, 16C, 16L)", () => {
    expect(parseFecRow(makeRow({ 5: "15C" }), context)).toBeNull();
    expect(parseFecRow(makeRow({ 5: "16C" }), context)).toBeNull();
    expect(parseFecRow(makeRow({ 5: "16L" }), context)).toBeNull();
  });

  test("identifies FEC refund transaction types", () => {
    expect(isFecRefund("22Y")).toBe(true);
    expect(isFecRefund("20Y")).toBe(true);
    expect(isFecRefund("21Y")).toBe(true);
    expect(isFecRefund("22Z")).toBe(true);
    expect(isFecRefund("40Y")).toBe(true);
    expect(isFecRefund("15")).toBe(false);
    expect(isFecRefund("15E")).toBe(false);
  });

  test("negates amount for refund transaction types (e.g. 22Y)", () => {
    const contribution = parseFecRow(
      makeRow({ 5: "15", 14: "10000", 16: "TRAN1" }),
      context,
    );
    const refund = parseFecRow(
      makeRow({ 5: "22Y", 14: "10000", 16: "TRAN2" }),
      context,
    );

    expect(contribution).toBeDefined();
    expect(contribution!.row[DonationField.Amount]).toBe(10000);

    expect(refund).toBeDefined();
    expect(refund!.row[DonationField.Amount]).toBe(-10000);

    // Summing both nets to 0
    expect(
      contribution!.row[DonationField.Amount] +
        refund!.row[DonationField.Amount],
    ).toBe(0);
  });

  test("excludes donors whose contributions are fully refunded (netting to $0)", () => {
    const contribution = parseFecRow(
      makeRow({ 7: "REFUNDED, DONOR", 5: "15", 14: "10000", 16: "TRAN1" }),
      context,
    )!.row;
    const refund = parseFecRow(
      makeRow({ 7: "REFUNDED, DONOR", 5: "22Y", 14: "10000", 16: "TRAN2" }),
      context,
    )!.row;
    const activeDonor = parseFecRow(
      makeRow({ 7: "ACTIVE, DONOR", 5: "15", 14: "25000", 16: "TRAN3" }),
      context,
    )!.row;

    const result = loader.processYearData([contribution, refund, activeDonor]);

    // Donor with net sum of 0 is excluded
    expect(
      result.donations.filter(
        (d) => d[DonationField.DonorName] === "REFUNDED, DONOR",
      ),
    ).toHaveLength(0);

    // Active donor is preserved
    expect(
      result.donations.filter(
        (d) => d[DonationField.DonorName] === "ACTIVE, DONOR",
      ),
    ).toHaveLength(1);
  });

  test("preserves both contribution and refund records when net donation is positive", () => {
    const contribution = parseFecRow(
      makeRow({ 7: "PARTIAL, DONOR", 5: "15", 14: "25000", 16: "TRAN1" }),
      context,
    )!.row;
    const refund = parseFecRow(
      makeRow({ 7: "PARTIAL, DONOR", 5: "22Y", 14: "10000", 16: "TRAN2" }),
      context,
    )!.row;

    const result = loader.processYearData([contribution, refund]);

    const donorEntries = result.donations.filter(
      (d) => d[DonationField.DonorName] === "PARTIAL, DONOR",
    );
    expect(donorEntries).toHaveLength(2);
    expect(
      donorEntries.map((d) => d[DonationField.Amount]).sort((a, b) => a - b),
    ).toEqual([-10000, 25000]);
  });

  test("filters out all memo entries (MEMO_CD='X')", () => {
    const conduitCols = makeRow({ 0: "C00401224", 18: "X" });
    expect(parseFecRow(conduitCols, context)).toBeNull();

    const recipientMemo = makeRow({ 0: "C00003418", 18: "X", 7: "WINRED" });
    expect(parseFecRow(recipientMemo, context)).toBeNull();
  });

  test("filters out conduit pass-throughs (24T or conduit committees)", () => {
    // WinRed conduit committee
    const winredConduit = makeRow({ 0: "C00694323", 5: "24T", 14: "50000" });
    expect(parseFecRow(winredConduit, context)).toBeNull();

    // ActBlue conduit committee
    const actblueConduit = makeRow({ 0: "C00401224", 5: "15", 14: "50000" });
    expect(parseFecRow(actblueConduit, context)).toBeNull();

    // Any other 24T earmarked forward line
    const any24t = makeRow({ 5: "24T", 14: "50000" });
    expect(parseFecRow(any24t, context)).toBeNull();
  });

  test("excludes inter-committee and Super PAC transfers (OTHER_ID, name-based, and transfer codes)", () => {
    // 1. OTHER_ID matches a tracked committee (e.g. Senate Majority PAC C00495861 giving to Priorities USA Action)
    const transferWithOtherId = makeRow({
      5: "10",
      6: "PAC",
      7: "SENATE MAJORITY PAC",
      14: "5000000",
      15: "C00495861",
    });
    expect(parseFecRow(transferWithOtherId, context)).toBeNull();

    // 2. Name-based match when OTHER_ID is blank (e.g. filer wrote SMP in NAME and entity_tp=PAC)
    const transferByName = makeRow({
      5: "10",
      6: "PAC",
      7: "SMP",
      14: "1500000",
      15: "",
    });
    expect(parseFecRow(transferByName, context)).toBeNull();

    // 3. Transfer transaction type 24G (transfer to affiliated committee)
    const transfer24G = makeRow({
      5: "24G",
      6: "PAC",
      7: "ANY PAC",
      14: "250000",
    });
    expect(parseFecRow(transfer24G, context)).toBeNull();

    // 4. In-kind committee transfer transaction type 15Z
    const inKind15Z = makeRow({
      5: "15Z",
      6: "PAC",
      7: "ANY COMMITTEE",
      14: "100000",
    });
    expect(parseFecRow(inKind15Z, context)).toBeNull();

    // 5. In-kind made to committee 24Z
    const inKind24Z = makeRow({
      5: "24Z",
      6: "PAC",
      7: "ANY COMMITTEE",
      14: "100000",
    });
    expect(parseFecRow(inKind24Z, context)).toBeNull();
  });

  test("preserves external 501(c)(4) dark money and conduit-earmarked individual donations", () => {
    // 1. 501(c)(4) organizational donation (Future Forward USA Action, One Nation)
    const c4Donation = makeRow({
      5: "15",
      6: "ORG",
      7: "FUTURE FORWARD USA ACTION",
      14: "10000000",
      15: "",
    });
    const parsedC4 = parseFecRow(c4Donation, context);
    expect(parsedC4).not.toBeNull();
    expect(parsedC4!.row[DonationField.DonorType]).toBe(DonorType.Company);

    // 2. Individual earmarked contribution through conduit (15E via ActBlue C00401224)
    const conduitEarmark = makeRow({
      5: "15E",
      6: "IND",
      7: "EARMARKED, INDIVIDUAL",
      14: "25000",
      15: "C00401224", // conduit ID in OTHER_ID
    });
    const parsedEarmark = parseFecRow(conduitEarmark, context);
    expect(parsedEarmark).not.toBeNull();
    expect(parsedEarmark!.row[DonationField.DonorType]).toBe(
      DonorType.Individual,
    );
  });

  test("filters out non-donation code 10 records (liquidations, interest, rentals)", () => {
    const stockSale = makeRow({
      5: "10",
      14: "100000",
      19: "TESLA STOCK SOLD VIA BROKER - PURCHASER UNKNOWN",
    });
    expect(parseFecRow(stockSale, context)).toBeNull();

    const interest = makeRow({
      5: "10",
      14: "25000",
      19: "INTEREST INCOME",
    });
    expect(parseFecRow(interest, context)).toBeNull();

    const listRental = makeRow({
      5: "10",
      14: "15000",
      19: "NON-CONTRIBUTION ACCOUNT: LIST RENTAL",
    });
    expect(parseFecRow(listRental, context)).toBeNull();

    // Legitimate unlimited contribution to Carey/Hybrid PAC non-contribution account is kept
    const legitCarey = makeRow({
      5: "10",
      14: "50000",
      19: "NON-CONTRIBUTION ACCOUNT",
    });
    expect(parseFecRow(legitCarey, context)).not.toBeNull();
  });

  test("filters out committees not mapped to a known party", () => {
    const unmappedCols = makeRow({ 0: "C99999999" });
    expect(parseFecRow(unmappedCols, context)).toBeNull();
  });

  test("correctly maps entity types", () => {
    const ind = parseFecRow(makeRow({ 6: "IND" }), context);
    expect(ind!.row[DonationField.DonorType]).toBe(DonorType.Individual);

    const pac = parseFecRow(makeRow({ 6: "PAC" }), context);
    expect(pac!.row[DonationField.DonorType]).toBe(
      DonorType.RegisteredPoliticalParty,
    );

    const com = parseFecRow(makeRow({ 6: "COM" }), context);
    expect(com!.row[DonationField.DonorType]).toBe(
      DonorType.RegisteredPoliticalParty,
    );

    const org = parseFecRow(makeRow({ 6: "ORG" }), context);
    expect(org!.row[DonationField.DonorType]).toBe(DonorType.Company);
  });
});

describe("US donor normalizer cleanUsDonorName edge cases", () => {
  test.each([
    ["GATES, THOMAS MR.", "GATES, THOMAS"],
    ["PACK, LAWRENCE A. DELEGATE SR.", "PACK, LAWRENCE A. SR."],
    ["GATES, ALONZO E. MR. II", "GATES, ALONZO E. II"],
    ["GATES, WILLIAM H. MR. III", "GATES, WILLIAM H. III"],
    ["GATES, WILLIAM H III", "GATES, WILLIAM H. III"],
    ["RYAN, SHIRLEY W. MRS.", "RYAN, SHIRLEY W."],
    ["HILES, NANCY A. MRS.", "HILES, NANCY A."],
    ["RICKETTS, MARLENE M. MRS.", "RICKETTS, MARLENE M."],
  ])(
    "strips honorifics and standardizes suffixes for %s -> %s",
    (raw, expected) => {
      expect(cleanUsDonorName(raw)).toBe(expected);
    },
  );

  test.each([
    ["SERGEANT, ALEX", "SERGEANT, ALEX"],
    ["JUSTICE, FRANK", "JUSTICE, FRANK"],
    ["MAJOR, ROBERT", "MAJOR, ROBERT"],
    ["PASTOR, GERALD", "PASTOR, GERALD"],
  ])(
    "does NOT strip legitimate surnames matching title words: %s -> %s",
    (raw, expected) => {
      expect(cleanUsDonorName(raw)).toBe(expected);
    },
  );

  test.each([
    ["AARON, DR.", "AARON, DR."],
    ["AARON, DR", "AARON, DR."],
    ["HUGHES, MR", "HUGHES, MR."],
    ["SMITH, MS.", "SMITH, MS."],
  ])(
    "preserves title when no given name is provided: %s -> %s",
    (raw, expected) => {
      expect(cleanUsDonorName(raw)).toBe(expected);
    },
  );

  test("correctly fixes source typo with title before comma", () => {
    expect(cleanUsDonorName("MR, PENCE ROBERT F MR")).toBe("PENCE, ROBERT F.");
    expect(cleanUsDonorName("MRS, GROFF PAMELA M MRS")).toBe(
      "GROFF, PAMELA M.",
    );
  });
});

describe("US donor alias map and party configuration", () => {
  test("UsLoader has expected party definitions", () => {
    expect(loader.parties.DEM).toBeDefined();
    expect(loader.parties.REP).toBeDefined();
    expect(loader.parties.LIB).toBeDefined();
    expect(loader.parties.GRE).toBeDefined();

    expect(loader.parties.DEM.code).toBe("DEM");
    expect(loader.parties.REP.code).toBe("GOP");
  });

  test("unifies middle initials and nicknames across donor records", () => {
    const rawDonations = [
      { [DonationField.DonorName]: "MUSK, ELON" },
      { [DonationField.DonorName]: "MUSK, ELON R." },
      { [DonationField.DonorName]: "BLOOMBERG, MICHAEL" },
      { [DonationField.DonorName]: "BLOOMBERG, MICHAEL R." },
      { [DonationField.DonorName]: "GATES, TOM" },
      { [DonationField.DonorName]: "GATES, THOMAS" },
    ] as unknown as ExtractedYearData[];

    const aliasMap = buildUsDonorAliasMap(rawDonations);

    expect(aliasMap.get("MUSK, ELON R.")).toBe("MUSK, ELON");
    expect(aliasMap.get("BLOOMBERG, MICHAEL R.")).toBe("BLOOMBERG, MICHAEL");
    expect(aliasMap.get("GATES, TOM")).toBe("GATES, THOMAS");
  });

  test("does not merge donors with conflicting suffixes or middle initials", () => {
    const rawDonations = [
      { [DonationField.DonorName]: "SMITH, JOHN JR." },
      { [DonationField.DonorName]: "SMITH, JOHN SR." },
      { [DonationField.DonorName]: "GATES, THOMAS A." },
      { [DonationField.DonorName]: "GATES, THOMAS B." },
    ] as unknown as ExtractedYearData[];

    const aliasMap = buildUsDonorAliasMap(rawDonations);

    expect(aliasMap.has("SMITH, JOHN JR.")).toBe(false);
    expect(aliasMap.has("SMITH, JOHN SR.")).toBe(false);
    expect(aliasMap.has("GATES, THOMAS A.")).toBe(false);
    expect(aliasMap.has("GATES, THOMAS B.")).toBe(false);
  });

  test("unifies compound, hyphenated, and maiden-as-middle surname variants", () => {
    const rawDonations = [
      { [DonationField.DonorName]: "FRENCH-GATES, MELINDA" },
      { [DonationField.DonorName]: "GATES, MELINDA FRENCH" },
      { [DonationField.DonorName]: "POWELL JOBS, LAURENE" },
      { [DonationField.DonorName]: "JOBS, LAURENE POWELL" },
      { [DonationField.DonorName]: "BLUHM-WOLF, MEREDITH" },
      { [DonationField.DonorName]: "WOLF, MEREDITH BLUHM" },
    ] as unknown as ExtractedYearData[];

    const aliasMap = buildUsDonorAliasMap(rawDonations);

    expect(aliasMap.get("FRENCH-GATES, MELINDA")).toBe("GATES, MELINDA FRENCH");
    expect(
      aliasMap.has("POWELL JOBS, LAURENE") ||
        aliasMap.has("JOBS, LAURENE POWELL"),
    ).toBe(true);
    expect(
      aliasMap.has("BLUHM-WOLF, MEREDITH") ||
        aliasMap.has("WOLF, MEREDITH BLUHM"),
    ).toBe(true);
  });

  test("unifies organization names differing only by legal suffixes (INC, LLC)", () => {
    const rawDonations = [
      { [DonationField.DonorName]: "BIDEN FOR PRESIDENT INC." },
      { [DonationField.DonorName]: "BIDEN FOR PRESIDENT" },
      { [DonationField.DonorName]: "STAND TOGETHER CHAMBER OF COMMERCE INC." },
      { [DonationField.DonorName]: "STAND TOGETHER CHAMBER OF COMMERCE" },
    ] as unknown as ExtractedYearData[];

    const aliasMap = buildUsDonorAliasMap(rawDonations);

    expect(aliasMap.get("BIDEN FOR PRESIDENT INC.")).toBe(
      "BIDEN FOR PRESIDENT",
    );
    expect(aliasMap.get("STAND TOGETHER CHAMBER OF COMMERCE INC.")).toBe(
      "STAND TOGETHER CHAMBER OF COMMERCE",
    );
  });
});

describe("US PAC affiliations validation and safeguards", () => {
  test("allows manual mapping when official party is absent or agrees", () => {
    expect(() =>
      validatePacAffiliationEntry(
        "C00571703",
        { party: "REP", expectedNames: ["SENATE LEADERSHIP FUND"] },
        "SENATE LEADERSHIP FUND",
        "",
      ),
    ).not.toThrow();

    expect(() =>
      validatePacAffiliationEntry(
        "C00580100",
        { party: "REP", expectedNames: ["MAKE AMERICA GREAT AGAIN PAC"] },
        "MAKE AMERICA GREAT AGAIN PAC",
        "REP",
      ),
    ).not.toThrow();

    expect(() =>
      validatePacAffiliationEntry(
        "C00835959",
        { party: "NON", expectedNames: ["FAIRSHAKE"] },
        "FAIRSHAKE",
        "",
      ),
    ).not.toThrow();
  });

  test("throws error when manual party contradicts official FEC party", () => {
    // Attempting to map Biden for President (DEM in cm.txt) to REP
    expect(() =>
      validatePacAffiliationEntry(
        "C00703975",
        { party: "REP", expectedNames: ["PRESERVE AMERICA PAC"] },
        "BIDEN FOR PRESIDENT",
        "DEM",
      ),
    ).toThrow(/Party conflict for committee C00703975/);
  });

  test("throws error when committee name does not match expected name(s)", () => {
    // Attempting to assign Preserve America PAC config to a transposed ID
    expect(() =>
      validatePacAffiliationEntry(
        "C00703975",
        { party: "DEM", expectedNames: ["PRESERVE AMERICA PAC"] },
        "HARRIS FOR PRESIDENT",
        "DEM",
      ),
    ).toThrow(/Committee name mismatch for C00703975/);
  });

  test("validates all PAC_AFFILIATIONS against cached FEC committee master files across all cycles", () => {
    const cmCacheDir = path.join(
      process.cwd(),
      "tasks/load-data/us/.donations-cache/cm",
    );
    if (!fs.existsSync(cmCacheDir)) return;

    const files = fs
      .readdirSync(cmCacheDir)
      .filter((f) => f.startsWith("cm") && f.endsWith(".txt"));

    for (const file of files) {
      const content = fs.readFileSync(path.join(cmCacheDir, file), "utf8");
      const lines = content.split("\n");
      const cmteNames = new Map<string, string>();
      const cmteOfficialParties = new Map<string, string>();

      for (const line of lines) {
        if (!line) continue;
        const parts = line.split("|");
        const cmteId = parts[0]?.trim();
        const cmteNm = parts[1]?.trim();
        const pty = parts[10]?.trim();
        if (cmteId) {
          if (cmteNm) cmteNames.set(cmteId, cmteNm);
          if (pty) cmteOfficialParties.set(cmteId, pty);
        }
      }

      for (const [cmteId, config] of Object.entries(PAC_AFFILIATIONS)) {
        const actualName = cmteNames.get(cmteId);
        const officialPty = cmteOfficialParties.get(cmteId);
        if (actualName) {
          expect(() =>
            validatePacAffiliationEntry(
              cmteId,
              config,
              actualName,
              officialPty,
            ),
          ).not.toThrow();
        }
      }
    }
  });

  test("normalizes committee names to party keys and populates transparencyData.normalizedReceivers", () => {
    loader.registerCommitteeName("BIDEN FOR PRESIDENT", "DEM");
    loader.registerCommitteeName("HARRIS FOR PRESIDENT", "DEM");

    const rows: ExtractedYearData[] = [
      {
        idx: "fec-C00703975-1",
        [DonationField.Amount]: 50000,
        [DonationField.DonorName]: "SMITH, JANE",
        [DonationField.Date]: "2024-06-01",
        [DonationField.Address]: { [AddressField.Country]: "US" },
        [DonationField.Receiver]: "BIDEN FOR PRESIDENT" as never,
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.OriginalReceiver]: "BIDEN FOR PRESIDENT",
      },
      {
        idx: "fec-C00703975-2",
        [DonationField.Amount]: 50000,
        [DonationField.DonorName]: "DOE, JOHN",
        [DonationField.Date]: "2024-08-01",
        [DonationField.Address]: { [AddressField.Country]: "US" },
        [DonationField.Receiver]: "HARRIS FOR PRESIDENT" as never,
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.OriginalReceiver]: "HARRIS FOR PRESIDENT",
      },
      {
        idx: "fec-C00879510-1",
        [DonationField.Amount]: 100000,
        [DonationField.DonorName]: "MUSK, ELON",
        [DonationField.Date]: "2024-09-01",
        [DonationField.Address]: { [AddressField.Country]: "US" },
        [DonationField.Receiver]: "AMERICA PAC" as never,
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.OriginalReceiver]: "AMERICA PAC",
      },
      {
        idx: "fec-C00580100-1",
        [DonationField.Amount]: 100000,
        [DonationField.DonorName]: "MELLON, TIMOTHY",
        [DonationField.Date]: "2024-09-02",
        [DonationField.Address]: { [AddressField.Country]: "US" },
        [DonationField.Receiver]: "MAKE AMERICA GREAT AGAIN PAC" as never,
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.OriginalReceiver]: "MAKE AMERICA GREAT AGAIN PAC",
      },
    ];

    const result = loader.processYearData(rows);

    // Final donations use PartyConfig.code ("DEM" and "GOP") and preserve DonationField.OriginalReceiver
    expect(
      result.donations.map((d) => d[DonationField.Receiver]).sort(),
    ).toEqual(["DEM", "DEM", "GOP", "GOP"]);
    expect(
      result.donations.map((d) => d[DonationField.OriginalReceiver]).sort(),
    ).toEqual([
      "AMERICA PAC",
      "BIDEN FOR PRESIDENT",
      "HARRIS FOR PRESIDENT",
      "MAKE AMERICA GREAT AGAIN PAC",
    ]);

    // Transparency page data records the aggregated committee names per party
    expect(result.transparencyData.normalizedReceivers).toEqual([
      ["DEM", ["BIDEN FOR PRESIDENT", "HARRIS FOR PRESIDENT"]],
      ["REP", ["AMERICA PAC", "MAKE AMERICA GREAT AGAIN PAC"]],
    ]);
  });
});
