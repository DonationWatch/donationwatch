import { zipMappings } from "./zip-data";
import { AddressField } from "../../../src/utils/types";

import type { ExtractedDonationAddress } from "../../../src/utils/types";
import type { Countries } from "@/utils/countries";

export const countryCode = (cityLine: string): Countries => {
  if (cityLine.startsWith("A-")) return "AT";
  if (cityLine.startsWith("CH-")) return "CH";
  if (cityLine.startsWith("DK-")) return "DK";
  if (cityLine.includes("Dänemark")) return "DK";
  if (cityLine.includes("København")) return "DK";
  if (cityLine.includes("Thailand")) return "TH";
  if (cityLine.includes("Niederlande")) return "NL";
  if (cityLine.includes("(UK)")) return "UK";

  if (cityLine.split(" ")[0].includes("-")) {
    console.log("unknown country prefix", cityLine);
  }

  return "DE";
};

export const zipCode = (cityLine: string, lines: string[]) => {
  let zip = cityLine.split(" ")[0];

  if (zip.includes("-")) {
    zip = zip.split("-")[1];
  }

  if (zip === "Bangkok") {
    zip = cityLine.replace(/[^0-9]/g, "");
  }

  if (Number.isNaN(parseInt(zip, 10))) {
    console.log("unknown zip", lines);
  }

  return zip;
};

export const extractAddress = (
  lines: string[],
): ExtractedDonationAddress | undefined => {
  if (lines.includes("England")) {
    return { [AddressField.Country]: "UK" };
  }

  if (lines.length === 6 && lines[5] === "Dänemark") {
    // is that Süsdschleswig thing
    return { [AddressField.Country]: "DK" };
  }

  if (lines.length === 3 && lines[2].startsWith("CH")) {
    return { [AddressField.Country]: "CH" };
  }

  const text = lines.join(" ");

  if (text.includes("Österreich")) {
    return { [AddressField.Country]: "AT" };
  }
  if (text.includes("Niederlande")) {
    return { [AddressField.Country]: "NL" };
  }
  if (text.includes("Schweiz")) {
    return { [AddressField.Country]: "CH" };
  }
  if (text.endsWith("England")) {
    return { [AddressField.Country]: "UK" };
  }
  if (text.endsWith("USA") || text.endsWith("(USA)")) {
    return { [AddressField.Country]: "US" };
  }
  if (text.endsWith("Südafrika")) {
    return { [AddressField.Country]: "ZA" };
  }
  if (text.endsWith("Italien")) {
    return { [AddressField.Country]: "IT" };
  }

  if (lines.length > 0) {
    const cityLine = lines.at(-1)!;
    const country = countryCode(cityLine);
    const address: ExtractedDonationAddress = {
      [AddressField.Country]: country,
    };

    if (country === "DE") {
      try {
        address[AddressField.Zip] = zipCode(cityLine, lines);
        address[AddressField.State] = zipToBundesland(
          address[AddressField.Zip],
        );
      } catch (e) {
        console.error(cityLine, lines);
        throw e;
      }
    }

    return address;
  }

  console.log("unknown address", lines);
};

/**
 *
 * @param zip
 * @return {string}
 */
export const zipToBundesland = (zip: string): string => {
  const number = parseInt(zip, 10);

  const found = zipMappings.find(
    (mapping) => mapping.from < number && mapping.till > number,
  );
  if (!found) {
    throw new Error(`Unable to map zipcode: ${zip}`);
  }

  return found.region;
};
