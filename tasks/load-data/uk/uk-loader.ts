/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from "assert";
import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import path from "path";

import type { ExtractedDonationAddress, ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import {
  AddressField,
  DonationField,
  DonationType,
  DonorType,
} from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { containsWords, RANDOM_COLOR_MARKER } from "../util";
import { donorMeta } from "./donor-meta";

const toGBPFloat = (valueString: string) => {
  const ukFormat = valueString.substring(1).replaceAll(/,/g, "");

  return parseFloat(ukFormat);
};

const yearUrl = (year: string) =>
  `https://search.electoralcommission.org.uk/api/csv/Donations?start={start}&rows={pageSize}&query=&sort=AcceptedDate&order=desc&et=pp&date=Reported&from=&to=&rptPd=&prePoll=false&postPoll=true&quarters=${year}Q1234&register=gb&register=ni&register=none&period=3862&period=3865&period=3810&period=3765&period=3767&period=3718&period=3720&period=3714&period=3716&period=3710&period=3712&period=3706&period=3708&period=3702&period=3704&period=3698&period=3700&period=3676&period=3695&period=3604&period=3602&period=3600&period=3598&period=3594&period=3596&period=3578&period=3580&period=3574&period=3576&period=3570&period=3572&period=3559&period=3524&period=3567&period=3522&period=3520&period=3518&period=2513&period=2507&period=2509&period=2511&period=1485&period=1487&period=1480&period=1481&period=1477&period=1478&period=1476&period=1474&period=1471&period=1473&period=1466&period=463&period=1465&period=460&period=447&period=444&period=442&period=438&period=434&period=409&period=427&period=403&period=288&period=302&period=304&period=300&period=280&period=218&period=206&period=208&period=137&period=138&period=128&period=73&period=69&period=61&period=63&period=50&period=40&period=39&period=5&isIrishSourceYes=true&isIrishSourceNo=true&includeOutsideSection75=true`;

const toIsoDate = (stringValue: string, idx: number) => {
  const [dayPart, monthPart, yearPart] = stringValue.split("/");
  assert(
    dayPart && monthPart && yearPart,
    `Has valid date parts: ${stringValue} ${idx}`,
  );

  return `${yearPart}-${monthPart}-${dayPart}`;
};

// Mapping of electoral commission donation types to our owns
const ecDonationTypeToDonationType: Record<string, DonationType> = {
  Cash: DonationType.Money,
  "Non Cash": DonationType.PropertyOrService,
  "Public Funds": DonationType.PublicFunds,
  Visit: DonationType.PropertyOrService,
  "Exempt Trust": DonationType.Money,
  "Permissible Donor Exempt Trust": DonationType.Money,
  "Total value not reported individually": DonationType.Money,
};

export class UkLoader extends DataLoader {
  constructor() {
    super("UK", Country.unitedkingdom);
  }

  parties: Record<string, PartyConfig> = {
    "Liberal Democrats": {
      color: "#faa61a",
      code: "LIBDEMS",
      short: "Lib Dems",
      name: "Liberal Democrats",
      wiki: 18933007,
    },
    "Labour Party": {
      color: "#E4003B",
      code: "LABOUR",
      short: "Labour",
      name: "Labour Party",
      wiki: 19279158,
    },
    "UK Independence Party (UKIP)": {
      color: "#6d3177",
      code: "UKIP",
      short: "UKIP",
      name: "UK Independence Party",
      wiki: 217536,
    },
    "Conservative and Unionist Party": {
      color: "#00aeef",
      code: "TORIES",
      short: "Conservative Party",
      name: "Conservative and Unionist Party",
      wiki: 32113,
    },
    "Co-operative Party": {
      color: "#3f1d70",
      code: "COOPERATIVE",
      short: "Co-operative Party",
      name: "Co-operative Party",
      wiki: 397295,
    },
    "Scottish National Party (SNP)": {
      color: "#fdf38e",
      code: "SNP",
      short: "Scottish National Party",
      name: "Scottish National Party",
      wiki: 28887,
    },
    "Green Party": {
      color: "#198754",
      code: "GPEW",
      short: "Green Party",
      name: "Green Party of England and Wales",
      wiki: 79787,
    },
    "The Socialist Party of Great Britain": {
      color: "#d4180b",
      code: "SPGB",
      short: "Socialist Party",
      name: "Socialist Party of Great Britain",
      wiki: 43349821,
    },
    "Plaid Cymru - The Party of Wales": {
      color: "#005b54",
      code: "PLAIDCYMRU",
      short: "Plaid Cymru",
      name: "Plaid Cymru – the Party of Wales",
      wiki: 53343,
    },
    "Scottish Green Party": {
      color: "#00b140",
      code: "SCOTGREENS",
      short: "Scottish Greens",
      name: "Scottish Green Party",
      wiki: 169861,
    },
    "English Democrats": {
      color: "#dc132b",
      code: "ENDEMOCRATS",
      short: "English Democrats",
      name: "English Democrats",
      wiki: 424825,
    },
    "Trade Unionist and Socialist Coalition": {
      color: "#CE0000",
      code: "TUSC",
      short: "TUSC",
      name: "Trade Unionist and Socialist Coalition",
      wiki: 25818630,
    },
    "Communist Party of Britain": {
      color: "#ef432b",
      code: "CPB",
      short: "CPB",
      name: "Communist Party of Britain",
      wiki: 38646337,
    },
    "Women's Equality Party": {
      color: "#44225f",
      code: "WEP",
      short: "WEP",
      name: "Women's Equality Party",
      wiki: 46571291,
    },
    "British National Party": {
      color: "#085081",
      code: "BNP",
      short: "BNP",
      name: "British National Party",
      wiki: 4294,
    },
    "Sinn Féin": {
      color: "#12876F",
      code: "SF",
      short: "Sinn Féin",
      name: "Sinn Féin",
      wiki: 28175,
    },
    "People Before Profit": {
      color: "#D62249",
      code: "PBP",
      short: "PBP",
      name: "People Before Profit",
      wiki: 11416962,
    },
    "Democratic Unionist Party - D.U.P.": {
      color: "#0d2240",
      code: "DUP",
      short: "DUP",
      name: "Democratic Unionist Party",
      wiki: 221428,
    },
    "Alliance - Alliance Party of Northern Ireland": {
      color: "#000",
      code: "APNI",
      short: "Alliance",
      name: "Alliance Party of Northern Ireland",
      wiki: 359278,
    },
    "Traditional Unionist Voice - TUV": {
      color: "#001e4f",
      code: "TUV",
      short: "TUV",
      name: "Traditional Unionist Voice",
      wiki: 14601636,
    },
    "SDLP (Social Democratic & Labour Party)": {
      color: "#059670",
      code: "SDLP",
      short: "SDLP",
      name: "Social Democratic and Labour Party",
      wiki: 168464,
    },
    "Ulster Unionist Party": {
      color: "#2a4988",
      code: "UUP",
      short: "UUP",
      name: "Ulster Unionist Party",
      wiki: 70525,
    },
    Renew: {
      color: "#1dbfd6",
      code: "RENEW",
      short: "Renew",
      name: "Renew Party",
      wiki: 55573623,
    },
    "Yorkshire Party": {
      color: "#17abe2",
      code: "YORKSHIRE",
      short: "Yorkshire Party",
      name: "Yorkshire Party",
      wiki: 42497556,
    },
    Aspire: {
      color: "#010101",
      code: "ASPIRE",
      short: "Aspire",
      name: "Aspire",
      wiki: 56702172,
    },
    "Ashfield Independents": {
      color: "#020202",
      code: "ASHFIELD",
      short: "Ashfield Independents",
      name: "Ashfield Independents",
      wiki: 59379637,
    },
    "Scottish Socialist Party": {
      color: "#df0603",
      code: "SSP",
      short: "SSP",
      name: "Scottish Socialist Party",
      wiki: 42220071,
    },
    "Social Democratic Party": {
      color: "#c42c4b",
      code: "SDP",
      short: "SDP",
      name: "Social Democratic Party",
      wiki: 40605472,
    },
    "The Reclaim Party": {
      color: "#101010",
      code: "RECLAIM",
      short: "Reclaim Party",
      name: "Reclaim Party",
      wiki: 65440101,
    },
    "Reform UK": {
      color: "#00B1DA",
      code: "REFORM",
      short: "Reform UK",
      name: "Reform UK",
      wiki: 59757202,
    },
    "The Liberal Party": {
      color: "#e87639",
      code: "LIBERAL",
      short: "Liberal Party",
      name: "Liberal Party",
      wiki: 4482,
    },
    "The Official Monster Raving Loony Party": {
      color: "#ffff00",
      code: "OMRLP",
      short: "OMRLP",
      name: "Official Monster Raving Loony Party",
      wiki: 22592,
    },
    "Animal Welfare Party": {
      color: "#ee3763",
      code: "AWP",
      short: "AWP",
      name: "Animal Welfare Party",
      wiki: 15470934,
    },
    "Scottish Family Party": {
      color: "#0a2d58",
      code: "SFP",
      short: "SFP",
      name: "Scottish Family Party",
      wiki: 65894843,
    },
    "Rejoin EU": {
      color: "#0C1C3A",
      code: "REJOINEU",
      short: "Rejoin EU",
      name: "The Rejoin EU Party",
      wiki: 65894843,
    },
    "London Real Party": {
      color: "#050821",
      code: "LONDONREAL",
      short: "London Real Party",
      name: "The London Real Party",
      wiki: 66476803,
    },
    "Alba Party": {
      color: "#005EB8",
      code: "ALBA",
      short: "ALBA",
      name: "Alba Party",
      wiki: 67218982,
    },
    "True & Fair Party": {
      color: "#111111",
      code: "TRUEFAIR",
      short: "True & Fair",
      name: "True & Fair Party",
      wiki: 52187874,
    },
    "Breakthrough Party": {
      color: "#f28b3c",
      code: "BREAKTHROUGH",
      short: "Breakthrough",
      name: "Breakthrough Party",
      wiki: 67722679,
    },
    Propel: {
      color: "#0c8e36",
      code: "PROPEL",
      short: "Propel",
      name: "Propel",
      wiki: 31481679,
    },
    "Transform Party": {
      color: "#EA4D94",
      code: "TRANSFORM",
      short: "Transform",
      name: "Transform Party",
      wiki: 75619993,
    },
    "Workers Party of Britain": {
      color: "#1e28d8",
      code: "WPB",
      short: "Workers Party GB",
      name: "Workers Party of Britain",
      wiki: 67377546,
    },
    "Christian Peoples Alliance": {
      color: "#9400aa",
      code: "CPA",
      short: "CPA",
      name: "Christian Peoples Alliance",
      wiki: 528653,
    },
    "Socialist Labour Party": {
      color: "#e40613",
      code: "SLP",
      short: "SLP",
      name: "Socialist Labour Party",
      wiki: 39565355,
    },
    "Your Party": {
      name: "Your Party",
      short: "Your Party",
      code: "YOURPARTY",
      color: "#FF3131",
      wiki: 80517379,
    },
    "Open Party": {
      name: "Open Party",
      short: "Open Party",
      code: "OPENPARTY",
      color: "#f87988",
    },
    "Advance Together": {
      name: "Advance Together",
      short: "Advance",
      code: "ADVANCE",
      color: "#f82a8f",
      wiki: 58552565,
    },
    "The New Party": {
      name: "The New Party",
      short: "The New Party",
      code: "NEWPARTY",
      color: "#343634",
      wiki: 1759397,
    },
    "Jury Team": {
      name: "Jury Team",
      short: "Jury Team",
      code: "JURYTEAM",
      color: "#121212",
      wiki: 21872098,
    },
    "Cannabis is Safer than Alcohol": {
      name: "Cannabis is Safer than Alcohol",
      short: "CISTA",
      code: "CISTA",
      color: "#f84651",
      wiki: 46182492,
    },
    "The Independent Group for Change": {
      name: "The Independent Group for Change",
      short: "The Independent Group for Change",
      code: "CHANGEUK",
      color: "#000000",
      wiki: 60004953,
    },
    "Pro Democracy: Libertas.eu": {
      name: "Pro Democracy: Libertas.eu",
      short: "Pro Democracy: Libertas.eu",
      code: "LIBERTASEU",
      color: "#373b66",
    },
    "Independent Labour Group": {
      name: "Independent Labour Group",
      short: "ILP",
      code: "ILP",
      color: "#cc0000",
      wiki: 239528,
    },
    "All People's Party": {
      name: "All People's Party",
      short: "All People's Party",
      code: "APP",
      color: "#030303",
      wiki: 56036126,
    },
    "All For Unity": {
      name: "All For Unity",
      short: "All For Unity",
      code: "ALL4UNITY",
      color: "#0027b8",
      wiki: 66438227,
    },
    "Scottish Libertarian Party": {
      name: "Scottish Libertarian Party",
      short: "Scottish Libertarians",
      code: "SCOTLIB",
      color: "#005fa5",
      wiki: 50429322,
    },
    NO2EU: {
      name: "NO2EU",
      short: "NO2EU",
      code: "NO2EU",
      color: "#040404",
      wiki: 22480956,
    },
    "Tower Hamlets First": {
      name: "Tower Hamlets First",
      short: "Tower Hamlets First",
      code: "TOWERHAMLETSFIRST",
      color: "#e33d32",
      wiki: 42850137,
    },
    "Independent Kidderminster Hospital and Health Concern": {
      name: "Independent Kidderminster Hospital and Health Concern",
      short: "Independent Kidderminster Hospital and Health Concern",
      code: "HEALTHCONCERN",
      color: "#83a0b6",
      wiki: 457572,
    },
    "Veterans and People’s Party": {
      name: "Veterans and People’s Party",
      short: "Veterans and People’s Party",
      code: "VPP",
      color: "#c0a062",
      wiki: 60724048,
    },
    "Duma Polska = Polish Pride": {
      name: "Duma Polska = Polish Pride",
      short: "Duma Polska = Polish Pride",
      code: "DUMAPOLSKA",
      color: "#575757",
    },
    "Freedom and Responsibility": {
      name: "Freedom and Responsibility",
      short: "Freedom and Responsibility",
      code: "FREERESP",
      color: "#003744",
    },
    "We Demand A Referendum Now": {
      name: "We Demand A Referendum Now",
      short: "We Demand A Referendum Now",
      code: "WDARN",
      color: "#4e2583",
      wiki: 37049480,
    },
    "The Radical Party": {
      name: "The Radical Party",
      short: "The Radical Party",
      code: "RADICALPARTY",
      color: "#a82a1c",
    },
    "Socialist Alliance": {
      name: "Socialist Alliance",
      short: "Socialist Alliance",
      code: "SOCALLIANCE",
      color: "#ab2323",
    },
    "Don't Cook Party": {
      name: "Don't Cook Party",
      short: "Don't Cook Party",
      code: "DONTCOOK",
      color: "#de0c0a",
    },
    'Christian Party "Proclaiming Christ\'s Lordship"': {
      name: 'Christian Party "Proclaiming Christ\'s Lordship"',
      short: 'Christian Party "Proclaiming Christ\'s Lordship"',
      code: "CHRISTIANPARTY",
      color: "#3a0b71",
    },
    Life: {
      name: "Life",
      short: "Life",
      code: "LIFE",
      color: RANDOM_COLOR_MARKER,
    },
    "Fulham Group": {
      name: "Fulham Group",
      short: "Fulham Group",
      code: "FULHAMGRP",
      color: RANDOM_COLOR_MARKER,
    },
    "The Buckinghamshire Campaign for Democracy": {
      name: "The Buckinghamshire Campaign for Democracy",
      short: "The Buckinghamshire Campaign for Democracy",
      code: "BCFD",
      color: RANDOM_COLOR_MARKER,
    },
    "Solihull and Meriden Residents Association": {
      name: "Solihull and Meriden Residents Association",
      short: "Solihull and Meriden Residents Association",
      code: "SMRA",
      color: RANDOM_COLOR_MARKER,
    },
    Trust: {
      name: "Trust",
      short: "Trust",
      code: "TRUST",
      color: "#0092c8",
      wiki: 26760381,
    },
    "Democracy 2015": {
      name: "Democracy 2015",
      short: "Democracy 2015",
      code: "DEMOCRACY15",
      color: RANDOM_COLOR_MARKER,
    },
    "Both Unions Party of Northern Ireland": {
      name: "Both Unions Party of Northern Ireland",
      short: "Both Unions Party of Northern Ireland",
      code: "BOTHUNIONSNIRL",
      color: RANDOM_COLOR_MARKER,
    },
    "Hersham Village Society": {
      name: "Hersham Village Society",
      short: "Hersham Village Society",
      code: "HERSHAMSOC",
      color: RANDOM_COLOR_MARKER,
    },
    "Advance UK": {
      name: "Advance UK",
      short: "Advance UK",
      code: "ADVANCEUK",
      color: "#012169",
      wiki: 80323199,
    },
    "Great Yarmouth First": {
      name: "Great Yarmouth First",
      short: "Great Yarmouth First",
      code: "GYF",
      color: "#01183e",
      wiki: 81773588,
    },
    "Restore Britain": {
      name: "Restore Britain",
      short: "Restore Britain",
      code: "RESTOREBRITAIN",
      color: "#051E40",
      wiki: 80322064,
    },
  };

  donorMeta = donorMeta;

  async loadYearDataToCache(year: string): Promise<void> {
    const url = yearUrl(year);

    this.log(`Loading donation page for year ${year}: ${url}`);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Unable to load ${url}: ${res.status}`);
    }

    const resBuf = await res.arrayBuffer();

    // just decode as utf8
    const decoder = new TextDecoder("utf8");
    const csv = decoder.decode(resBuf);

    await fs.writeFile(this.cacheFile(year), csv, {
      encoding: "utf8",
    });
  }

  public extractor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    col: any[],
    idx: number,
  ): Omit<ExtractedYearData, "idx"> | undefined {
    if (idx === 0) return;

    const [
      ecRef,
      regulatedEntityName,
      regulatedEntityType,
      value,
      acceptedDate,
      accountingUnitName,
      donorName,
      accountingUnitsAsCentralParty,
      IsSponsorship,
      DonorStatus,
      RegulatedDoneeType,
      CompanyRegistrationNumber,
      Postcode,
      donationType,
      NatureOfDonation,
      PurposeOfVisit,
      DonationAction,
      ReceivedDate,
      ReportedDate,
      IsReportedPrePoll,
      ReportingPeriodName,
      IsBequest,
      IsAggregation,
      RegulatedEntityId,
      AccountingUnitId,
      DonorId,
      CampaigningName,
      RegisterName,
      IsIrishSource,
    ] = col;

    if (
      DonorStatus === "Impermissible Donor" ||
      donationType === "Impermissible Donor" ||
      donationType === "Unidentified Donor" ||
      typeof acceptedDate !== "string" ||
      acceptedDate.trim().length === 0
    ) {
      return;
    }

    const isoDate = toIsoDate(acceptedDate.trim(), idx);
    const amount = toGBPFloat(value);

    const donorTypeMapping: Record<string, DonorType> = {
      Individual: DonorType.Individual,
      Company: DonorType.Company,
      "Trade Union": DonorType.TradeUnion,
      "Public Fund": DonorType.PublicFund,
      "Unincorporated Association": DonorType.UnincorporatedAssociation,
      "Registered Political Party": DonorType.RegisteredPoliticalParty,
      Trust: DonorType.Trust,
      "Friendly Society": DonorType.FriendlySociety,
      "Limited Liability Partnership": DonorType.LimitedLiabilityPartnership,
      "Building Society": DonorType.BuildingSociety,
    };

    return {
      [DonationField.Id]: ecRef,
      [DonationField.Date]: this.normalizeIsoDate(isoDate),
      [DonationField.Receiver]: regulatedEntityName as ReceiverId,
      [DonationField.Amount]: amount,
      [DonationField.DonorName]: donorName,
      [DonationField.DonorType]:
        donorTypeMapping[DonorStatus] ?? DonorType.Other,
      [DonationField.Address]: { [AddressField.Country]: "UK" },
      [DonationField.DonationType]:
        ecDonationTypeToDonationType[donationType] ?? DonationType.Money,
    };
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const csv = await this.cachedYearData(year);
    const rows = parse(csv, {
      delimiter: ",",
      skip_empty_lines: true,
      columns: false,
    });

    return (
      rows
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((row: any[], idx: number) => {
          const extracted = this.extractor(row, idx);

          if (!extracted) return;

          return {
            idx: `r${idx}`,
            ...extracted,
          };
        })
        // remove empty rows
        .filter(Boolean)
    );
  }

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.csv`);
  }

  protected override normalizeReceiver(receiver: string): string {
    const normalized = super
      .normalizeReceiver(receiver)
      // remove [De-registered DD/MM/YY] from the name
      .replace(/\s*\[De-registered.*]$/, "");

    return normalized;
  }

  protected override normalizeDonor(
    receiver: string,
    address: ExtractedDonationAddress,
  ): string {
    receiver = super.normalizeDonor(receiver, address);
    receiver = receiver
      .replace(" Deceased", "")
      .replace(/^Mr /, "")
      .replace(/^Mrs /, "")
      .replace(/^Ms /, "")
      // remove trailing "(THE)" or " (THE)"
      .replace(/ ?\(THE\)$/i, "")
      // replace trailing " Limited" with " Ltd"
      .replace(/ Limited$/i, " Ltd");

    const lower = receiver.toLowerCase();
    if (lower.includes("archibald") && lower.includes("tunnock"))
      return "Archibald Boyd Tunnock";
    if (lower.includes("hosking") && lower.includes("jeremy"))
      return "Jeremy J Hosking";
    if (lower.includes("union of shop"))
      return "Union of Shop, Distributive and Allied Workers (USDAW)";
    if (lower.startsWith("Lord David Sainsbury")) return "Lord David Sainsbury";
    if (lower.includes("electoral commission")) return "Electoral Commission";

    if (lower === "lord john d sainsbury") {
      return "Lord John Sainsbury";
    }

    if (lower === "andreas uttermann") {
      // There's a donation in 2010 from "Andreas Uttermann" which is actually from "Andreas Utermann".
      // This is a typo currently in the upstream data (https://search.electoralcommission.org.uk/English/Donations/C0024817)
      return "Andreas Utermann";
    }

    if (
      lower.includes("david sainsbury") ||
      lower.includes("david j sainsbury")
    ) {
      return "Lord David Sainsbury";
    }

    if (lower.includes("timothy sainsbury")) {
      return "Sir Timothy Sainsbury";
    }

    if (lower.includes("vincent") && lower.includes("cable")) {
      return "Sir John Vincent Cable";
    }

    // christopher harborne
    // christopher charles sherriff harborne
    // christopher c s harborne
    if (containsWords(lower, "christopher harborne")) {
      return "Christopher Harborne";
    }

    if (lower.includes("lisbet") && lower.includes("rausing")) {
      return "Anna Lisbet Kristina Rausing";
    }
    if (lower.includes("hans") && lower.includes("rausing")) {
      return "Hans Anders Rausing";
    }
    if (lower.includes("marit") && lower.includes("rausing")) {
      return "Marit M Rausing";
    }
    if (lower.includes("peter rigby")) {
      return "Peter Rigby";
    }
    if (lower.startsWith("ecotricity")) {
      return "Ecotricity Ltd";
    }
    if (lower.startsWith("deloitte")) {
      return "Deloitte LLP";
    }
    if (receiver === "Mark J C Bamford" || receiver === "Mark J Bamford") {
      return "Mark J C Bamford";
    }
    if (lower.includes("pricewater") && lower.includes("coopers")) {
      return "PricewaterhouseCoopers Ltd (PwC)";
    }
    if (lower.includes("rigby group")) {
      return "Rigby Group PLC";
    }
    if (lower.includes("peter j wood")) {
      return "Peter J Wood";
    }
    if (lower.startsWith("msg commercial")) {
      return "MSG Commercial Ltd";
    }
    if (lower.includes("saatchi") && lower.includes("group")) {
      return "Saatchi and Saatchi Group Ltd";
    }

    if (lower.includes("association of conservative clubs")) {
      return "Association of Conservative Clubs";
    }

    if (lower.startsWith("flamingo land")) {
      return "Flamingo Land";
    }

    if (lower.includes("joseph rowntree reform trust")) {
      return "Joseph Rowntree Reform Trust Ltd";
    }

    if (lower === "andrew law" || lower === "andrew e law") {
      return "Andrew E Law";
    }

    if (lower.startsWith("first corporate consultants")) {
      return "First Corporate Consultants Ltd";
    }
    if (lower.startsWith("first corporate shipping")) {
      return "First Corporate Shipping Ltd";
    }

    if (lower.includes("(delivery office southall)")) {
      return "S & J Investments (delivery office Southall) Ltd";
    }

    if (lower.includes("sunley holdings")) {
      return "Sunley Holdings Ltd";
    }

    if (lower.includes("nicholas candy")) {
      return "Nicholas A C Candy";
    }

    if (
      lower.startsWith("associated society of locomotive") ||
      lower === "aslef"
    ) {
      return "Associated Society of Locomotive Engineers and Firemen (ASLEF)";
    }

    if (
      containsWords(lower, "zac goldsmith") ||
      containsWords(lower, "zacharias goldsmith")
    ) {
      return "Zac FR Goldsmith";
    }

    if (containsWords(lower, "annabel goldsmith")) {
      return "Annabel Goldsmith";
    }

    if (containsWords(lower, "benjamin goldsmith")) {
      return "Benjamin J Goldsmith";
    }

    if (
      lower.includes("lionel") &&
      lower.includes("cooke") &&
      lower.includes("memorial")
    ) {
      return "Lionel Cooke Memorial Fund";
    }

    if (
      lower.includes("lionel") &&
      lower.includes("cooke") &&
      lower.includes("memorial")
    ) {
      return "Lionel Cooke Memorial Fund";
    }

    if (containsWords(lower, "bakers food allied")) {
      return "Bakers, Food and Allied Workers' Union (BFAWU)";
    }

    if (containsWords(lower, "broadcasting entertainmant cinematograph")) {
      return "Broadcasting, Entertainment, Cinematograph and Theatre Union (BECTU)";
    }

    if (containsWords(lower, "communication workers union")) {
      return "Communication Workers Union (CWU)";
    }

    if (lower === "community" || lower === "community union") {
      return "Community (trade union)";
    }

    if (lower.startsWith("fire brigades")) {
      return "Fire Brigades Union (FBU)";
    }

    if (lower.startsWith("musicians union")) {
      return "Musicians' Union (MU)";
    }

    if (lower.startsWith("cor unum")) {
      return "Cor Unum";
    }

    if (lower.startsWith("national union of mineworkers")) {
      return "National Union of Mineworkers (NUM)";
    }

    if (lower.startsWith("professional footballers association")) {
      return "Professional Footballers' Association (PFA)";
    }

    if (containsWords(lower, "rail maritime transport")) {
      return "National Union of Rail, Maritime and Transport Workers (RMT)";
    }

    if (containsWords(lower, "transport salaried")) {
      return "Transport Salaried Staffs' Association (TSSA)";
    }

    if (containsWords(lower, "construction trades technicians")) {
      return "Union of Construction, Allied Trades and Technicians (UCATT)";
    }

    if (containsWords(lower, "shop distributive allied") || lower === "usdaw") {
      return "Union of Shop, Distributive and Allied Workers (USDAW)";
    }

    if (
      (lower.includes("peter andrew cruddas") && lower.includes("rt hon")) ||
      lower.includes("peter a cruddas")
    ) {
      return "Peter Andrew Cruddas";
    }

    return (
      receiver
        .trim()
        // remove trailing dot
        .replace(/\.$/, "")
    );
  }
}
