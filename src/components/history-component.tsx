import type { CountryConfig } from "@/types/country-config";

import { DonationHistoryItem } from "@/components/donations/donation-history-item";
import { getMostRecent } from "@/utils/loader/most-recent";

export const HistoryComponent = async ({
  country,
}: {
  country: CountryConfig;
}) => {
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
