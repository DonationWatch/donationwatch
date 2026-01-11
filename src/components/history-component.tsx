"use server";

import { DonationHistoryItem } from "./donation-history-item";
import { getMostRecent } from "../utils/loader/most-recent";

import type { CountryConfig } from "../utils/countries";
import type { FC } from "react";

export const HistoryComponent: FC<{
  country: CountryConfig;
}> = async ({ country }) => {
  const history = await getMostRecent(country.id);

  return (
    <ul className="@container">
      {history.map(({ donor, amount, date, party, id }) => (
        <DonationHistoryItem
          key={id}
          amount={amount}
          party={party}
          donor={donor}
          date={date}
          country={country}
        />
      ))}
    </ul>
  );
};
