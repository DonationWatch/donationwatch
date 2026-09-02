import { select } from "@inquirer/prompts";
import debug from "debug";

import { getPartySync } from "@/config/parties";
import { PartyField } from "@/types/party";
import { Country } from "@/utils/countries";
import {
  type Donation,
  DonationField,
  DonationType,
  DonorType,
} from "@/utils/types";

import { getDonations } from "../data/load-donations";

const log = debug("generate-uk-social-media-posts");
debug.enable("generate-uk-social-media-posts");

const QUARTER_MONTHS: Record<number, string> = {
  1: "January–March",
  2: "April–June",
  3: "July–September",
  4: "October–December",
};

const DONOR_TYPE_LABELS: Partial<Record<DonorType, string>> = {
  [DonorType.Individual]: "Individual",
  [DonorType.Company]: "Company",
  [DonorType.TradeUnion]: "Trade Union",
  [DonorType.UnincorporatedAssociation]: "Unincorporated Association",
  [DonorType.LimitedLiabilityPartnership]: "LLP",
  [DonorType.Trust]: "Trust",
  [DonorType.FriendlySociety]: "Friendly Society",
  [DonorType.BuildingSociety]: "Building Society",
  [DonorType.RegisteredPoliticalParty]: "Political Party",
  [DonorType.PublicFund]: "Public Fund",
  [DonorType.Other]: "Other",
};

const formatCompactGBP = (val: number): string => {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "GBP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(val);
};

const formatExactGBP = (val: number): string => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(val);
};

const formatSignedDelta = (val: number): string => {
  const formatted = formatCompactGBP(Math.abs(val));
  if (val > 0) return `+${formatted}`;
  if (val < 0) return `-${formatted}`;
  return formatted;
};

const formatSignedPct = (pct: number): string => {
  const formatted = `${Math.abs(Math.round(pct))}%`;
  if (pct > 0) return `+${formatted}`;
  if (pct < 0) return `-${formatted}`;
  return formatted;
};

const formatCount = (val: number): string => val.toLocaleString("en");

const getQuarter = (
  dateStr: string,
): { year: number; quarter: number; key: string } => {
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(5, 7), 10);
  const quarter = Math.ceil(month / 3);
  return { year, quarter, key: `${year}-Q${quarter}` };
};

const getQuarterDateRange = (
  year: number,
  quarter: number,
): { startStr: string; endStr: string } => {
  const startMonth = (quarter - 1) * 3 + 1;
  const endMonth = quarter * 3;
  const startStr = `${year}-${String(startMonth).padStart(2, "0")}-01`;
  const lastDay = new Date(year, endMonth, 0).getDate();
  const endStr = `${year}-${String(endMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startStr, endStr };
};

const filterDonationsByQuarter = (
  donations: Donation[],
  year: number,
  quarter: number,
): Donation[] => {
  const { startStr, endStr } = getQuarterDateRange(year, quarter);
  return donations.filter(
    (d) => d[DonationField.Date] >= startStr && d[DonationField.Date] <= endStr,
  );
};

const isPublicFund = (donation: Donation): boolean => {
  return (
    donation[DonationField.DonationType] === DonationType.PublicFunds ||
    donation[DonationField.DonorType] === DonorType.PublicFund
  );
};

const resolvePartyName = (partyId: string): string => {
  const party = getPartySync(Country.unitedkingdom, partyId as never);
  return party?.[PartyField.Short] || partyId;
};

const promptQuarterSelection = async (
  availableQuarters: { year: number; quarter: number; key: string }[],
): Promise<{ year: number; quarter: number }> => {
  const envQuarter = process.env["QUARTER"];
  const cliQuarter = process.argv
    .slice(2)
    .find((arg) => /^\d{4}-?Q[1-4]$/i.test(arg));
  const target = envQuarter || cliQuarter;

  if (target) {
    const match = target.match(/^(\d{4})-?Q?([1-4])$/i);
    if (match) {
      return {
        year: parseInt(match[1]!, 10),
        quarter: parseInt(match[2]!, 10),
      };
    }
  }

  if (process.env["CI"] === "true" && availableQuarters[0]) {
    return availableQuarters[0];
  }

  const selectedKey = await select({
    message: "Which quarter do you want to generate UK social media posts for?",
    choices: availableQuarters.map((q) => ({
      name: `${q.key} (${QUARTER_MONTHS[q.quarter]})`,
      value: q.key,
    })),
    default: availableQuarters[0]?.key,
  });

  const parsed = availableQuarters.find((q) => q.key === selectedKey);
  if (!parsed) {
    throw new Error(`Invalid quarter selected: ${selectedKey}`);
  }
  return parsed;
};

const generateTweet1 = (
  year: number,
  quarter: number,
  donations: Donation[],
): string => {
  const partySums: Record<string, { sum: number; count: number }> = {};
  for (const d of donations) {
    const receiver = d[DonationField.Receiver];
    partySums[receiver] ??= { sum: 0, count: 0 };
    partySums[receiver].sum += d[DonationField.Amount];
    partySums[receiver].count += 1;
  }

  const sortedParties = Object.entries(partySums).toSorted(
    ([, a], [, b]) => b.sum - a.sum,
  );
  const totalSum = donations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );
  const totalParties = sortedParties.length;

  const PARTIES_TO_LIST_FULLY = 3;
  const topParties = sortedParties.slice(0, PARTIES_TO_LIST_FULLY);
  const otherParties = sortedParties.slice(PARTIES_TO_LIST_FULLY);
  const otherSum = otherParties.reduce((acc, [, p]) => acc + p.sum, 0);
  const otherCount = otherParties.reduce((acc, [, p]) => acc + p.count, 0);

  let tweet = `🇬🇧 UK Electoral Commission data update: Q${quarter} ${year} (${QUARTER_MONTHS[quarter]})\n\n`;
  tweet += `Top reported party donations:\n`;
  for (const [partyId, data] of topParties) {
    tweet += `• ${resolvePartyName(partyId)}: ${formatCompactGBP(data.sum)} (${formatCount(data.count)} donations)\n`;
  }
  if (otherParties.length > 0) {
    tweet += `• All other parties: ${formatCompactGBP(otherSum)} (${formatCount(otherCount)} donations)\n`;
  }
  tweet += `\nTotal: ${formatCompactGBP(totalSum)} across ${totalParties} parties.\n\n`;
  tweet += `Explore the full dataset: donation.watch/en/unitedkingdom\n#UKpolitics #transparency`;

  return tweet;
};

