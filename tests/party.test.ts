import { describe, expect, it } from "vitest";

import type { Party } from "@/types/party";
import type { ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";
import { getLongName, getPartyFullAndShortName } from "@/utils/party";

describe("getPartyFullAndShortName", () => {
  it("uses explicit PartyField.Abbr when present", () => {
    const party: Party = {
      [PartyField.Id]: "BOSA" as ReceiverId,
      [PartyField.Name]: "Build One South Africa",
      [PartyField.Short]: "Build One South Africa",
      [PartyField.Abbr]: "BOSA",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#fdb316",
      [PartyField.Years]: ["2022", "2026"],
    };

    expect(getPartyFullAndShortName(party)).toBe(
      "Build One South Africa (BOSA)",
    );
  });

  it("falls back to Short when Name differs from Short and Abbr is unset", () => {
    const party: Party = {
      [PartyField.Id]: "CDU" as ReceiverId,
      [PartyField.Name]: "Christlich Demokratische Union Deutschlands",
      [PartyField.Short]: "CDU",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#373737",
      [PartyField.Years]: ["2010", "2026"],
    };

    expect(getPartyFullAndShortName(party)).toBe(
      "Christlich Demokratische Union Deutschlands (CDU)",
    );
  });

  it("returns Short when Name is unset and Abbr is unset", () => {
    const party: Party = {
      [PartyField.Id]: "LABOUR" as ReceiverId,
      [PartyField.Short]: "Labour Party",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#E4003B",
      [PartyField.Years]: ["2010", "2026"],
    };

    expect(getPartyFullAndShortName(party)).toBe("Labour Party");
  });

  it("does not duplicate when Abbr is identical to Name", () => {
    const party: Party = {
      [PartyField.Id]: "GOOD" as ReceiverId,
      [PartyField.Short]: "GOOD",
      [PartyField.Abbr]: "GOOD",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#ec690d",
      [PartyField.Years]: ["2021", "2024"],
    };

    expect(getPartyFullAndShortName(party)).toBe("GOOD");
  });
});

describe("getLongName", () => {
  it("returns Name when set", () => {
    const party: Party = {
      [PartyField.Id]: "CDU" as ReceiverId,
      [PartyField.Name]: "Christlich Demokratische Union Deutschlands",
      [PartyField.Short]: "CDU",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#373737",
      [PartyField.Years]: ["2010", "2026"],
    };

    expect(getLongName(party)).toBe(
      "Christlich Demokratische Union Deutschlands",
    );
  });

  it("falls back to Short when Name is unset", () => {
    const party: Party = {
      [PartyField.Id]: "GOOD" as ReceiverId,
      [PartyField.Short]: "GOOD",
      [PartyField.Sum]: 100,
      [PartyField.Color]: "#ec690d",
      [PartyField.Years]: ["2021", "2024"],
    };

    expect(getLongName(party)).toBe("GOOD");
  });
});
