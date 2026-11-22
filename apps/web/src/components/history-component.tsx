import type { CountryConfig } from "@donationwatch/core/types/country-config";

import { getMostRecent } from "@donationwatch/data/loader/most-recent";

import { DonationHistoryItem } from "@/components/donations/donation-history-item";

export const HistoryComponent = async ({
  country,
}: {
  country: CountryConfig;
}) => {
  const history = await getMostRecent(country.id);

  return (
    <ul className="@container">
      {history.map(({ donor, amount, date, party, id, originalReceiver }) => (
        <DonationHistoryItem
          key={id}
          amount={amount}
          party={party}
          donor={donor}
          date={date}
          originalReceiver={originalReceiver}
        />
      ))}
    </ul>
  );
};