const generateTweet2 = (
  year: number,
  quarter: number,
  allDonations: Donation[],
  currentDonations: Donation[],
): string => {
  const totalSum = currentDonations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );
  const totalCount = currentDonations.length;

  const prevQuarter = quarter === 1 ? 4 : quarter - 1;
  const prevQuarterYear = quarter === 1 ? year - 1 : year;
  const prevQuarterDonations = filterDonationsByQuarter(
    allDonations,
    prevQuarterYear,
    prevQuarter,
  );
  const prevQuarterSum = prevQuarterDonations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );

  const prevYearDonations = filterDonationsByQuarter(
    allDonations,
    year - 1,
    quarter,
  );
  const prevYearSum = prevYearDonations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );

  const deltaQoQ = totalSum - prevQuarterSum;
  const pctQoQ =
    prevQuarterSum > 0
      ? ((totalSum - prevQuarterSum) / prevQuarterSum) * 100
      : 0;

  const deltaYoY = totalSum - prevYearSum;
  const pctYoY =
    prevYearSum > 0 ? ((totalSum - prevYearSum) / prevYearSum) * 100 : 0;

  const qoqText =
    prevQuarterDonations.length > 0
      ? `${formatSignedDelta(deltaQoQ)} (${formatSignedPct(pctQoQ)})`
      : "N/A";
  const yoyText =
    prevYearDonations.length > 0
      ? `${formatSignedDelta(deltaYoY)} (${formatSignedPct(pctYoY)})`
      : "N/A";

  let tweet = `🇬🇧 The UK Electoral Commission published Q${quarter} ${year} political donation reports.\n\n`;
  tweet += `Key figures:\n`;
  tweet += `• Total accepted: ${formatCompactGBP(totalSum)} (${formatCount(totalCount)} donations)\n`;
  tweet += `• Change from Q${prevQuarter} ${prevQuarterYear}: ${qoqText}\n`;
  tweet += `• Change from Q${quarter} ${year - 1}: ${yoyText}\n\n`;
  tweet += `Full breakdown by party and category: donation.watch/en/unitedkingdom\n#data #transparency`;

  return tweet;
};

const generateTweet3 = (
  year: number,
  quarter: number,
  donations: Donation[],
): string => {
  const privateDonations = donations.filter((d) => !isPublicFund(d));
  const publicDonations = donations.filter((d) => isPublicFund(d));

  const privateSum = privateDonations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );
  const privateCount = privateDonations.length;
  const publicSum = publicDonations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );

  const privatePartySums: Record<string, number> = {};
  for (const d of privateDonations) {
    const receiver = d[DonationField.Receiver];
    privatePartySums[receiver] =
      (privatePartySums[receiver] || 0) + d[DonationField.Amount];
  }
  const topPrivateParties = Object.entries(privatePartySums)
    .toSorted(([, a], [, b]) => b - a)
    .slice(0, 3);

  let tweet = `🇬🇧 UK Political Finance: Q${quarter} ${year} breakdown by source type.\n\n`;
  tweet += `• Private donations: ${formatCompactGBP(privateSum)} (${formatCount(privateCount)} donations)\n`;
  tweet += `• Public funds accepted: ${formatCompactGBP(publicSum)}\n\n`;
  tweet += `Parties with highest private funding:\n`;
  topPrivateParties.forEach(([partyId, sum], idx) => {
    tweet += `${idx + 1}. ${resolvePartyName(partyId)}: ${formatCompactGBP(sum)}\n`;
  });
  tweet += `\nDetails and donor records: donation.watch/en/unitedkingdom\n#opendata #UKpolitics`;

  return tweet;
};

