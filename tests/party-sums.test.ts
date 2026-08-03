import { beforeEach, describe, expect, test } from "vitest";

import type { PartyStats } from "@/types/party-stats";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { PartyStatField } from "@/types/party-stats";
import { hasYearSums } from "@/utils/party";

import euSums from "../src/data/europeanunion/party-sums";
import frSums from "../src/data/france/party-sums";
import nlSums from "../src/data/netherlands/party-sums";
import { skipIfFakeEnv } from "./config";

beforeEach((context) => {
  skipIfFakeEnv(context);
});

const hasExpectedDonations = (
  data: Record<string, PartyStats>,
  expected: [string, number][],
  skipOthers: boolean = false,
) => {
  if (!skipOthers) {
    expect(Object.keys(data).toSorted()).toEqual(
      expected
        .filter(([, value]) => value > 0)
        .map(([key]) => key)
        .toSorted(),
    );
  }

  for (const [key, value] of expected) {
    if (value === 0) continue;

    expect(data[key as string][PartyStatField.Sum], key).toBeCloseTo(
      value as number,
    );
  }
};

describe("NL", () => {
  test("2022 has expected values", async () => {
    const data = nlSums["2022"];

    hasExpectedDonations(data, [
      ["SP", 2_050_264.01],
      ["GL", 1_622_944.8],
      ["PVDD", 745_884.14],
      ["VVD", 428_950],
      ["D66", 280_657],
      ["CU", 167_120],
      ["VOLT", 162_458.6],
      ["CDA", 157_200.02],
      ["PVDA", 145_050.65],
      ["FVD", 92_500],
      ["JA21", 75_000],
      ["PVV", 35_000],
      ["BVNL", 34_000],
      ["BBB", 32_500],
      ["DENK", 10_395.51],
    ]);
  });

  test("2023 has expected values", async () => {
    const data = nlSums["2023"];

    hasExpectedDonations(data, [
      ["VVD", 3_592_775],
      ["SP", 2_079_972.93],
      ["GL", 1_834_481.85],
      ["D66", 680_401],
      ["FVD", 404_918],
      ["PVDA", 278_686.17],
      ["CU", 227_935],
      ["CDA", 199_197.04],
      ["PVDD", 197_224.81],
      ["BVNL", 192_351.21],
      ["VOLT", 172_928],
      ["BBB", 87_433],
      ["SGP", 77_016],
      ["JA21", 17_580],
      ["DENK", 6_850],
    ]);
  });

  test("2024 has expected values", async () => {
    const data = nlSums["2024"];

    hasExpectedDonations(data, [
      ["GL", 2_956_497.23],
      ["SP", 2_098_889.33],
      ["PVDA", 935_744.32],
      ["D66", 633_454.61],
      ["CDA", 567_307.6],
      ["PVDD", 395_968.24],
      ["VVD", 327_495],
      ["VOLT", 313_347.54],
      ["SGP", 259_465.85],
      ["CU", 141_599.18],
      ["FVD", 98_698],
      ["NSC", 68_649],
      ["DENK", 52_860],
      ["BBB", 44_700],
      ["BVNL", 30_114],
      ["JA21", 7_000],
      ["OPNL", 1_800],
    ]);
  });

  test("2025 has expected values", async () => {
    const data = nlSums["2025"];

    hasExpectedDonations(data, [
      ["PVV", 0],
      ["VVD", 554_000],
      ["GL", 1_160_009.72],
      ["PVDA", 205_000],
      ["NSC", 0],
      ["D66", 1_031_913.5],
      ["BBB", 0],
      ["CDA", 164_070.5],
      ["SP", 784_779.67],
      ["DENK", 10_000],
      ["PVDD", 514_310.13],
      ["FVD", 265_000],
      ["SGP", 104_500],
      ["CU", 90_000],
      ["VOLT", 246_849.73],
      ["JA21", 180_000],
    ]);
  });

  test("2026 has expected values", async () => {
    const data = nlSums["2026"];

    hasExpectedDonations(data, [
      ["D66", 430_090.0],
      ["VVD", 235_000.0],
      ["GL", 10_000],
      ["PVDA", 20_000],
      ["CDA", 10_000],
      ["FVD", 12_500],
      ["PVDD", 200_000.0],
      ["SP", 102_685.19],
    ]);
  });
});

