import { zipMappings } from "./zip-data";
import { AddressField } from "../../../src/utils/types";

import type { DonationAddress } from "../../../src/utils/types";
import type { Countries } from "@/utils/countries";

export const extractAddress = (zip: string): DonationAddress => {
  const address: DonationAddress = { [AddressField.Country]: "AT" };

  if (zip.includes("-")) {
    // external donation
    const zipParts = zip.split("-");
    zip = zipParts[1];
    address[AddressField.Country] = zipParts[0] as Countries;
  }

  if (zip.length === 5) {
    return { [AddressField.Country]: "DE" };
  }

  if (Number.isNaN(parseInt(zip, 10))) {
    console.log("unknown zip", zip);
  }

  try {
    if (address[AddressField.Country] === "AT") {
      address[AddressField.State] = zipToBundesland(zip);
    }
  } catch (e) {
    console.error(zip);
    throw e;
  }

  return address;
};

/**
 *
 * @param zip
 * @return {string}
 */
export const zipToBundesland = (zip: string): string => {
  const number = parseInt(zip, 10);

  const found = zipMappings.find(
    (mapping) => mapping.from <= number && number <= mapping.till,
  );
  if (!found) {
    throw new Error(`Unable to map zipcode: ${zip}`);
  }

  return found.region;
};