const generateTweet4 = (
  year: number,
  quarter: number,
  donations: Donation[],
): string => {
  const privateDonations = donations.filter((d) => !isPublicFund(d));
  const sorted = [...privateDonations].toSorted(
    (a, b) => b[DonationField.Amount] - a[DonationField.Amount],
  );
  const topDonations = sorted.slice(0, 3);

  let tweet = `🇬🇧 Largest single donations reported in Q${quarter} ${year} (UK Electoral Commission):\n\n`;
  for (const d of topDonations) {
    const partyName = resolvePartyName(d[DonationField.Receiver]);
    const donorCategory =
      DONOR_TYPE_LABELS[d[DonationField.DonorType] ?? DonorType.Other] ||
      "Other";
    tweet += `• ${formatExactGBP(d[DonationField.Amount])} to ${partyName} from ${d[DonationField.DonorName]} (${donorCategory})\n`;
  }
  tweet += `\nFull searchable donor database: donation.watch/en/unitedkingdom\n#transparency #data`;

  return tweet;
};

const generateTweet5 = (
  year: number,
  quarter: number,
  donations: Donation[],
): string => {
  const totalSum = donations.reduce(
    (acc, d) => acc + d[DonationField.Amount],
    0,
  );

  let individualsSum = 0;
  let tradeUnionsSum = 0;
  let companiesSum = 0;
  let publicFundsSum = 0;
  let otherSum = 0;

  for (const d of donations) {
    if (isPublicFund(d)) {
      publicFundsSum += d[DonationField.Amount];
      continue;
    }

    const t = d[DonationField.DonorType];
    if (t === DonorType.Individual) {
      individualsSum += d[DonationField.Amount];
    } else if (t === DonorType.TradeUnion) {
      tradeUnionsSum += d[DonationField.Amount];
    } else if (
      t === DonorType.Company ||
      t === DonorType.LimitedLiabilityPartnership
    ) {
      companiesSum += d[DonationField.Amount];
    } else {
      otherSum += d[DonationField.Amount];
    }
  }

  const categories = [
    { label: "Individuals", sum: individualsSum },
    { label: "Public Funds", sum: publicFundsSum },
    { label: "Companies", sum: companiesSum },
    { label: "Trade Unions", sum: tradeUnionsSum },
    { label: "Other / Unincorporated", sum: otherSum },
  ]
    .filter((cat) => cat.sum > 0)
    .toSorted((a, b) => b.sum - a.sum);

  let tweet = `🇬🇧 UK party donations by entity type for Q${quarter} ${year}:\n\n`;
  for (const cat of categories) {
    const pct = totalSum > 0 ? (cat.sum / totalSum) * 100 : 0;
    tweet += `• ${cat.label}: ${formatCompactGBP(cat.sum)} (${Math.round(pct)}%)\n`;
  }
  tweet += `\nTotal reported: ${formatCompactGBP(totalSum)}.\n\n`;
  tweet += `Verify the records: donation.watch/en/unitedkingdom\n#statistics #transparency`;

  return tweet;
};

const main = async () => {
  const allDonations = await getDonations(Country.unitedkingdom);

  // Group unique quarters from donations
  const quarterMap = new Map<
    string,
    { year: number; quarter: number; key: string }
  >();
  for (const d of allDonations) {
    const qInfo = getQuarter(d[DonationField.Date]);
    if (!quarterMap.has(qInfo.key)) {
      quarterMap.set(qInfo.key, qInfo);
    }
  }

  const availableQuarters = Array.from(quarterMap.values()).toSorted((a, b) =>
    b.key.localeCompare(a.key),
  );

  const { year, quarter } = await promptQuarterSelection(availableQuarters);
  log(`Selected quarter: Q${quarter} ${year}`);

  const currentDonations = filterDonationsByQuarter(
    allDonations,
    year,
    quarter,
  );

  if (currentDonations.length === 0) {
    console.log(`\nNo donations found for Q${quarter} ${year}.\n`);
    return;
  }

  const tweet1 = generateTweet1(year, quarter, currentDonations);
  const tweet2 = generateTweet2(year, quarter, allDonations, currentDonations);
  const tweet3 = generateTweet3(year, quarter, currentDonations);
  const tweet4 = generateTweet4(year, quarter, currentDonations);
  const tweet5 = generateTweet5(year, quarter, currentDonations);

  const tweets = [
    {
      title: "1. Party Breakdown (Refined Standard)",
      content: tweet1,
    },
    {
      title: "2. Macro Overview and Historical Comparison (QoQ / YoY)",
      content: tweet2,
    },
    {
      title: "3. Private Donations vs. Public Funding",
      content: tweet3,
    },
    {
      title: "4. Largest Single Donations",
      content: tweet4,
    },
    {
      title: "5. Donor Type Breakdown",
      content: tweet5,
    },
  ];

  console.log(`\n========================================`);
  console.log(`  🇬🇧 UK Social Media Posts — Q${quarter} ${year}`);
  console.log(`========================================\n`);

  for (const { title, content } of tweets) {
    console.log(`### ${title}\n`);
    console.log(content);
    console.log(`\n----------------------------------------\n`);
  }
};

main();