describe("EU", () => {
  test("hasYearSums", async () => {
    const stat = {
      [PartyStatField.Sum]: 0,
      [PartyStatField.Count]: 0,
      [PartyStatField.LastDonation]: "2020-01-01",
    };

    const tests: [PartyYearsSums, string[], boolean][] = [
      [
        {
          "2020": { CDU: stat },
          "2021": { FDP: stat },
        },
        ["2020", "2021"],
        true,
      ],
      [
        {
          "2021": { FDP: stat },
          "2022": { FDP: stat },
        },
        ["2020", "2021"],
        true,
      ],
      [
        {
          "2020": { CDU: stat },
          "2021": { FDP: stat },
        },
        ["2018", "2019"],
        false,
      ],
    ];

    tests.forEach(([partySums, years, expected]) => {
      expect(hasYearSums(partySums, years)).toEqual(expected);
    });
  });

  test("2018 has expected values", async () => {
    const data = euSums["2018"];

    hasExpectedDonations(data, [
      ["ALDE", 12682.0 + 206200.0],
      ["ECPM", 15606.0 + 58359.99],
      ["ECR", 149732.87],
      ["EFA", 6490.0 + 11240.0],
      ["EGP", 1050.43],
      ["EL", 98.8],

      ["CF", 25_185.97],
      ["ELF", 15_130.25 + 5_420],
      ["FEPS", 74_152.69 + 401.5],
      ["GEF", 6212],
      ["IDF", 12_000],
      ["ND", 257_342.07 + 9676.5],
      ["SALLUX", 42_547.5 + 723.61],
      ["TE", 15_483.09 + 19_412.27],
      ["WMCES", 136_724.83],
    ]);
  });

  test("2019 has expected values", async () => {
    const data = euSums["2019"];

    hasExpectedDonations(data, [
      ["ALDE", 18626.5 + 39711.59],
      ["ECPM", 9606.0 + 66429.2],
      ["ECR", 2640.0 + 147932.65],
      ["EFA", 10 + 300],
      ["EGP", 8726.2],
      ["ID", 250],
      ["EL", 24.22],

      // foundations
      ["CF", 2727.45],
      ["ELF", 13_041.48],
      ["FEPS", 16_246.81],
      ["GEF", 12_128.7 + 5_485],
      ["ND", 175_460.5 + 2000],
      ["SALLUX", 16_948.41 + 714.04],
      ["TE", 4420 + 130],
      ["WMCES", 139_279.16],
    ]);
  });

  test("2020 has expected values", async () => {
    const data = euSums["2020"];

    hasExpectedDonations(data, [
      ["ALDE", 6524.85 + 37000],
      ["ECPM", 7034.74 + 40200.0],
      ["ECR", 4500.0 + 230424.02],
      ["EGP", 3279.0 + 450.0],
      ["ID", 4600.0],
      ["EL", 66.6],

      // foundations
      ["CF", 3_142.55],
      ["ELF", 14_468.19],
      ["FEPS", 2754.15],
      ["GEF", 19_375.66 + 2_846],
      ["ND", 249_424 + 2_000],
      ["SALLUX", 13_750 + 1_975],
      ["WMCES", 85_134.27],
      ["IED", 0],
      ["TE", 0],
    ]);
  });

  test("2021 has expected values", async () => {
    const data = euSums["2021"];

    hasExpectedDonations(data, [
      // parties
      ["ALDE", 76667.17],
      ["EGP", 8276.5],
      ["EFA", 7000.0],
      ["ID", 1000.0],
      ["EL", 194.0],
      ["ECR", 59612.0],
      ["ECPM", 45848.09],
      // foundations
      ["WMCES", 99_253.19],
      ["ELF", 37_911.94],
      ["IED", 250],
      ["GEF", 40_359.84],
      ["ND", 154_640.0],
      ["SALLUX", 11_530.0],
      ["FEPS", 1_500.0],
      ["TE", 664.0],
      ["CF", 23_495.25],
    ]);
  });

  test("2022 has expected values", async () => {
    const data = euSums["2022"];

    hasExpectedDonations(data, [
      // parties
      ["EPP", 0],
      ["PES", 0],
      ["ALDE", 127_000.18 + 27_131.8],
      ["EDP", 0],
      ["EGP", 3_225 + 5_006.91],
      ["EFA", 8_700],
      ["IDP", 0],
      ["EL", 76.2],
      ["ECR", 104_746.72 + 66_100],
      ["ECPM", 21_597 + 12_308],

      // foundation
      ["WMCES", 100_289.31],
      ["FEPS", 22_957.59],
      ["ELF", 750],
      ["IED", 1_000 + 500],
      ["GEF", 34_347.71 + 715],
      ["CF", 11994.88],
      ["IDF", 2_000],
      ["TE", 1_000 + 690],
      ["ND", 80_200 + 65_300],
      ["SALLUX", 5_500 + 560],
    ]);
  });

  test("2023 has expected values", async () => {
    const data = euSums["2023"];

    hasExpectedDonations(data, [
      ["ALDE", 200_692.32],
      ["ECR", 336_610.0],
      ["WMCES", 124_042.05],
      ["ELF", 69_355],
      ["GEF", 41_403.77 + 249.65],
      ["ND", 68_400 + 56_420],
      ["TE", 29_000 + 12_510],
      ["EGP", 14_351.7],
      ["CF", 11_400.71],
      ["ECPM", 18_138.53],
      ["SALLUX", 11_100 + 2_020.02],
      ["EPP", 145.0],
      ["EFA", 6_975.0],
      ["EL", 151.59],
      ["FEPS", 19_000],
      ["EDP", 250],
      ["IED", 500],
      ["IDF", 4_000],
    ]);
  });

  test("2024 has expected values", async () => {
    const data = euSums["2024"];

    hasExpectedDonations(data, [
      // parties
      ["EPP", 270],
      ["ALDE", 125_000 + 793.35],
      ["EDP", 250],
      ["EGP", 18_247 + 5_345],
      ["EFA", 6000],
      ["PATRIOTS", 1981],
      // THIS IS STILL A BIT UNCLEAR UNTIL APPF REPLIES
      ["EL", 5068.51],
      ["ECR", 123_258 + 33_706.09],
      ["ECPP", 23_965 + 11_743],
      ["ELA", 0],
      ["ESN", 0],

      // foundations
      ["WMCES", 210_296.15],
      ["FEPS", 32_000],
      ["ELF", 136_000],
      ["GEF", 32_600],
      ["CF", 25_006.42 + 390],
      ["PFE", 18_000],
      ["TE", 4_500 + 1_304],
      ["ND", 73_600 + 73_187.55],
      ["SALLUX", 21_050 + 1_280.34],
    ]);
  });

  test("2025 has expected values", async () => {
    const data = euSums["2025"];

    hasExpectedDonations(data, [
      // parties
      ["ALDE", 98_273.03],
      ["ECR", 47_000],
      ["ESN", 16_000],
      // foundations
      ["WMCES", 83566.7],
      ["ND", 69_000],
      ["ELF", 85000],
    ]);
  });

  test("2026 has expected values", async () => {
    const data = euSums["2026"];

    hasExpectedDonations(data, [
      // parties
      ["ALDE", 107_000],
      ["ECR", 15_000],
      // foundations
      ["WMCES", 50110.87],
      ["ND", 36_000],
      ["ELF", 53_000],
    ]);
  });
});

describe("FR", () => {
  test("2021 has expected values", async () => {
    const data = frSums["2021"];

    // https://www.vie-publique.fr/en-bref/288220-partis-politiques-publication-de-letat-des-comptes-2021
    hasExpectedDonations(
      data,
      [
        ["910", 4_709_512.95],
        ["401", 3_630_955.64],
        ["976", 956_146.29],
        ["40", 631_047],
        ["76", 545_939],
        ["104", 227_900],
        ["529", 142_485],
        // not in the blogpost
        ["1344", 169_564],
      ],
      true,
    );
  });
});
