import { getCloudflareContext } from "@opennextjs/cloudflare";

import { countryCodesToCountry } from "../../../../utils/countries";

export async function GET() {
  const { cf } = getCloudflareContext();

  const countryCode = cf?.country;

  if (!countryCode) {
    return Response.json({ country: null });
  }

  const country = countryCodesToCountry[countryCode];

  if (!country) {
    return Response.json({ country: null });
  }

  return Response.json(
    {
      country: countryCode,
    },
    {
      headers: {
        // Cache for 1 year, as country codes rarely change
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
